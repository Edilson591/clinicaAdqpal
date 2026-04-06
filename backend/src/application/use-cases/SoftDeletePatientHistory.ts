import type { IPatientHistoryRepository } from "../../domain/repositories/IPatientHistoryRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import { NotFoundError, ForbiddenError } from "../../domain/errors/DomainError";

export class SoftDeletePatientHistory {
  constructor(
    private readonly historyRepository: IPatientHistoryRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(requestingUserId: string, historyId: string): Promise<void> {
    const user = await this.userRepository.findById(requestingUserId);
    if (!user) throw new NotFoundError("Usuário");

    const history = await this.historyRepository.findById(historyId);
    if (!history) throw new NotFoundError("Registro de histórico");

    const isAdmin = user.roleId === 1;
    const isOwner = history.doctorId === requestingUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenError("Você não tem permissão para excluir este registro.");
    }

    await this.historyRepository.softDelete(historyId);
  }
}
