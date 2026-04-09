import type { ISpecialtyRepository } from "../../domain/repositories/ISpecialtyRepository";
import type { Specialty, DoctorSpecialty } from "../../domain/entities/Specialty";

export class SpecialtyService {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async getAll(): Promise<Specialty[]> {
    return this.specialtyRepository.findAll();
  }

  async getByDoctor(doctorId: string): Promise<Specialty[]> {
    return this.specialtyRepository.findByDoctor(doctorId);
  }

  async addToDoctor(doctorId: string, specialtyId: string): Promise<DoctorSpecialty> {
    return this.specialtyRepository.addToDoctor(doctorId, specialtyId);
  }

  async removeFromDoctor(doctorId: string, specialtyId: string): Promise<void> {
    return this.specialtyRepository.removeFromDoctor(doctorId, specialtyId);
  }
}
