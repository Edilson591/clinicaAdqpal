// Port para serviço de tokens JWT
export interface TokenPayload {
  sub: string; // user id
  email: string;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
