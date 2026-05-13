import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserResponseDTO } from "../dtos/UserDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

export class GetUserByEmail {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    return toUserResponseDTO(user);
  }
}