import {
  CreateMedicalRecordSchema,
  UpdateMedicalRecordSchema,
} from "../../application/dtos/MedicalRecordDTOs";

const validUUID = "550e8400-e29b-41d4-a716-446655440000";
const otherUUID = "660e8400-e29b-41d4-a716-446655440001";

describe("CreateMedicalRecordSchema", () => {
  const base = { appointmentId: validUUID, patientId: otherUUID };

  it("accepts valid minimal payload", () => {
    expect(CreateMedicalRecordSchema.safeParse(base).success).toBe(true);
  });

  it("accepts optional diagnosis, prescription and notes", () => {
    const result = CreateMedicalRecordSchema.safeParse({
      ...base,
      diagnosis: "Hipertensão leve",
      prescription: "Atenolol 25mg",
      notes: "Retorno em 30 dias",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID for appointmentId", () => {
    const result = CreateMedicalRecordSchema.safeParse({ ...base, appointmentId: "not-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID for patientId", () => {
    const result = CreateMedicalRecordSchema.safeParse({ ...base, patientId: "not-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing appointmentId", () => {
    const { appointmentId: _, ...rest } = base;
    expect(CreateMedicalRecordSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing patientId", () => {
    const { patientId: _, ...rest } = base;
    expect(CreateMedicalRecordSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects diagnosis longer than 2000 chars", () => {
    const result = CreateMedicalRecordSchema.safeParse({ ...base, diagnosis: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });
});

describe("UpdateMedicalRecordSchema", () => {
  it("accepts update with diagnosis only", () => {
    expect(UpdateMedicalRecordSchema.safeParse({ diagnosis: "Diabetes tipo 2" }).success).toBe(true);
  });

  it("accepts update with all fields", () => {
    const result = UpdateMedicalRecordSchema.safeParse({
      diagnosis: "Diabetes tipo 2",
      prescription: "Metformina 500mg",
      notes: "Orientar dieta",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty object", () => {
    expect(UpdateMedicalRecordSchema.safeParse({}).success).toBe(false);
  });

  it("rejects notes longer than 2000 chars", () => {
    const result = UpdateMedicalRecordSchema.safeParse({ notes: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });
});
