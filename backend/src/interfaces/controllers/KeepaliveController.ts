import type { Request, Response } from "express";
import prisma from "../../infrastructure/database/prismaClient";
import getPrismaDev from "../../infrastructure/database/prismaClientDev";

export default class KeepaliveController {
  async keepalive(req: Request, res: Response): Promise<void> {
    try {
      const secret = process.env.SYNC_SECRET;
      if (secret && req.headers.authorization !== `Bearer ${secret}`) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }

      const databaseUrl = process.env.DATABASE_URL;
      const databaseUrlDev = process.env.DATABASE_URL_DEV;

      if (!databaseUrl || !databaseUrlDev) {
        throw new Error("DATABASE_URL and DATABASE_URL_DEV must be configured");
      }

      if (databaseUrl === databaseUrlDev) {
        throw new Error("DATABASE_URL and DATABASE_URL_DEV must be different");
      }

      await Promise.all([
        prisma.$queryRaw`SELECT id FROM "users" LIMIT 1`,
        getPrismaDev().$queryRaw`SELECT id FROM "users" LIMIT 1`,
      ]);

      res.status(200).send("ok");
      return;
    } catch (err) {
      console.error("Keepalive error:", err);
      res.status(500).send("error");
    }
  }
}
