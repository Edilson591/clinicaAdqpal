import { ServiceUnavailableError, ValidationError } from "../../domain/errors/DomainError";
import type { IIdentityPasswordService } from "../../domain/services/IIdentityPasswordService";
import {
  identityGatewayClient,
  type IdentityGatewayClient,
} from "./PaperlessAuthGatewayClient";

export class DelegatedIdentityPasswordService implements IIdentityPasswordService {
  constructor(private readonly identity: IdentityGatewayClient = identityGatewayClient) {}

  async resetPassword(userId: string, password: string, currentPassword?: string): Promise<void> {
    const token = process.env.IDENTITY_SERVICE_TOKEN?.trim()
      ?? (process.env.NODE_ENV === "production" ? "" : "change-me-local-clinical-identity-token");
    if (!token) throw new ServiceUnavailableError("Integração de identidade não configurada.");
    const response = await this.identity.request({
      method: "POST",
      path: "/auth/integrations/clinical/password-reset",
      body: { userId, password, ...(currentPassword ? { currentPassword } : {}) },
      headers: {
        "content-type": "application/json",
        "x-identity-service-token": token,
      },
    });
    if (response.status < 200 || response.status >= 300) {
      if (currentPassword && response.status === 401) {
        throw new ValidationError("Senha atual incorreta.");
      }
      throw new ServiceUnavailableError("Não foi possível atualizar a credencial de acesso.");
    }
  }
}
