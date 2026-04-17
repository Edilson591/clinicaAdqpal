import type { Employee } from "../../domain/entities/Employee";
import type { EmployeeResponseDTO } from "../dtos/EmployeeDTOs";

export function toEmployeeResponseDTO(employee: Employee): EmployeeResponseDTO {
  return {
    id: employee.id,
    name: employee.name,
    cpf: employee.cpf,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    department: employee.department,
    hireDate: employee.hireDate ? employee.hireDate.toISOString() : null,
    salary: employee.salary,
    status: employee.status,
    dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.toISOString() : null,
    gender: employee.gender,
    street: employee.street,
    streetNumber: employee.streetNumber,
    city: employee.city,
    state: employee.state,
    zipCode: employee.zipCode,
    notes: employee.notes,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
