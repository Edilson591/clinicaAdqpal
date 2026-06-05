import type { Request, Response, NextFunction } from "express";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaSusProcedureRepository } from "../../infrastructure/repositories/PrismaSusProcedureRepository";
import { ListSusProcedures } from "../../application/use-cases/ListSusProcedures";
import { GetSusProcedure } from "../../application/use-cases/GetSusProcedure";

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
}
