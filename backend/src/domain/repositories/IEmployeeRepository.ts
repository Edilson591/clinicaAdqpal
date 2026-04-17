import type { Employee, CreateEmployeeData, UpdateEmployeeData, EmployeeFilters } from "../entities/Employee";
import type { PaginationQuery } from "../shared/pagination";

export interface IEmployeeRepository {
  findById(id: string): Promise<Employee | null>;
  findByCpf(cpf: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  findAll(pagination?: PaginationQuery, filters?: EmployeeFilters): Promise<Employee[]>;
  count(filters?: EmployeeFilters): Promise<number>;
  create(data: CreateEmployeeData): Promise<Employee>;
  update(id: string, data: UpdateEmployeeData): Promise<Employee>;
  delete(id: string): Promise<void>;
}
