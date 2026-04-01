import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserResponseDTO } from "../dtos/UserDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../mappers/userMapper";

export class GetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    return toUserResponseDTO(user);
  }
}
