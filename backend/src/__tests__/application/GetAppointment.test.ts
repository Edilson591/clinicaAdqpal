import {
  GetAppointment,
  ListAppointments,
  ListAppointmentsByPatient,
  ListAppointmentsByUser,
} from "../../application/use-cases/GetAppointment";
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
    findAll: jest.fn().mockResolvedValue([mockAppointment]),
    count: jest.fn().mockResolvedValue(1),
    findByPatientId: jest.fn().mockResolvedValue([mockAppointment]),
    findByUserId: jest.fn().mockResolvedValue([mockAppointment]),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  } as unknown as jest.Mocked<IAppointmentRepository>;
}

describe("GetAppointment", () => {
  it("returns appointment when found", async () => {
    const repo = makeRepo();
    const result = await new GetAppointment(repo).execute("appt-1");
    expect(result.id).toBe("appt-1");
  });

  it("throws NotFoundError when appointment does not exist", async () => {
    const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new GetAppointment(repo).execute("missing")).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("ListAppointments", () => {
  it("returns paginated appointments", async () => {
    const repo = makeRepo();
    const result = await new ListAppointments(repo).execute();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("appt-1");
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.totalPages).toBe(1);
  });
});

describe("ListAppointmentsByPatient", () => {
  it("returns appointments for a patient", async () => {
    const repo = makeRepo();
    const result = await new ListAppointmentsByPatient(repo).execute("patient-1");
    expect(repo.findByPatientId).toHaveBeenCalledWith("patient-1", undefined);
    expect(result).toHaveLength(1);
  });
});

describe("ListAppointmentsByUser", () => {
  it("returns appointments for a user", async () => {
    const repo = makeRepo();
    const result = await new ListAppointmentsByUser(repo).execute("user-1");
    expect(repo.findByUserId).toHaveBeenCalledWith("user-1", undefined);
    expect(result).toHaveLength(1);
  });
});
