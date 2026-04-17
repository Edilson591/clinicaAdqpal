import type { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import type { EmployeeResponseDTO } from "../dtos/EmployeeDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toEmployeeResponseDTO } from "../mappers/employeeMapper";
import type { EmployeeFilters } from "../../domain/entities/Employee";
import { PaginatedResult, toPaginatedResult, type PaginationQuery } from "../../domain/shared/pagination";

export class GetEmployee {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async executeById(id: string): Promise<EmployeeResponseDTO> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) throw new NotFoundError("Funcionário não encontrado.");
    return toEmployeeResponseDTO(employee);
  }

  async executeList(
    pagination?: PaginationQuery,
    filters?: EmployeeFilters,
  ): Promise<PaginatedResult<EmployeeResponseDTO>> {
    const [data, total] = await Promise.all([
      this.employeeRepository.findAll(pagination, filters),
      this.employeeRepository.count(filters),
    ]);

      return toPaginatedResult(
          data.map(toEmployeeResponseDTO),
          total,
          pagination ?? { page: 1, limit: total },

        );
    // return {
    //   data: data.map(toEmployeeResponseDTO),
    //   pagination: 
    //   total,
    //   page: pagination?.page ?? 1,
    //   limit: pagination?.limit ?? total,
    // };
  }
}
