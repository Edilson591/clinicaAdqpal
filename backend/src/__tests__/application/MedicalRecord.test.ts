import { CreateMedicalRecord } from "../../application/use-cases/CreateMedicalRecord";
import { GetMedicalRecord } from "../../application/use-cases/GetMedicalRecord";
import { UpdateMedicalRecord } from "../../application/use-cases/UpdateMedicalRecord";
import { DeleteMedicalRecord } from "../../application/use-cases/DeleteMedicalRecord";
import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import type { MedicalRecord } from "../../domain/entities/MedicalRecord";
import { ConflictError, NotFoundError } from "../../domain/errors/DomainError";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const now = new Date("2026-04-10T12:00:00Z");

const mockRecord: MedicalRecord = {
  id: "rec-1",
  appointmentId: "appt-1",
  patientId: "pat-1",
  diagnosis: "Hipertensão leve",
  prescription: "Atenolol 25mg",
  notes: "Retorno em 30 dias",
  patient: { id: "pat-1", name: "Maria Silva" },
  createdAt: now,
  updatedAt: now,
};

function makeRepo(): jest.Mocked<IMedicalRecordRepository> {
  return {
    findById: jest.fn(),
    findByAppointmentId: jest.fn(),
    findByPatientId: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<IMedicalRecordRepository>;
}

// ── CreateMedicalRecord ───────────────────────────────────────────────────────

describe("CreateMedicalRecord", () => {
  it("creates a record and returns a DTO", async () => {
    const repo = makeRepo();
    repo.findByAppointmentId.mockResolvedValue(null);
    repo.create.mockResolvedValue(mockRecord);

    const useCase = new CreateMedicalRecord(repo);
    const result = await useCase.execute({
      appointmentId: "appt-1",
      patientId: "pat-1",
      diagnosis: "Hipertensão leve",
    });

    expect(result.id).toBe("rec-1");
    expect(result.diagnosis).toBe("Hipertensão leve");
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it("passes null for optional fields when not provided", async () => {
    const repo = makeRepo();
    repo.findByAppointmentId.mockResolvedValue(null);
    repo.create.mockResolvedValue({ ...mockRecord, diagnosis: null, prescription: null, notes: null });

    const useCase = new CreateMedicalRecord(repo);
    await useCase.execute({ appointmentId: "appt-1", patientId: "pat-1" });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ diagnosis: null, prescription: null, notes: null }),
    );
  });

  it("throws ConflictError when record already exists for the appointment", async () => {
    const repo = makeRepo();
    repo.findByAppointmentId.mockResolvedValue(mockRecord);

    const useCase = new CreateMedicalRecord(repo);
    await expect(
      useCase.execute({ appointmentId: "appt-1", patientId: "pat-1" }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repo.create).not.toHaveBeenCalled();
  });
});

// ── GetMedicalRecord ──────────────────────────────────────────────────────────

describe("GetMedicalRecord", () => {
  it("returns the DTO when record is found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockRecord);

    const useCase = new GetMedicalRecord(repo);
    const result = await useCase.execute("rec-1");

    expect(result.id).toBe("rec-1");
    expect(repo.findById).toHaveBeenCalledWith("rec-1");
  });

  it("throws NotFoundError when record does not exist", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new GetMedicalRecord(repo);
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ── UpdateMedicalRecord ───────────────────────────────────────────────────────

describe("UpdateMedicalRecord", () => {
  it("updates and returns the DTO", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockRecord);
    repo.update.mockResolvedValue({ ...mockRecord, diagnosis: "Diabetes tipo 2" });

    const useCase = new UpdateMedicalRecord(repo);
    const result = await useCase.execute("rec-1", { diagnosis: "Diabetes tipo 2" });

    expect(result.diagnosis).toBe("Diabetes tipo 2");
    expect(repo.update).toHaveBeenCalledWith("rec-1", expect.objectContaining({ diagnosis: "Diabetes tipo 2" }));
  });

  it("throws NotFoundError when record not found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new UpdateMedicalRecord(repo);
    await expect(useCase.execute("unknown", { notes: "test" })).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ── DeleteMedicalRecord ───────────────────────────────────────────────────────

describe("DeleteMedicalRecord", () => {
  it("deletes the record when found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockRecord);
    repo.delete.mockResolvedValue();

    const useCase = new DeleteMedicalRecord(repo);
    await useCase.execute("rec-1");

    expect(repo.delete).toHaveBeenCalledWith("rec-1");
  });

  it("throws NotFoundError when record not found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new DeleteMedicalRecord(repo);
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
