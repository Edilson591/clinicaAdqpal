import type { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import type { UpdateEmployeeDTO, EmployeeResponseDTO } from "../dtos/EmployeeDTOs";
import { NotFoundError, ConflictError } from "../../domain/errors/DomainError";
import { toEmployeeResponseDTO } from "../mappers/employeeMapper";

export class UpdateEmployee {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string, dto: UpdateEmployeeDTO): Promise<EmployeeResponseDTO> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) throw new NotFoundError("Funcionário não encontrado.");

    if (dto.cpf && dto.cpf !== existing.cpf) {
      const conflict = await this.employeeRepository.findByCpf(dto.cpf);
      if (conflict) throw new ConflictError("Já existe um funcionário com este CPF.");
    }

    if (dto.email && dto.email !== existing.email) {
      const conflict = await this.employeeRepository.findByEmail(dto.email);
      if (conflict) throw new ConflictError("Já existe um funcionário com este e-mail.");
    }

    const updateData = {
      ...dto,
      hireDate: dto.hireDate ? (typeof dto.hireDate === 'string' ? new Date(dto.hireDate) : dto.hireDate) : undefined,
      dateOfBirth: dto.dateOfBirth ? (typeof dto.dateOfBirth === 'string' ? new Date(dto.dateOfBirth) : dto.dateOfBirth) : undefined,
    };

    const updated = await this.employeeRepository.update(id, updateData);
    return toEmployeeResponseDTO(updated);
  }
}
