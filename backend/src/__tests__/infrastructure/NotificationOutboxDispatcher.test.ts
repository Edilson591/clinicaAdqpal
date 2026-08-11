const findMany = jest.fn();
const updateMany = jest.fn();
const add = jest.fn();

jest.mock("../../infrastructure/database/prismaClient", () => ({
  __esModule: true,
  default: {
    notificationOutbox: { findMany, updateMany },
  },
}));

jest.mock("../../infrastructure/queue/NotificationQueue", () => ({
  getNotificationQueue: () => ({ add }),
}));

import { dispatchPendingNotifications } from "../../infrastructure/queue/NotificationOutboxDispatcher";

describe("NotificationOutboxDispatcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateMany.mockResolvedValue({ count: 1 });
  });

  it("publishes one idempotent BullMQ job per outbox channel", async () => {
    findMany.mockResolvedValue([
      {
        id: "outbox-whatsapp",
        appointmentId: "appointment-1",
        telefone: "+5511999999999",
        channel: "whatsapp",
      },
      {
        id: "outbox-sms",
        appointmentId: "appointment-1",
        telefone: "+5511999999999",
        channel: "sms",
      },
    ]);
    add.mockResolvedValue({ id: "job" });

    await dispatchPendingNotifications();

    expect(add).toHaveBeenNthCalledWith(
      1,
      "send-notification",
      expect.objectContaining({
        outboxId: "outbox-whatsapp",
        channels: ["whatsapp"],
      }),
      { jobId: "notification-outbox-whatsapp" },
    );
    expect(add).toHaveBeenNthCalledWith(
      2,
      "send-notification",
      expect.objectContaining({ outboxId: "outbox-sms", channels: ["sms"] }),
      { jobId: "notification-outbox-sms" },
    );
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "outbox-whatsapp", status: "PENDING" },
        data: expect.objectContaining({ status: "PUBLISHED" }),
      }),
    );
  });

  it("keeps a failed publication pending for the next poll", async () => {
    findMany.mockResolvedValue([
      {
        id: "outbox-1",
        appointmentId: "appointment-1",
        telefone: "+5511999999999",
        channel: "whatsapp",
      },
    ]);
    add.mockRejectedValue(new Error("Redis unavailable"));

    await dispatchPendingNotifications();

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "outbox-1", status: "PENDING" },
      data: { lastError: "Redis unavailable" },
    });
  });
});
