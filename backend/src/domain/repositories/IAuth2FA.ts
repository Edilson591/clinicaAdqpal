export interface IAuth2FA {
  saveCode(userId: string, code: string): Promise<void>;
  getCode(userId: string): Promise<string | null>;
  invalidateCode(userId: string): Promise<void>;
}
