import { UnauthorizedError } from "../../domain/errors/DomainError";
import { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import { ITokenService } from "../../domain/services/ITokenService";
import type { Verify2FADTO } from "../dtos/UserDTOs";
import { hashTwoFactorCode } from "../services/TwoFactorCodeService";

// Interface simplificada de retorno para o passo final do 2FA
export interface FinalLoginResponseDTO {
  token: string;
  defaultToken: string;
  user: {
    id: string;
    email: string;
    roleId: number;
  };
}

export class LoginUser {
  constructor(
    // Depende apenas do Redis e do serviço de Token
    private readonly auth2FA: IAuth2FA,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: Verify2FADTO): Promise<FinalLoginResponseDTO> {
    const verification = await this.auth2FA.verifyCode(
      dto.userId,
      hashTwoFactorCode(dto.userId, dto.code),
    );

    if (verification === "EXPIRED") {
      throw new UnauthorizedError(
        "Código expirado ou não solicitado. Faça login novamente.",
      );
    }
    if (verification === "LOCKED") {
      throw new UnauthorizedError(
        "Limite de tentativas excedido. Faça login novamente.",
      );
    }
    if (verification !== "VALID") {
      throw new UnauthorizedError("Código de verificação incorreto.");
    }

    // 5. Gera o token definitivo de acesso (usando o tempo padrão de 7 dias da sua classe)
    const token = this.tokenService.sign({
      sub: dto.userId,
      email: dto.email,
      roleId: dto.roleId,
      tokenUse: "ACCESS",
    });

    const trustedDeviceToken = this.tokenService.sign(
      {
        sub: dto.userId,
        email: dto.email,
        roleId: dto.roleId,
        tokenUse: "TRUSTED_DEVICE",
      },
      { expiresIn: "30d" }, // Caso o seu tokenService aceite opções, ou configure direto no seu service interno
    );

    return {
      token,
      defaultToken: trustedDeviceToken,
      user: {
        id: dto.userId,
        email: dto.email,
        roleId: dto.roleId,
      },
    };
  }
}
