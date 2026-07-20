import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { RegisterUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { ConflictError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

const DEFAULT_PUBLIC_ROLE_ID = 2;

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.findByEmail(dto.email),
      this.userRepository.findByUsername(dto.username),
    ]);

    // Mensagem genérica — não revela qual campo já existe (anti-enumeração)
    if (existingEmail || existingUsername) {
      throw new ConflictError("Já existe uma conta com os dados fornecidos.");
    }

    const passwordHash = await this.hashService.hash(dto.password);

    const user = await this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      roleId: DEFAULT_PUBLIC_ROLE_ID,
      cpf: dto.cpf ?? null,
      cnpj: dto.cnpj ?? null,
    });

    if (dto.specialtyIds !== undefined) {
      await this.userRepository.updateSpecialties(user.id, dto.specialtyIds);
    }

    return toUserResponseDTO(user, dto.specialtyIds);
  }
}
