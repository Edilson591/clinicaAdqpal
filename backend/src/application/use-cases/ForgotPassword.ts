import { DomainError } from "../../domain/errors/DomainError";
import { IPasswordResetRepository } from "../../domain/repositories/IPasswordResetRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IMailService } from "../../domain/services/IMailService";
import { ForgotPasswordResponseDTO } from "../dtos/UserPasswordDTOS";

export class ForgotPassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetRepository: IPasswordResetRepository,
    private readonly mailService: IMailService,
  ) {}

  async execute(email: string): Promise<ForgotPasswordResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return {
        message: "Se o email existir, você receberá instruções",
      };
    }

    const latestToken = await this.passwordResetRepository.findLatestByUserId(
      user.id,
    );

    if (latestToken) {
      const now = Date.now();
      const lastRequest = new Date(latestToken.createdAt).getTime();

      const FIVE_MINUTES = 1000 * 60 * 5;

      if (now - lastRequest < FIVE_MINUTES) {
        throw new DomainError(
          "Aguarde alguns minutos antes de solicitar novamente.",
        );
      }
    }
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await this.passwordResetRepository.deleteTokensByUserId(user.id);

    await this.passwordResetRepository.createToken(user.id, token, expiresAt);

    await this.mailService.sendPasswordResetEmail(user.email, token, user);

    return {
      message: "email enviado com sucesso ",
    };
  }
}
