import type { Request, Response } from "express";
import prisma from "../../infrastructure/database/prismaClient";
import prismaDev from "../../infrastructure/database/prismaClientDev";

export default class KeepaliveController {
  async keepalive(req: Request, res: Response): Promise<void> {
    try {
      const secret = process.env.SYNC_SECRET;
      if (secret && req.headers.authorization !== `Bearer ${secret}`) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }

      await prisma.$queryRaw`SELECT 1`;

      await prismaDev.$queryRaw`SELECT 1`;
  

      res.status(200).send("ok");
      return;
    } catch (err) {
      res.status(500).send("error");
      return;
    }
  }
}
