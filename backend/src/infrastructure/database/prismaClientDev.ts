import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prismaDev?: PrismaClient;
};

let prismaDev = globalForPrisma.prismaDev;

export function getPrismaDev(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL_DEV;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL_DEV is not configured");
  }

  if (!prismaDev) {
    prismaDev = new PrismaClient({
      datasources: {
        db: { url: databaseUrl },
      },
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prismaDev = prismaDev;
    }
  }

  return prismaDev;
}

export default getPrismaDev;
