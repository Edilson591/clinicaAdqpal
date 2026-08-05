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

  const doctorName = appointment.medico ?? appointment.user.username;
  const richMessage = buildAppointmentMessage({
    patientName: appointment.patient.name,
    doctorName,
    scheduledAt: appointment.scheduledAt,
    status: appointment.status,
    notes: appointment.notes ?? null,
  });

  const errors: string[] = [];

  if (channels.includes("whatsapp")) {
    try {
      await new WhatsAppService().sendTextMessage({
        number: telefone,
        text: richMessage,
      });
    } catch (err) {
      errors.push(`WhatsApp: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (channels.includes("sms")) {
    try {
      await new SmsService().sendSms(telefone, toSmsText(richMessage));
    } catch (err) {
      errors.push(`SMS: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function startNotificationWorker(): Worker<NotificationJobData> {
  const worker = new Worker<NotificationJobData>(
    NOTIFICATION_QUEUE,
    async (job: Job<NotificationJobData>) => {
      await sendNotification(job.data);
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
  });

  console.info("[Worker] NotificationWorker iniciado");
  return worker;
}
