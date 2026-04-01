import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/** Middleware que valida o body com um schema Zod e passa o erro adiante */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    console.log(result.error)
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
}
