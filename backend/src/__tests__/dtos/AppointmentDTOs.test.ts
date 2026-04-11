import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
} from "../../application/dtos/AppointmentDTOs";

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

describe("CreateAppointmentSchema", () => {
  // IN_PERSON is the default type and requires roomId
  const base = {
    userId: validUUID,
    patientId: validUUID,
    scheduledAt: new Date().toISOString(),
    roomId: "Sala 01",
  };

  it("accepts valid payload", () => {
    expect(CreateAppointmentSchema.safeParse(base).success).toBe(true);
  });

  it("accepts optional notes", () => {
    const result = CreateAppointmentSchema.safeParse({ ...base, notes: "Revisão anual" });
    expect(result.success).toBe(true);
  });

  it("rejects notes longer than 1000 chars", () => {
    const result = CreateAppointmentSchema.safeParse({ ...base, notes: "x".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID for userId", () => {
    const result = CreateAppointmentSchema.safeParse({ ...base, userId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing patientId", () => {
    const { patientId: _, ...rest } = base;
    const result = CreateAppointmentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

describe("UpdateAppointmentSchema", () => {
  it("accepts valid status update", () => {
    const result = UpdateAppointmentSchema.safeParse({ status: "COMPLETED" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status value", () => {
    const result = UpdateAppointmentSchema.safeParse({ status: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("rejects empty object (at least one field required)", () => {
    const result = UpdateAppointmentSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts partial update with notes only", () => {
    const result = UpdateAppointmentSchema.safeParse({ notes: "Observação" });
    expect(result.success).toBe(true);
  });
});
