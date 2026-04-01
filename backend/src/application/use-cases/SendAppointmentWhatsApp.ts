import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import { WhatsAppService } from "../../infrastructure/services/WhatsAppService";
import { DomainError } from "../../domain/errors/DomainError";

// =============================================================================
// USE CASE: Send appointment confirmation via WhatsApp
// =============================================================================

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
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

export class SendAppointmentWhatsApp {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly whatsAppService: WhatsAppService
  ) {}

  async execute(appointmentId: string, telefone: string): Promise<void> {
    // 1. Fetch appointment with patient + user relations
    const appointment = await this.appointmentRepository.findByIdWithRelations(appointmentId);
    if (!appointment) {
      throw new DomainError("Consulta não encontrada", 404);
    }

    // 2. Resolve doctor name: use medico field or fall back to user.username
    const doctorName = appointment.medico ?? appointment.user.username;

    // 3. Build the WhatsApp message
    const message = [
      `Olá, ${appointment.patient.name}! 👋`,
      "",
      "Sua consulta está confirmada no *Instituto ADQPAL*:",
      "",
      `📅 *Data:* ${formatDate(appointment.scheduledAt)}`,
      `🕐 *Horário:* ${formatTime(appointment.scheduledAt)}`,
      `👨‍⚕️ *Médico:* ${doctorName}`,
      `📋 *Status:* ${STATUS_LABELS[appointment.status] ?? appointment.status}`,
      appointment.notes ? `📝 *Observações:* ${appointment.notes}` : null,
      "",
      "Caso precise reagendar ou cancelar, entre em contato conosco.",
      "",
      "Instituto ADQPAL 🏥",
    ]
      .filter((line) => line !== null)
      .join("\n");

    // 4. Send via WhatsApp
    try {
      await this.whatsAppService.sendTextMessage({ to: telefone, body: message });
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new DomainError(`Falha ao enviar mensagem WhatsApp: ${detail}`, 502);
    }
  }
}
