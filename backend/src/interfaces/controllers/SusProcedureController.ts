import type { Request, Response, NextFunction } from "express";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaSusProcedureRepository } from "../../infrastructure/repositories/PrismaSusProcedureRepository";
import { SusSyncService } from "../../infrastructure/services/SusSyncService";
import { ListSusProcedures } from "../../application/use-cases/ListSusProcedures";
import { GetSusProcedure } from "../../application/use-cases/GetSusProcedure";
import { SyncSusProcedures } from "../../application/use-cases/SyncSusProcedures";

const repository = new PrismaSusProcedureRepository(prisma);

export class SusProcedureController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const procedures = await new ListSusProcedures(repository).execute();
      res.status(200).json({ success: true, data: procedures });
    } catch (err) {
      next(err);
    }
  }

  async getByCodigo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const procedure = await new GetSusProcedure(repository).executeByCodigo(String(req.params.codigo));
      res.status(200).json({ success: true, data: procedure });
    } catch (err) {
      next(err);
    }
  }

  async sync(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const secret = process.env.SYNC_SECRET;
      if (secret && req.headers.authorization !== `Bearer ${secret}`) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }

      const repoUrl = process.env.SIGTAP_REPO_URL ?? "";
      if (!repoUrl) {
        res.status(400).json({ success: false, message: "SIGTAP_REPO_URL não configurado." });
        return;
      }

      const service = new SusSyncService(repoUrl);
      const result = await new SyncSusProcedures(repository, service).execute();

      res.status(200).json({ success: true, message: result.message, data: result });
    } catch (err) {
      next(err);
    }
  }
}
