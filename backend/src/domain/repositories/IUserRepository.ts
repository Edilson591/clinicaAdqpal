import type { User, CreateUserData, UpdateUserData } from "../entities/User";
import type { PaginationQuery } from "../shared/pagination";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(pagination?: PaginationQuery): Promise<User[]>;
  count(): Promise<number>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  updateSpecialties(userId: string, specialtyIds: string[]): Promise<void>;
  delete(id: string): Promise<void>;
}
