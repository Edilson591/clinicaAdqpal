import jwt from "jsonwebtoken";
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

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch {
      throw new UnauthorizedError("Token inválido ou expirado.");
    }
  }
}
