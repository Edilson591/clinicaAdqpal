import { User } from "../entities/User";

export interface IMailService {
  sendPasswordResetEmail(
    email: string,
    token: string,
    name: Pick<User, "username">,
  ): Promise<void>;
  send2FACode(
    email: string,
    code: string,
    user: Pick<User, "username">,
  ): Promise<void>;
}
