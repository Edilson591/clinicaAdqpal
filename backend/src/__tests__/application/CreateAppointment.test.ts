import { CreateAppointment } from "../../application/use-cases/CreateAppointment";
import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type { Appointment } from "../../domain/entities/Appointment";

const mockAppointment: Appointment = {
  id: "appt-1",
  userId: "user-1",
  patientId: "patient-1",
  scheduledAt: new Date("2025-06-01T14:30:00Z"),
  medico: null,
  status: "SCHEDULED",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRepo(): jest.Mocked<IAppointmentRepository> {
  return {
    create: jest.fn().mockResolvedValue(mockAppointment),
    findById: jest.fn(),
    findByPatientId: jest.fn(),
    findByUserId: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<IAppointmentRepository>;
}

describe("CreateAppointment", () => {
  it("calls repository.create with correct data", async () => {
    const repo = makeRepo();
    const useCase = new CreateAppointment(repo);

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      scheduledAt: new Date("2025-06-01T14:30:00Z"),
    });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", patientId: "patient-1" }),
    );
  });

  it("returns a mapped AppointmentResponseDTO", async () => {
    const repo = makeRepo();
    const useCase = new CreateAppointment(repo);

    const result = await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      scheduledAt: new Date("2025-06-01T14:30:00Z"),
    });

    expect(result).toHaveProperty("id", "appt-1");
    expect(result).toHaveProperty("status", "SCHEDULED");
  });
});
