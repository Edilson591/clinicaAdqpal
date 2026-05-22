import { UnauthorizedError } from "../../domain/errors/DomainError";
import { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IMailService } from "../../domain/services/IMailService";
import { PreLoginResendDTO } from "../dtos/UserDTOs";

export class PreLoginResend {
  constructor(
    private readonly auth2FA: IAuth2FA,
    private readonly userRepository: IUserRepository,
    private readonly emailService: IMailService,
  ) {}

  async execute(dto: PreLoginResendDTO) {
    const hasCooldown = await this.auth2FA.getCode(dto.userId);

    if (hasCooldown) {
      // Se a trava existir, impede o envio
      throw new UnauthorizedError(
        "Você já solicitou um código recentemente. Por favor, aguarde o código expirar para tentar novamente.",
      );
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado.");
    }

    const newCode2FA = Math.floor(100000 + Math.random() * 900000).toString();

    await this.auth2FA.saveCode(dto.userId, newCode2FA);

    // 7. Despacha o e-mail
    await this.emailService.send2FACode(dto.email, newCode2FA, user);

    return {
      success: true,
      message: "Novo código de segurança enviado para o seu e-mail.",
    };
  }
}
