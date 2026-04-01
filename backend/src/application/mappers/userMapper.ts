import type { User } from "../../domain/entities/User";
import type { UserResponseDTO } from "../dtos/UserDTOs";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    cpf: user.cpf,
    cnpj: user.cnpj,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
