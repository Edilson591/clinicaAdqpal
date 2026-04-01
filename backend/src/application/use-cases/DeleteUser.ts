import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    await this.userRepository.delete(id);
  }
}
