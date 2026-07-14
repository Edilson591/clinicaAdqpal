import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prismaDev?: PrismaClient;
};

export const prismaDev =
  globalForPrisma.prismaDev ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_DEV,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaDev = prismaDev;
}

export default prismaDev;