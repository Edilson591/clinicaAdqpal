import type { Job } from "bullmq";
import type { NotificationJobData } from "../../infrastructure/queue/NotificationQueue";

const updateMany = jest.fn();
const findUnique = jest.fn();

jest.mock("../../infrastructure/database/prismaClient", () => ({
  __esModule: true,
  default: {
    notificationOutbox: { findUnique, updateMany },
  },
}));

import { processNotificationJob } from "../../infrastructure/queue/NotificationWorker";

function createJob(attemptsMade = 0): Job<NotificationJobData> {
  return {
    data: {
      outboxId: "outbox-1",
      appointmentId: "appointment-1",
      telefone: "+5511999999999",
      channels: ["whatsapp"],
    },
    attemptsMade,
    opts: { attempts: 3 },
  } as Job<NotificationJobData>;
}

describe("NotificationWorker outbox status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findUnique.mockResolvedValue({ status: "PUBLISHED" });
    updateMany.mockResolvedValue({ count: 1 });
  });

  it("marks a successful delivery as SENT", async () => {
    const sender = jest.fn().mockResolvedValue(undefined);

    await processNotificationJob(createJob(), sender);

    expect(updateMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PROCESSING",
          attemptCount: 1,
        }),
      }),
    );
    expect(updateMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({ status: "SENT", sentAt: expect.any(Date) }),
      }),
    );
  });

  it("does not call the provider again when the outbox is already SENT", async () => {
    findUnique.mockResolvedValue({ status: "SENT" });
    const sender = jest.fn();

    await processNotificationJob(createJob(), sender);

    expect(sender).not.toHaveBeenCalled();
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("returns to PUBLISHED while BullMQ still has retries", async () => {
    const sender = jest.fn().mockRejectedValue(new Error("Provider unavailable"));

    await expect(processNotificationJob(createJob(1), sender)).rejects.toThrow(
      "Provider unavailable",
    );

    expect(updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: { status: "PUBLISHED", lastError: "Provider unavailable" },
      }),
    );
  });

  it("marks the outbox as FAILED after the final attempt", async () => {
    const sender = jest.fn().mockRejectedValue(new Error("Permanent failure"));

    await expect(processNotificationJob(createJob(2), sender)).rejects.toThrow(
      "Permanent failure",
    );

    expect(updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: { status: "FAILED", lastError: "Permanent failure" },
      }),
    );
  });
});
