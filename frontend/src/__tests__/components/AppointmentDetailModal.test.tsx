import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppointmentDetailModal } from "../../components/Agenda/AppointmentDetailModal";
import type {
  AppointmentResponse,
  PatientResponse,
} from "../../types/api";

const updateAppointment = vi.fn();
const sendWhatsApp = vi.fn();

vi.mock("../../hooks/useAppointments", () => ({
  useUpdateAppointment: () => ({
    mutateAsync: updateAppointment,
    isPending: false,
  }),
  useSendWhatsApp: () => ({
    mutateAsync: sendWhatsApp,
    isPending: false,
  }),
}));

const patient = {
  id: "patient-1",
  name: "Maria Silva",
  phone: "(82) 99999-1234",
} as PatientResponse;

const appointment = {
  id: "appointment-1",
  userId: "doctor-1",
  patientId: patient.id,
  scheduledAt: "2026-08-05T14:30:00.000Z",
  status: "CONFIRMED",
  type: "IN_PERSON",
  pacient: patient,
  specialtyId: null,
  roomId: null,
  meetingLink: null,
  address: null,
  notes: null,
  medicalRecordId: null,
  createdAt: "2026-08-01T12:00:00.000Z",
  updatedAt: "2026-08-01T12:00:00.000Z",
} as AppointmentResponse;

describe("AppointmentDetailModal", () => {
  beforeEach(() => {
    updateAppointment.mockReset().mockResolvedValue({
      ...appointment,
      status: "COMPLETED",
    });
    sendWhatsApp.mockReset().mockResolvedValue({ channels: ["whatsapp"] });
  });

  it("sends WhatsApp after completing an appointment", async () => {
    const onClose = vi.fn();
    render(
      <AppointmentDetailModal
        appointment={appointment}
        patient={patient}
        doctor={undefined}
        showDoctor={false}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Concluída" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(updateAppointment).toHaveBeenCalledWith({
        id: appointment.id,
        data: { status: "COMPLETED" },
      });
      expect(sendWhatsApp).toHaveBeenCalledWith({
        id: appointment.id,
        data: { telefone: "+5582999991234", channels: ["whatsapp"] },
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    expect(updateAppointment.mock.invocationCallOrder[0]).toBeLessThan(
      sendWhatsApp.mock.invocationCallOrder[0],
    );
  });

  it("does not send WhatsApp for a confirmed appointment", async () => {
    const scheduledAppointment = {
      ...appointment,
      status: "SCHEDULED" as const,
    };
    const onClose = vi.fn();
    render(
      <AppointmentDetailModal
        appointment={scheduledAppointment}
        patient={patient}
        doctor={undefined}
        showDoctor={false}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirmado" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(sendWhatsApp).not.toHaveBeenCalled();
  });
});
