import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { ITokenService } from "../../domain/services/ITokenService";
import type { LoginUserDTO, LoginResponseDTO } from "../dtos/UserDTOs";
import { UnauthorizedError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    // Sempre compara hash mesmo se usuário não existir (evitar timing attacks)
    const passwordMatch =
      user !== null
        ? await this.hashService.compare(dto.password, user.passwordHash)
        : false;

    if (!user || !passwordMatch) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    const token = this.tokenService.sign({ sub: user.id, email: user.email, roleId: user.roleId });

    return {
      token,
      user: toUserResponseDTO(user),
    };
  }
}
