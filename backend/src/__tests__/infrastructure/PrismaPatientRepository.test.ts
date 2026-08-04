import { Prisma, type PrismaClient } from "@prisma/client";
import { ConflictError } from "../../domain/errors/DomainError";
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

  it("returns ConflictError when concurrent requests use the same email", async () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.22.0",
        meta: { target: ["email"] },
      },
    );
    const prisma = {
      patient: { create: jest.fn().mockRejectedValue(error) },
    } as unknown as PrismaClient;
    const repository = new PrismaPatientRepository(prisma);

    const creation = repository.create({
      name: "Maria Silva",
      email: "maria@email.com",
      gender: "Feminino",
      agreement: "SUS",
    });

    await expect(creation).rejects.toBeInstanceOf(ConflictError);
    await expect(creation).rejects.toMatchObject({
      message: "Já existe um paciente com este e-mail.",
      statusCode: 409,
    });
  });
});
