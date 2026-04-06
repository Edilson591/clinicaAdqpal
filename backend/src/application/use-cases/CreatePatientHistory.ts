import type { IPatientHistoryRepository } from "../../domain/repositories/IPatientHistoryRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { CreatePatientHistoryDTO, PatientHistoryResponseDTO } from "../dtos/PatientHistoryDTOs";
import { toPatientHistoryResponseDTO } from "../dtos/PatientHistoryDTOs";
import { NotFoundError, ForbiddenError } from "../../domain/errors/DomainError";

const ALLOWED_ROLES = [1, 3]; // ADMIN = 1, DOCTOR = 3

export class CreatePatientHistory {
  constructor(
    private readonly historyRepository: IPatientHistoryRepository,
    private readonly userRepository: IUserRepository,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(
    requestingUserId: string,
    patientId: string,
    dto: CreatePatientHistoryDTO,
  ): Promise<PatientHistoryResponseDTO> {
    const doctor = await this.userRepository.findById(requestingUserId);
    if (!doctor) throw new NotFoundError("Usuário");

    if (!ALLOWED_ROLES.includes(doctor.roleId)) {
      throw new ForbiddenError("Apenas médicos e administradores podem criar registros clínicos.");
    }

    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new NotFoundError("Paciente");

    const history = await this.historyRepository.create({
      patientId,
      doctorId: requestingUserId,
      appointmentId: dto.appointmentId ?? null,
      type: dto.type,
      title: dto.title,
      description: dto.description,
      attachments: dto.attachments ?? [],
    });

    return toPatientHistoryResponseDTO(history);
  }
}
