import "dotenv/config";
import prisma from "../src/infrastructure/database/prismaClient";
import { PrismaSusProcedureRepository } from "../src/infrastructure/repositories/PrismaSusProcedureRepository";
import { SusSyncService } from "../src/infrastructure/services/SusSyncService";
import { SyncSusProcedures } from "../src/application/use-cases/SyncSusProcedures";

const REPO_URL = process.env.SIGTAP_REPO_URL ?? "";

async function seed() {
  if (!REPO_URL) {
    console.error("SIGTAP_REPO_URL não definido no .env");
    process.exit(1);
  }

  console.log("=== Seed SUS: sincronizando procedimentos de imagem ===");

  const repo = new PrismaSusProcedureRepository(prisma);
  const service = new SusSyncService(REPO_URL);
  const sync = new SyncSusProcedures(repo, service);

  const result = await sync.execute();
  console.log(result.message);

  await prisma.$disconnect();
  console.log("=== Seed concluído ===");
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  prisma.$disconnect();
  process.exit(1);
});
