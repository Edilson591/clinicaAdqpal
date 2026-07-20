import { UnauthorizedError } from "../../domain/errors/DomainError";
import { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../../domain/services/IHashService";
import { IMailService } from "../../domain/services/IMailService";
import { ITokenService } from "../../domain/services/ITokenService";
import { LoginUserDTO, PreLoginResponseDTO } from "../dtos/UserDTOs";
import { toUserResponseDTO } from "../mappers/userMapper";
import { generateTwoFactorCode, hashTwoFactorCode } from "../services/TwoFactorCodeService";

export type PreLoginInput = LoginUserDTO & {
  isTrusted?: boolean;
};

export class PreLoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
    private readonly auth2FA: IAuth2FA,
    private readonly emailService: IMailService,
  ) {}

  async execute(dto: PreLoginInput): Promise<PreLoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    // Proteção contra timing attacks mantida perfeitamente
    const passwordMatch =
      user !== null
        ? await this.hashService.compare(dto.password, user.passwordHash)
        : false;

    if (!user || !passwordMatch) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    if (dto.isTrusted) {
      return {
        preAuthToken: "", // Não precisa de token temporário
        user: toUserResponseDTO(user),
      };
    }

    const code2FA = generateTwoFactorCode();

    await this.auth2FA.saveCode(user.id, hashTwoFactorCode(user.id, code2FA));

    await this.emailService.send2FACode(user.email, code2FA, user);

    const preAuthToken = this.tokenService.sign(
      {
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        tokenUse: "PRE_AUTH",
      },
      { expiresIn: "1h" }, // Caso o seu tokenService aceite opções, ou configure direto no seu service interno
    );

    return {
      preAuthToken,
    };
  }
}
