import prisma from "../database/prismaClient";
import { getNotificationQueue, type NotificationChannel } from "./NotificationQueue";

const POLL_INTERVAL_MS = 1_000;
const BATCH_SIZE = 50;

let dispatching = false;

export async function dispatchPendingNotifications(): Promise<void> {
  if (dispatching) return;
  dispatching = true;

  try {
    const pending = await prisma.notificationOutbox.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: BATCH_SIZE,
    });

    for (const outbox of pending) {
      try {
        await getNotificationQueue().add(
          "send-notification",
          {
            outboxId: outbox.id,
            appointmentId: outbox.appointmentId,
            telefone: outbox.telefone,
            channels: [outbox.channel as NotificationChannel],
          },
          { jobId: `notification-${outbox.id}` },
        );

        await prisma.notificationOutbox.updateMany({
          where: { id: outbox.id, status: "PENDING" },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
            lastError: null,
          },
        });
      } catch (err) {
        await prisma.notificationOutbox.updateMany({
          where: { id: outbox.id, status: "PENDING" },
          data: {
            lastError: err instanceof Error ? err.message : String(err),
          },
        });
      }
    }
  } finally {
    dispatching = false;
  }
}

export function startNotificationOutboxDispatcher(): NodeJS.Timeout {
  void dispatchPendingNotifications().catch((err) => {
    console.error("[NotificationOutbox] erro ao publicar:", err);
  });

  const timer = setInterval(() => {
    void dispatchPendingNotifications().catch((err) => {
      console.error("[NotificationOutbox] erro ao publicar:", err);
    });
  }, POLL_INTERVAL_MS);
  timer.unref();
  return timer;
}
