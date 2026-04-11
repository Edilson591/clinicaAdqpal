import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { UpdateUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { NotFoundError, ConflictError, ValidationError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

export class UpdateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }

    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.userRepository.findByEmail(dto.email);
      if (emailTaken) throw new ConflictError("Este e-mail já está em uso.");
    }

    if (dto.username && dto.username !== user.username) {
      const usernameTaken = await this.userRepository.findByUsername(dto.username);
      if (usernameTaken) throw new ConflictError("Este username já está em uso.");
    }

    if (dto.password) {
      if (!dto.currentPassword) {
        throw new ValidationError("Senha atual é obrigatória para alterar a senha.");
      }
      const valid = await this.hashService.compare(dto.currentPassword, user.passwordHash);
      if (!valid) {
        throw new ValidationError("Senha atual incorreta.");
      }
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
