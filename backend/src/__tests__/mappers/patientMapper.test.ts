import { toPatientResponseDTO } from "../../application/mappers/patientMapper";
import type { Patient } from "../../domain/entities/Patient";

const now = new Date("2026-04-10T12:00:00Z");

const mockPatient: Patient = {
  id: "pat-1",
  name: "Maria Silva",
  email: "maria@email.com",
  phone: "11999999999",
  cpf: "12345678901",
  dateOfBirth: new Date("1990-05-15T00:00:00Z"),
  gender: "Feminino",
  agreement: "Unimed",
  street: "Rua das Flores",
  streetNumber: "42",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310100",
  additionalInfo: "Sem informações adicionais",
  createdAt: now,
  updatedAt: now,
};

describe("toPatientResponseDTO", () => {
  it("maps all fields correctly", () => {
    const dto = toPatientResponseDTO(mockPatient);
    expect(dto.id).toBe("pat-1");
    expect(dto.name).toBe("Maria Silva");
    expect(dto.email).toBe("maria@email.com");
    expect(dto.phone).toBe("11999999999");
    expect(dto.cpf).toBe("12345678901");
    expect(dto.gender).toBe("Feminino");
    expect(dto.agreement).toBe("Unimed");
    expect(dto.city).toBe("São Paulo");
    expect(dto.state).toBe("SP");
  });

  it("converts dateOfBirth to ISO string", () => {
    const dto = toPatientResponseDTO(mockPatient);
    expect(dto.dateOfBirth).toBe(new Date("1990-05-15T00:00:00Z").toISOString());
  });

  it("converts createdAt and updatedAt to ISO strings", () => {
    const dto = toPatientResponseDTO(mockPatient);
    expect(dto.createdAt).toBe(now.toISOString());
    expect(dto.updatedAt).toBe(now.toISOString());
  });

  it("maps null dateOfBirth to null", () => {
    const dto = toPatientResponseDTO({ ...mockPatient, dateOfBirth: null });
    expect(dto.dateOfBirth).toBeNull();
  });

  it("maps null email to null", () => {
    const dto = toPatientResponseDTO({ ...mockPatient, email: null });
    expect(dto.email).toBeNull();
  });

  it("maps null cpf to null", () => {
    const dto = toPatientResponseDTO({ ...mockPatient, cpf: null });
    expect(dto.cpf).toBeNull();
  });

  it("maps null gender to null", () => {
    const dto = toPatientResponseDTO({ ...mockPatient, gender: null });
    expect(dto.gender).toBeNull();
  });

  it("maps null agreement to null", () => {
    const dto = toPatientResponseDTO({ ...mockPatient, agreement: null });
    expect(dto.agreement).toBeNull();
  });
});
