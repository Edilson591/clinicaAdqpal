import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prismaDev?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL;

export const prismaDev =
  globalForPrisma.prismaDev ??
  new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: { url: databaseUrl },
          },
        }
      : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaDev = prismaDev;
}

export default prismaDev;
