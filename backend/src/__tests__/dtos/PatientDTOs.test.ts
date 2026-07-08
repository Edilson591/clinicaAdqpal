import { CreatePatientSchema, UpdatePatientSchema } from "../../application/dtos/PatientDTOs";

const validCreate = {
  name: "Maria Silva",
  gender: "Feminino",
  agreement: "Unimed",
};

describe("CreatePatientSchema", () => {
  it("accepts minimum required fields", () => {
    expect(CreatePatientSchema.safeParse(validCreate).success).toBe(true);
  });

  it("accepts full payload", () => {
    const result = CreatePatientSchema.safeParse({
      ...validCreate,
      email: "maria@email.com",
      phone: "11999999999",
      cpf: "12345678901",
      dateOfBirth: "1990-05-15",
      street: "Rua das Flores",
      streetNumber: "42",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310100",
      additionalInfo: "Alérgica a dipirona",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects name longer than 100 characters", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects CPF that is not exactly 11 digits", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, cpf: "1234567890" });
    expect(result.success).toBe(false);
  });

  it("strips CPF mask and accepts formatted CPF", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, cpf: "123.456.789-01" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.cpf).toBe("12345678901");
  });

  it("accepts valid 11-digit CPF", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, cpf: "12345678901" });
    expect(result.success).toBe(true);
  });

  it("rejects state not 2 characters long", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, state: "SPP" });
    expect(result.success).toBe(false);
  });

  it("normalises state to uppercase", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, state: "sp" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.state).toBe("SP");
  });

  it("strips CEP mask and accepts formatted CEP", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, zipCode: "01310-100" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.zipCode).toBe("01310100");
  });

  it("rejects CEP shorter than 8 digits after stripping", () => {
    const result = CreatePatientSchema.safeParse({ ...validCreate, zipCode: "1234567" });
    expect(result.success).toBe(false);
  });

  it("rejects missing gender", () => {
    const { gender: _, ...rest } = validCreate;
    const result = CreatePatientSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing agreement", () => {
    const { agreement: _, ...rest } = validCreate;
    const result = CreatePatientSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

describe("UpdatePatientSchema", () => {
  it("accepts partial update with name only", () => {
    expect(UpdatePatientSchema.safeParse({ name: "João Silva" }).success).toBe(true);
  });

  it("accepts partial update with email only", () => {
    expect(UpdatePatientSchema.safeParse({ email: "novo@email.com" }).success).toBe(true);
  });

  it("rejects empty object (at least one field required)", () => {
    expect(UpdatePatientSchema.safeParse({}).success).toBe(false);
  });

  it("rejects invalid email on update", () => {
    expect(UpdatePatientSchema.safeParse({ email: "bad" }).success).toBe(false);
  });

  it("rejects CPF with non-11 digits on update", () => {
    expect(UpdatePatientSchema.safeParse({ cpf: "123" }).success).toBe(false);
  });

  it("accepts masked CPF on update", () => {
    const result = UpdatePatientSchema.safeParse({ cpf: "123.456.789-01" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.cpf).toBe("12345678901");
  });

  it("accepts masked CEP on update", () => {
    const result = UpdatePatientSchema.safeParse({ zipCode: "01310-100" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.zipCode).toBe("01310100");
  });

  it("accepts gender and agreement on update", () => {
    expect(UpdatePatientSchema.safeParse({ gender: "Feminino", agreement: "Unimed" }).success).toBe(true);
  });
});
