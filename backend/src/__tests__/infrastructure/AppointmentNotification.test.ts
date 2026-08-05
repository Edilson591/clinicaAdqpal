import {
  buildAppointmentMessage,
  shouldSendAutomaticAppointmentNotification,
} from "../../infrastructure/queue/AppointmentNotification";

const baseMessageData = {
  patientName: "Maria Silva",
  doctorName: "Dr. João",
  scheduledAt: new Date("2026-08-05T14:30:00.000Z"),
  notes: null,
};

describe("AppointmentNotification", () => {
  it("builds a cancellation message", () => {
    const message = buildAppointmentMessage({
      ...baseMessageData,
      status: "CANCELLED",
    });

    expect(message).toContain("agendamento");
    expect(message).toContain("*cancelado*");
    expect(message).toContain("novo horário");
    expect(message).not.toContain("Pesquisa rápida");
  });

  it("builds a completion message with the satisfaction survey", () => {
    const message = buildAppointmentMessage({
      ...baseMessageData,
      status: "COMPLETED",
    });

    expect(message).toContain("atendimento");
    expect(message).toContain("concluído");
    expect(message).toContain("Pesquisa rápida de satisfação");
    expect(message).toContain("De 1 a 5");
  });

  it("keeps the confirmation message for other statuses", () => {
    const message = buildAppointmentMessage({
      ...baseMessageData,
      status: "CONFIRMED",
      notes: "Levar documento",
    });

    expect(message).toContain("consulta está confirmada");
    expect(message).toContain("*Status:* Confirmada");
    expect(message).toContain("Levar documento");
  });

  it("notifies only on a real transition to completed or cancelled", () => {
    expect(
      shouldSendAutomaticAppointmentNotification("CONFIRMED", "COMPLETED"),
    ).toBe(true);
    expect(
      shouldSendAutomaticAppointmentNotification("SCHEDULED", "CANCELED"),
    ).toBe(true);
    expect(
      shouldSendAutomaticAppointmentNotification("COMPLETED", "COMPLETED"),
    ).toBe(false);
    expect(
      shouldSendAutomaticAppointmentNotification("SCHEDULED", "CONFIRMED"),
    ).toBe(false);
    expect(
      shouldSendAutomaticAppointmentNotification("SCHEDULED", undefined),
    ).toBe(false);
  });
});
