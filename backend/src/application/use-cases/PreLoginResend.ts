import { UnauthorizedError } from "../../domain/errors/DomainError";
import type { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IMailService } from "../../domain/services/IMailService";
import type { PreLoginResendDTO } from "../dtos/UserDTOs";
import { generateTwoFactorCode, hashTwoFactorCode } from "../services/TwoFactorCodeService";

export class PreLoginResend {
  constructor(
    private readonly auth2FA: IAuth2FA,
    private readonly userRepository: IUserRepository,
    private readonly emailService: IMailService,
  ) {}

  async execute(dto: PreLoginResendDTO) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado.");
    }

    if (!(await this.auth2FA.reserveResend(dto.userId))) {
      throw new UnauthorizedError(
        "Aguarde antes de solicitar um novo código de segurança.",
      );
    }

    const code = generateTwoFactorCode();
    await this.auth2FA.invalidateCode(dto.userId);
    await this.auth2FA.saveCode(dto.userId, hashTwoFactorCode(dto.userId, code));
    await this.emailService.send2FACode(user.email, code, user);

    return {
      success: true,
      message: "Novo código de segurança enviado para o seu e-mail.",
    };
  }
}
