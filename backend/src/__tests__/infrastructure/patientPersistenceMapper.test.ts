import type { Patient as PrismaPatient } from "@prisma/client";

describe("patientPersistenceMapper", () => {
  const originalKey = process.env.ENCRYPTION_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = originalKey;
    jest.resetModules();
  });

  it("decrypts patient data loaded through appointment relations", async () => {
    process.env.ENCRYPTION_KEY = "ab".repeat(32);
    jest.resetModules();

    const { EncryptionService } = await import(
      "../../infrastructure/services/EncryptionService"
    );
    const crypto = new EncryptionService();
    const row = {
      id: "patient-1",
      registration_number: "000001",
      name: "Maria Silva",
      email: crypto.encrypt("maria@example.com"),
      phone: crypto.encrypt("82999991234"),
      cpf: crypto.encrypt("12345678901"),
      dateOfBirth: null,
      gender: "F",
      agreement: crypto.encrypt("SUS"),
      street: crypto.encrypt("Rua A"),
      streetNumber: crypto.encrypt("10"),
      city: crypto.encrypt("São Miguel dos Campos"),
      state: crypto.encrypt("AL"),
      zipCode: crypto.encrypt("57240000"),
      additionalInfo: crypto.encrypt("Observação"),
      createdAt: new Date("2026-08-01T12:00:00Z"),
      updatedAt: new Date("2026-08-01T12:00:00Z"),
    } as PrismaPatient;

    const { toPatientDomain } = await import(
      "../../infrastructure/mappers/patientPersistenceMapper"
    );
    const patient = toPatientDomain(row);

    expect(patient.phone).toBe("82999991234");
    expect(patient.email).toBe("maria@example.com");
    expect(patient.cpf).toBe("12345678901");
    expect(patient.city).toBe("São Miguel dos Campos");
  });
});
