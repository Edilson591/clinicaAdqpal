import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { UpdateUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { NotFoundError, ConflictError, ValidationError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";
import type { IIdentityPasswordService } from "../../domain/services/IIdentityPasswordService";

export class UpdateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly identityPasswordService: IIdentityPasswordService,
  ) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }

    if (dto.email && dto.email !== user.email) {
      throw new ValidationError("O e-mail de acesso deve ser alterado no serviço de identidade.");
    }

    if (dto.username && dto.username !== user.username) {
      const usernameTaken = await this.userRepository.findByUsername(dto.username);
      if (usernameTaken) throw new ConflictError("Este username já está em uso.");
    }

    if (dto.password) {
      if (!dto.currentPassword) {
        throw new ValidationError("Senha atual é obrigatória para alterar a senha.");
      }
      await this.identityPasswordService.resetPassword(id, dto.password, dto.currentPassword);
    }

    const updateData: Parameters<IUserRepository["update"]>[1] = {};

    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.roleId !== undefined) updateData.roleId = dto.roleId;
    if (dto.cpf !== undefined) updateData.cpf = dto.cpf;
    if (dto.cnpj !== undefined) updateData.cnpj = dto.cnpj;
    if (dto.password !== undefined) {
      updateData.passwordHash = await this.hashService.hash(dto.password);
    }

    const updated = await this.userRepository.update(id, updateData);

    if (dto.specialtyIds !== undefined) {
      await this.userRepository.updateSpecialties(id, dto.specialtyIds);
    }

    return toUserResponseDTO(updated);
  }
}
