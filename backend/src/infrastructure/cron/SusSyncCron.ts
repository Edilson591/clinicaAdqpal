import cron from "node-cron";
import prisma from "../database/prismaClient";
import { PrismaSusProcedureRepository } from "../repositories/PrismaSusProcedureRepository";
import { SusSyncService } from "../services/SusSyncService";
import { SyncSusProcedures } from "../../application/use-cases/SyncSusProcedures";

const REPO_URL = process.env.SIGTAP_REPO_URL ?? "";

export function startSusSyncCron(): void {
  if (!REPO_URL) {
    console.warn("[SusSyncCron] SIGTAP_REPO_URL não definido — cron desativado.");
    return;
  }

  const repo = new PrismaSusProcedureRepository(prisma);
  const service = new SusSyncService(REPO_URL);
  const sync = new SyncSusProcedures(repo, service);

  const execute = async () => {
    try {
      console.log("[SusSyncCron] Iniciando sincronização agendada...");
      const result = await sync.execute();
      console.log(`[SusSyncCron] ${result.message}`);
    } catch (err) {
      console.error("[SusSyncCron] Erro na sincronização:", err);
    }
  };

  // 1º dia de cada mês à meia-noite: "0 0 1 * *"
  cron.schedule("0 0 1 * *", execute, {
    timezone: "America/Sao_Paulo",
  });

  console.log("[SusSyncCron] Cron agendado: 1º dia de cada mês à 00:00 BRT.");
}
