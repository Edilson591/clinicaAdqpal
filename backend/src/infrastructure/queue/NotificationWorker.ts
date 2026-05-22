import { Worker, type Job } from "bullmq";
import { WhatsAppService } from "../services/WhatsAppService";
import { SmsService } from "../services/SmsService";
import prisma from "../database/prismaClient";
import {
  NOTIFICATION_QUEUE,
  type NotificationJobData,
} from "./NotificationQueue";
import { getBullMQRedis } from "../cache/RedisBullMQ";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendada",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  CANCELED: "Cancelada",
  NO_SHOW: "Não compareceu",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildMessage(
  patientName: string,
  doctorName: string,
  scheduledAt: Date,
  status: string,
  notes: string | null
): string {
  return [
    `Olá, ${patientName}! 👋`,
    "",
    "Sua consulta está confirmada no *Instituto ADQPAL*:",
    "",
    `📅 *Data:* ${formatDate(scheduledAt)}`,
    `🕐 *Horário:* ${formatTime(scheduledAt)}`,
    `👨‍⚕️ *Médico:* ${doctorName}`,
    `📋 *Status:* ${STATUS_LABELS[status] ?? status}`,
    notes ? `📝 *Observações:* ${notes}` : null,
    "",
    "Caso precise reagendar ou cancelar, entre em contato conosco.",
    "",
    "Instituto ADQPAL 🏥",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

// Strips markdown (*bold*) and most emojis for plain SMS text
function toSmsText(message: string): string {
  return message
    .replace(/\*/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .trim();
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function startNotificationWorker(): Worker<NotificationJobData> {
  const worker = new Worker<NotificationJobData>(
    NOTIFICATION_QUEUE,
    async (job: Job<NotificationJobData>) => {
      const { appointmentId, telefone, channels } = job.data;

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { patient: true, user: true },
      });

      if (!appointment) {
        throw new Error(`Consulta ${appointmentId} não encontrada`);
      }

      const doctorName = appointment.medico ?? appointment.user.username;
      const richMessage = buildMessage(
        appointment.patient.name,
        doctorName,
        appointment.scheduledAt,
        appointment.status,
        appointment.notes ?? null
      );

      const errors: string[] = [];

      if (channels.includes("whatsapp")) {
        try {
          await new WhatsAppService().sendTextMessage({
            number: telefone,
            text: richMessage,
          });
          console.info(`[Worker] WhatsApp enviado — job ${job.id}`);
        } catch (err) {
          errors.push(`WhatsApp: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      if (channels.includes("sms")) {
        try {
          await new SmsService().sendSms(telefone, toSmsText(richMessage));
          console.info(`[Worker] SMS enviado — job ${job.id}`);
        } catch (err) {
          errors.push(`SMS: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      // If at least one channel failed, throw so BullMQ retries the job
      if (errors.length > 0) {
        throw new Error(errors.join(" | "));
      }
    },
    {
      connection: getBullMQRedis(),
      concurrency: 5,
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
