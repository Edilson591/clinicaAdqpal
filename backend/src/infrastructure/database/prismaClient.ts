import { PrismaClient } from "@prisma/client";

// Instância única do PrismaClient (singleton)
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
});

export default prisma;
