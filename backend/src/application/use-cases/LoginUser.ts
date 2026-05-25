import { UnauthorizedError } from "../../domain/errors/DomainError";
import { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import { ITokenService } from "../../domain/services/ITokenService";
import type { Verify2FADTO } from "../dtos/UserDTOs";

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
    // 1. Busca o código de 6 dígitos que guardamos no Redis durante o pré-login
    const savedCode = await this.auth2FA.getCode(dto.userId);

    // 2. Se o código não existir mais (passou dos 15 minutos), barra o usuário
    if (!savedCode) {
      throw new UnauthorizedError(
        "Código expirado ou não solicitado. Faça login novamente.",
      );
    }

    // 3. Valida se o código digitado bate exatamente com o do Redis
    if (savedCode !== dto.code) {
      throw new UnauthorizedError("Código de verificação incorreto.");
    }

    // 4. Código correto! Remove imediatamente do Redis (Garante uso único do código)
    await this.auth2FA.invalidateCode(dto.userId);

    // 5. Gera o token definitivo de acesso (usando o tempo padrão de 7 dias da sua classe)
    const token = this.tokenService.sign({
      sub: dto.userId,
      email: dto.email,
      roleId: dto.roleId,
      isDefinitive: true,
      // Usuário 100% autenticado no sistema
    });

    const trustedDeviceToken = this.tokenService.sign(
      {
        sub: dto.userId,
        email: dto.email,
        roleId: dto.roleId,
        isDefinitive: true,
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
