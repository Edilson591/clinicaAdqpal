import type { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteEmployee {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) throw new NotFoundError("Funcionário não encontrado.");
    await this.employeeRepository.delete(id);
  }
}
