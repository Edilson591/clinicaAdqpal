// Port para serviço de tokens JWT
export interface TokenPayload {
  sub: string; // user id
  email: string;
  roleId: number;
  jti: string; // JWT ID único — usado para revogação na blacklist
  exp?: number; // unix timestamp de expiração (preenchido pelo jwt.sign)
  iat?: number;
  isDefinitive?: boolean;
}

export interface TokenOptions {
  expiresIn?: string | number; // Aceita formatos como "15m", "7d" ou o número de segundos
}

export interface ITokenService {
  sign(
    payload: Omit<TokenPayload, "jti" | "exp" | "iat">,
    options?: TokenOptions,
  ): string;
  verify(token: string): TokenPayload;
  decode(token: string): TokenPayload | null; // sem verificação de assinatura
}
