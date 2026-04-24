import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { ITokenService, TokenPayload } from "../../domain/services/ITokenService";
import { UnauthorizedError } from "../../domain/errors/DomainError";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
    this.secret = secret;
    this.expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  }

  sign(payload: Omit<TokenPayload, "jti" | "exp" | "iat">): string {
    return jwt.sign({ ...payload, jti: randomUUID() }, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  verify(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Token inválido ou expirado.");
    }
  }

  decode(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload | null;
    } catch {
      return null;
    }
  }
}
