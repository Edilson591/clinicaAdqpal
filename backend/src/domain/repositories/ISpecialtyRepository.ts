import type { Specialty, DoctorSpecialty } from "../entities/Specialty";

export interface ISpecialtyRepository {
  findAll(): Promise<Specialty[]>;
  findByDoctor(doctorId: string): Promise<Specialty[]>;
  addToDoctor(doctorId: string, specialtyId: string): Promise<DoctorSpecialty>;
  removeFromDoctor(doctorId: string, specialtyId: string): Promise<void>;
}
