import { toMedicalRecordResponseDTO } from "../../application/mappers/medicalRecordMapper";
import type { MedicalRecord } from "../../domain/entities/MedicalRecord";

const now = new Date("2026-04-10T12:00:00Z");

const mockRecord: MedicalRecord = {
  id: "rec-1",
  appointmentId: "appt-1",
  patientId: "pat-1",
  diagnosis: "Hipertensão leve",
  prescription: "Atenolol 25mg",
  notes: "Retorno em 30 dias",
  patient: { id: "pat-1", name: "Maria Silva", phone: "11999999999", email: "m@test.com" },
  createdAt: now,
  updatedAt: now,
};

describe("toMedicalRecordResponseDTO", () => {
  it("maps all fields correctly", () => {
    const dto = toMedicalRecordResponseDTO(mockRecord);
    expect(dto.id).toBe("rec-1");
    expect(dto.appointmentId).toBe("appt-1");
    expect(dto.patientId).toBe("pat-1");
    expect(dto.diagnosis).toBe("Hipertensão leve");
    expect(dto.prescription).toBe("Atenolol 25mg");
    expect(dto.notes).toBe("Retorno em 30 dias");
  });

  it("maps patient relation", () => {
    const dto = toMedicalRecordResponseDTO(mockRecord);
    expect(dto.patient).toEqual({
      id: "pat-1",
      name: "Maria Silva",
      phone: "11999999999",
      email: "m@test.com",
    });
  });

  it("converts createdAt and updatedAt to ISO strings", () => {
    const dto = toMedicalRecordResponseDTO(mockRecord);
    expect(dto.createdAt).toBe(now.toISOString());
    expect(dto.updatedAt).toBe(now.toISOString());
  });

  it("maps null diagnosis to null", () => {
    const dto = toMedicalRecordResponseDTO({ ...mockRecord, diagnosis: null });
    expect(dto.diagnosis).toBeNull();
  });

  it("maps null prescription to null", () => {
    const dto = toMedicalRecordResponseDTO({ ...mockRecord, prescription: null });
    expect(dto.prescription).toBeNull();
  });

  it("maps null patient to null", () => {
    const dto = toMedicalRecordResponseDTO({ ...mockRecord, patient: null });
    expect(dto.patient).toBeNull();
  });

  it("maps undefined patient to null", () => {
    const { patient: _, ...withoutPatient } = mockRecord;
    const dto = toMedicalRecordResponseDTO(withoutPatient as MedicalRecord);
    expect(dto.patient).toBeNull();
  });
});
