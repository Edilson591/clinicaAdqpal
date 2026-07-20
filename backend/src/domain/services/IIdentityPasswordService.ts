export interface IIdentityPasswordService {
  resetPassword(userId: string, password: string, currentPassword?: string): Promise<void>;
}
