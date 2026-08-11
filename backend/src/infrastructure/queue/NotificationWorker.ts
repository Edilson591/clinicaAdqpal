import { Worker, type Job } from "bullmq";
import { WhatsAppService } from "../services/WhatsAppService";
import { SmsService } from "../services/SmsService";
import prisma from "../database/prismaClient";
import {
  NOTIFICATION_QUEUE,
  type NotificationJobData,
} from "./NotificationQueue";
import { getBullMQRedis } from "../cache/RedisBullMQ";
import { buildAppointmentMessage } from "./AppointmentNotification";
import { toPatientDomain } from "../mappers/patientPersistenceMapper";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Strips markdown (*bold*) and most emojis for plain SMS text
function toSmsText(message: string): string {
  return message
    .replace(/\*/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .trim();
}

// ─── Send logic (shared between worker and direct Vercel call) ──────────────

export async function sendNotification(data: NotificationJobData): Promise<void> {
  const { appointmentId, telefone, channels } = data;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, user: true },
  });

  if (!appointment) {
    throw new Error(`Consulta ${appointmentId} não encontrada`);
  }

  const patient = toPatientDomain(appointment.patient);
  const recipientPhone = patient.phone ?? telefone;
  const doctorName = appointment.medico ?? appointment.user.username;
  const richMessage = buildAppointmentMessage({
    patientName: patient.name,
    doctorName,
    scheduledAt: appointment.scheduledAt,
    status: appointment.status,
    notes: appointment.notes ?? null,
  });

  const errors: string[] = [];

  if (channels.includes("whatsapp")) {
    try {
      await new WhatsAppService().sendTextMessage({
        number: recipientPhone,
        text: richMessage,
      });
    } catch (err) {
      errors.push(`WhatsApp: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (channels.includes("sms")) {
    try {
      await new SmsService().sendSms(recipientPhone, toSmsText(richMessage));
    } catch (err) {
      errors.push(`SMS: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }
}

type NotificationSender = (data: NotificationJobData) => Promise<void>;

export async function processNotificationJob(
  job: Job<NotificationJobData>,
  sender: NotificationSender = sendNotification,
): Promise<void> {
  const { outboxId } = job.data;
  const attemptNumber = job.attemptsMade + 1;
  const maxAttempts = job.opts.attempts ?? 1;

  try {
    if (outboxId) {
      const outbox = await prisma.notificationOutbox.findUnique({
        where: { id: outboxId },
        select: { status: true },
      });
      if (outbox?.status === "SENT") return;

      await prisma.notificationOutbox.updateMany({
        where: { id: outboxId },
        data: {
          status: "PROCESSING",
          attemptCount: attemptNumber,
          lastAttemptAt: new Date(),
          lastError: null,
        },
      });
    }

    await sender(job.data);

    if (outboxId) {
      await prisma.notificationOutbox.updateMany({
        where: { id: outboxId },
        data: { status: "SENT", sentAt: new Date(), lastError: null },
      });
    }
  } catch (err) {
    if (outboxId) {
      try {
        await prisma.notificationOutbox.updateMany({
          where: { id: outboxId },
          data: {
            status: attemptNumber >= maxAttempts ? "FAILED" : "PUBLISHED",
            lastError: err instanceof Error ? err.message : String(err),
          },
        });
      } catch (statusErr) {
        console.error("[Worker] erro ao atualizar outbox:", statusErr);
      }
    }
    throw err;
  }
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function startNotificationWorker(): Worker<NotificationJobData> {
  const worker = new Worker<NotificationJobData>(
    NOTIFICATION_QUEUE,
    async (job: Job<NotificationJobData>) => {
      await processNotificationJob(job);
    },
    {
      connection: getBullMQRedis(),
      concurrency: 5,
      lockDuration: 120000,
      lockRenewTime: 15000, 
    }
  );

  worker.on("completed", (job) => {
    console.info(`[Worker] Job ${job.id} concluído`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[Worker] Job ${job?.id} falhou (tentativa ${job?.attemptsMade}/${job?.opts.attempts}): ${err.message}`
    );

    if (
      job?.data.outboxId &&
      job.attemptsMade >= (job.opts.attempts ?? 1)
    ) {
      void prisma.notificationOutbox.updateMany({
        where: { id: job.data.outboxId },
        data: { status: "FAILED", lastError: err.message },
      }).catch((statusErr: unknown) => {
        console.error("[Worker] erro ao marcar outbox como FAILED:", statusErr);
      });
    }
  });

  console.info("[Worker] NotificationWorker iniciado");
  return worker;
}
