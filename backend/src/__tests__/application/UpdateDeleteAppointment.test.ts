import { UpdateAppointment } from "../../application/use-cases/UpdateAppointment";
import { DeleteAppointment } from "../../application/use-cases/DeleteAppointment";
import { NotFoundError } from "../../domain/errors/DomainError";
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

function makeRepo(overrides: Partial<jest.Mocked<IAppointmentRepository>> = {}): jest.Mocked<IAppointmentRepository> {
  return {
    findById: jest.fn().mockResolvedValue(mockAppointment),
    update: jest.fn().mockResolvedValue({ ...mockAppointment, status: "COMPLETED" }),
    delete: jest.fn().mockResolvedValue(undefined),
    create: jest.fn(),
    findAll: jest.fn(),
    findByPatientId: jest.fn(),
    findByUserId: jest.fn(),
    ...overrides,
  } as unknown as jest.Mocked<IAppointmentRepository>;
}

describe("UpdateAppointment", () => {
  it("updates and returns mapped DTO", async () => {
    const repo = makeRepo();
    const result = await new UpdateAppointment(repo).execute("appt-1", { status: "COMPLETED" });
    expect(result.status).toBe("COMPLETED");
    expect(repo.update).toHaveBeenCalledWith("appt-1", expect.objectContaining({ status: "COMPLETED" }));
  });

  it("throws NotFoundError when appointment does not exist", async () => {
    const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(
      new UpdateAppointment(repo).execute("missing", { status: "COMPLETED" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("DeleteAppointment", () => {
  it("calls repository.delete when appointment exists", async () => {
    const repo = makeRepo();
    await new DeleteAppointment(repo).execute("appt-1");
    expect(repo.delete).toHaveBeenCalledWith("appt-1");
  });

  it("throws NotFoundError when appointment does not exist", async () => {
    const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(
      new DeleteAppointment(repo).execute("missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
