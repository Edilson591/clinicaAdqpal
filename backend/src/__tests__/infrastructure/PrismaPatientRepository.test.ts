import type { PrismaClient } from "@prisma/client";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";

describe("PrismaPatientRepository", () => {
  it("lets PostgreSQL generate the registration number", async () => {
    const patient = {
      id: "pat-1",
      registration_number: "000007",
      name: "Maria Silva",
      email: null,
      phone: null,
      cpf: null,
      dateOfBirth: null,
      gender: "Feminino",
      agreement: "SUS",
      street: null,
      streetNumber: null,
      city: null,
      state: null,
      zipCode: null,
      additionalInfo: null,
      createdAt: new Date("2026-08-03T12:00:00Z"),
      updatedAt: new Date("2026-08-03T12:00:00Z"),
    };
    const create = jest.fn().mockResolvedValue(patient);
    const prisma = { patient: { create } } as unknown as PrismaClient;
    const repository = new PrismaPatientRepository(prisma);

    const result = await repository.create({
      name: "Maria Silva",
      gender: "Feminino",
      agreement: "SUS",
    });

    expect(create).toHaveBeenCalledWith({
      data: expect.not.objectContaining({ registration_number: expect.anything() }),
    });
    expect(result.registrationNumber).toBe("000007");
  });
});
