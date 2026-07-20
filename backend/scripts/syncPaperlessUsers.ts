import "dotenv/config";
import prisma from "../src/infrastructure/database/prismaClient";
import { PrismaUserRepository } from "../src/infrastructure/repositories/PrismaUserRepository";
import { PaperlessAuthGatewayClient } from "../src/infrastructure/services/PaperlessAuthGatewayClient";

async function main() {
  const baseUrl = process.env.IDENTITY_GATEWAY_URL?.trim();
  const serviceToken = process.env.IDENTITY_SERVICE_TOKEN?.trim();
  if (!baseUrl || !serviceToken) {
    throw new Error("IDENTITY_GATEWAY_URL and IDENTITY_SERVICE_TOKEN are required");
  }

  const repository = new PrismaUserRepository(prisma);
  const users = await repository.findAll();
  const specialties = await prisma.doctorSpecialty.findMany();
  const specialtiesByUser = new Map<string, string[]>();
  for (const relation of specialties) {
    const ids = specialtiesByUser.get(relation.doctorId) ?? [];
    ids.push(relation.specialtyId);
    specialtiesByUser.set(relation.doctorId, ids);
  }

  const identity = new PaperlessAuthGatewayClient(baseUrl, 30_000);
  let synchronized = 0;
  const failures: Array<{ id: string; status: number }> = [];

  for (const user of users) {
    const response = await identity.request({
      method: "PUT",
      path: `/auth/integrations/clinical/users/${user.id}`,
      headers: {
        "content-type": "application/json",
        "x-identity-service-token": serviceToken,
      },
      body: {
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        specialtyIds: specialtiesByUser.get(user.id) ?? [],
        ...(user.cpf ? { cpf: user.cpf } : {}),
        ...(user.cnpj ? { cnpj: user.cnpj } : {}),
      },
    });

    if (response.status >= 200 && response.status < 300) synchronized += 1;
    else failures.push({ id: user.id, status: response.status });
  }

  console.log(JSON.stringify({ total: users.length, synchronized, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
