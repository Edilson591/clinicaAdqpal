import { NotFoundError } from "../../domain/errors/DomainError";
import { IPasswordResetRepository } from "../../domain/repositories/IPasswordResetRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../../domain/services/IHashService";
import { ResetPasswordResponseDTO } from "../dtos/UserPasswordDTOS";

export class ResetPassword {
  constructor(
    private readonly passwordResetRepository: IPasswordResetRepository,
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(token: string, password: string): Promise<ResetPasswordResponseDTO> {
    const tokenData = await this.passwordResetRepository.findByToken(token);
    if (!tokenData) {
      throw new NotFoundError("Token");
    }

    if (new Date() > tokenData.expiresAt) {
      await this.passwordResetRepository.deleteToken(token);
      throw new NotFoundError("Token expirado");
    }

    const passwordHash = await this.hashService.hash(password);

    await this.userRepository.update(tokenData.userId, {
      passwordHash,
    });

    await this.passwordResetRepository.deleteToken(token);

    return {
      message: "Senha redefinida com sucesso.",
    };
  }
}
