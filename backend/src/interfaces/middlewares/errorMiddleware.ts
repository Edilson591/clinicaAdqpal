import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { DomainError } from "../../domain/errors/DomainError";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Erros de validação Zod
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const field = issue.path.join(".");
      errors[field] = errors[field] ?? [];
      errors[field].push(issue.message);
    }
    const body: ErrorResponse = {
      success: false,
      message: "Dados inválidos.",
      errors,
    };
    res.status(422).json(body);
    return;
  }

  // Erros de domínio tipados
  if (err instanceof DomainError) {
    const body: ErrorResponse = { success: false, message: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  // Erros inesperados
  const isProd = process.env.NODE_ENV === "production";
  const message = isProd
    ? "Erro interno do servidor."
    : err instanceof Error
      ? err.message
      : "Erro desconhecido.";

  if (err instanceof Error) {
    console.error(
      `[ERROR] ${err.name}: ${err.message}`,
      isProd ? undefined : err.stack,
    );
  } else {
    console.error("[ERROR] Erro desconhecido:", err);
  }

  res.status(500).json({ success: false, message });
};
