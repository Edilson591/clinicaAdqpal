import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { RegisterUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { ConflictError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError("Já existe uma conta com este e-mail.");
    }

    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictError("Este username já está em uso.");
    }

    const passwordHash = await this.hashService.hash(dto.password);

    const user = await this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      roleId: dto.roleId,
      cpf: dto.cpf ?? null,
      cnpj: dto.cnpj ?? null,
    });

    return toUserResponseDTO(user);
  }
}
