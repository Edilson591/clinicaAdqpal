import type { AppointmentStatus } from "../../domain/entities/Appointment";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
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

interface AppointmentMessageData {
  patientName: string;
  doctorName: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes: string | null;
}

export function buildAppointmentMessage(data: AppointmentMessageData): string {
  const { patientName, doctorName, scheduledAt, status, notes } = data;
  const details = [
    `📅 *Data:* ${formatDate(scheduledAt)}`,
    `🕐 *Horário:* ${formatTime(scheduledAt)}`,
    `👨‍⚕️ *Médico:* ${doctorName}`,
  ];

  if (status === "CANCELLED" || status === "CANCELED") {
    return [
      `Olá, ${patientName}!`,
      "",
      "Informamos que seu agendamento no *Instituto ADQPAL* foi *cancelado*.",
      "",
      ...details,
      "",
      "Se precisar agendar um novo horário, entre em contato conosco.",
      "",
      "Instituto ADQPAL 🏥",
    ].join("\n");
  }

  if (status === "COMPLETED") {
    return [
      `Olá, ${patientName}!`,
      "",
      "Seu atendimento no *Instituto ADQPAL* foi concluído.",
      "",
      ...details,
      "",
      "*Pesquisa rápida de satisfação*",
      "De 1 a 5, como você avalia o atendimento recebido?",
      "Responda esta mensagem apenas com a sua nota. Sua opinião é muito importante para nós!",
      "",
      "Instituto ADQPAL 🏥",
    ].join("\n");
  }

  return [
    `Olá, ${patientName}! 👋`,
    "",
    "Sua consulta está confirmada no *Instituto ADQPAL - Associação dos Dependentes Químicos e Portadores de Doenças Psiquiátricas de São Miguel dos Campos - Alagoas*.",
    "",
    ...details,
    `📋 *Status:* ${STATUS_LABELS[status]}`,
    notes ? `📝 *Observações:* ${notes}` : null,
    "",
    "Caso precise reagendar ou cancelar, entre em contato conosco.",
    "",
    "Instituto ADQPAL 🏥",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
