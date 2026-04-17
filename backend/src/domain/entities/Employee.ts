// =============================================================================
// DOMAIN ENTITY: Employee
// =============================================================================

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface Employee {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  position: string;
  department: string | null;
  hireDate: Date | null;
  salary: number | null;
  status: EmployeeStatus;
  dateOfBirth: Date | null;
  gender: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFilters {
  search?: string;
  status?: EmployeeStatus;
  department?: string;
}

export interface CreateEmployeeData {
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  position: string;
  department?: string | null;
  hireDate?: string | null;
  salary?: number | null;
  status?: EmployeeStatus;
  dateOfBirth?: string | null;
  gender?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  notes?: string | null;
}

export interface UpdateEmployeeData {
  name?: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  position?: string;
  department?: string | null;
  hireDate?: Date | null;
  salary?: number | null;
  status?: EmployeeStatus;
  dateOfBirth?: Date | null;
  gender?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  notes?: string | null;
}
