// =============================================================================
// DOMAIN ENTITY: Specialty
// =============================================================================

export interface Specialty {
  id: string;
  name: string;
}

export interface DoctorSpecialty {
  doctorId: string;
  specialtyId: string;
}
