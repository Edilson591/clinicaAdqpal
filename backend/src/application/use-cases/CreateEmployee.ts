import type { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import type { CreateEmployeeDTO, EmployeeResponseDTO } from "../dtos/EmployeeDTOs";
import { ConflictError } from "../../domain/errors/DomainError";
import { toEmployeeResponseDTO } from "../mappers/employeeMapper";

export class CreateEmployee {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(dto: CreateEmployeeDTO): Promise<EmployeeResponseDTO> {
    if (dto.cpf) {
      const existing = await this.employeeRepository.findByCpf(dto.cpf);
      if (existing) throw new ConflictError("Já existe um funcionário com este CPF.");
    }

    if (dto.email) {
      const existing = await this.employeeRepository.findByEmail(dto.email);
      if (existing) throw new ConflictError("Já existe um funcionário com este e-mail.");
    }

    const employee = await this.employeeRepository.create({
      name: dto.name,
      cpf: dto.cpf ?? null,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      position: dto.position,
      department: dto.department ?? null,
      hireDate: dto.hireDate ?? null,
      salary: dto.salary ?? null,
      status: dto.status ?? "ACTIVE",
      dateOfBirth: dto.dateOfBirth ?? null,
      gender: dto.gender ?? null,
      street: dto.street ?? null,
      streetNumber: dto.streetNumber ?? null,
      city: dto.city ?? null,
      state: dto.state ?? null,
      zipCode: dto.zipCode ?? null,
      notes: dto.notes ?? null,
    });

    return toEmployeeResponseDTO(employee);
  }
}
