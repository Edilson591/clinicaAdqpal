import bcrypt from "bcryptjs";
import type { IHashService } from "../../domain/services/IHashService";

const SALT_ROUNDS = 12;

export class BcryptHashService implements IHashService {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
