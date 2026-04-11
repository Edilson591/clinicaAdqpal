import { CreatePatient } from "../../application/use-cases/CreatePatient";
import { GetPatient, ListPatients } from "../../application/use-cases/GetPatient";
import { UpdatePatient } from "../../application/use-cases/UpdatePatient";
import { DeletePatient } from "../../application/use-cases/DeletePatient";
import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { Patient } from "../../domain/entities/Patient";
import { ConflictError, NotFoundError } from "../../domain/errors/DomainError";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const now = new Date("2026-04-10T12:00:00Z");

const mockPatient: Patient = {
  id: "pat-1",
  name: "Maria Silva",
  email: "maria@email.com",
  phone: "11999999999",
  cpf: "12345678901",
  dateOfBirth: new Date("1990-05-15"),
  gender: "Feminino",
  agreement: "Unimed",
  street: null,
  streetNumber: null,
  city: "São Paulo",
  state: "SP",
  zipCode: null,
  additionalInfo: null,
  createdAt: now,
  updatedAt: now,
};

function makeRepo(): jest.Mocked<IPatientRepository> {
  return {
    findById: jest.fn(),
    findByCpf: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<IPatientRepository>;
}

// ── CreatePatient ─────────────────────────────────────────────────────────────

describe("CreatePatient", () => {
  it("creates a patient and returns a DTO", async () => {
    const repo = makeRepo();
    repo.create.mockResolvedValue(mockPatient);

    const useCase = new CreatePatient(repo);
    const result = await useCase.execute({
      name: "Maria Silva",
      gender: "Feminino",
      agreement: "Unimed",
    });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result.id).toBe("pat-1");
    expect(result.name).toBe("Maria Silva");
  });

  it("does not check CPF when cpf is not provided", async () => {
    const repo = makeRepo();
    repo.create.mockResolvedValue(mockPatient);

    const useCase = new CreatePatient(repo);
    await useCase.execute({ name: "Maria Silva", gender: "Feminino", agreement: "Unimed" });

    expect(repo.findByCpf).not.toHaveBeenCalled();
  });

  it("throws ConflictError when CPF is already taken", async () => {
    const repo = makeRepo();
    repo.findByCpf.mockResolvedValue(mockPatient);

    const useCase = new CreatePatient(repo);
    await expect(
      useCase.execute({ name: "João", gender: "Masculino", agreement: "SUS", cpf: "12345678901" }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("creates patient when CPF is unique", async () => {
    const repo = makeRepo();
    repo.findByCpf.mockResolvedValue(null);
    repo.create.mockResolvedValue({ ...mockPatient, cpf: "98765432100" });

    const useCase = new CreatePatient(repo);
    const result = await useCase.execute({
      name: "João",
      gender: "Masculino",
      agreement: "SUS",
      cpf: "98765432100",
    });

    expect(result.cpf).toBe("98765432100");
  });
});

// ── GetPatient ────────────────────────────────────────────────────────────────

describe("GetPatient", () => {
  it("returns the patient DTO when found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockPatient);

    const useCase = new GetPatient(repo);
    const result = await useCase.execute("pat-1");

    expect(result.id).toBe("pat-1");
    expect(repo.findById).toHaveBeenCalledWith("pat-1");
  });

  it("throws NotFoundError when patient does not exist", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new GetPatient(repo);
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ── ListPatients ──────────────────────────────────────────────────────────────

describe("ListPatients", () => {
  it("returns paginated patients", async () => {
    const repo = makeRepo();
    repo.findAll.mockResolvedValue([mockPatient]);
    repo.count.mockResolvedValue(1);

    const useCase = new ListPatients(repo);
    const result = await useCase.execute({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("pat-1");
    expect(result.pagination.total).toBe(1);
  });

  it("uses default pagination when not provided", async () => {
    const repo = makeRepo();
    repo.findAll.mockResolvedValue([]);
    repo.count.mockResolvedValue(0);

    const useCase = new ListPatients(repo);
    const result = await useCase.execute();

    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(20);
  });
});

// ── UpdatePatient ─────────────────────────────────────────────────────────────

describe("UpdatePatient", () => {
  it("updates and returns the patient DTO", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockPatient);
    repo.update.mockResolvedValue({ ...mockPatient, name: "Maria Costa" });

    const useCase = new UpdatePatient(repo);
    const result = await useCase.execute("pat-1", { name: "Maria Costa" });

    expect(result.name).toBe("Maria Costa");
    expect(repo.update).toHaveBeenCalledWith("pat-1", expect.objectContaining({ name: "Maria Costa" }));
  });

  it("throws NotFoundError when patient not found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new UpdatePatient(repo);
    await expect(useCase.execute("unknown", { name: "Test" })).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ConflictError when new CPF belongs to another patient", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockPatient);
    repo.findByCpf.mockResolvedValue({ ...mockPatient, id: "other-patient" });

    const useCase = new UpdatePatient(repo);
    await expect(
      useCase.execute("pat-1", { cpf: "98765432100" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("does not check CPF when new CPF equals existing CPF", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockPatient);
    repo.update.mockResolvedValue(mockPatient);

    const useCase = new UpdatePatient(repo);
    await useCase.execute("pat-1", { cpf: "12345678901" });

    expect(repo.findByCpf).not.toHaveBeenCalled();
  });
});

// ── DeletePatient ─────────────────────────────────────────────────────────────

describe("DeletePatient", () => {
  it("deletes the patient when found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockPatient);
    repo.delete.mockResolvedValue();

    const useCase = new DeletePatient(repo);
    await useCase.execute("pat-1");

    expect(repo.delete).toHaveBeenCalledWith("pat-1");
  });

  it("throws NotFoundError when patient not found", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new DeletePatient(repo);
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
