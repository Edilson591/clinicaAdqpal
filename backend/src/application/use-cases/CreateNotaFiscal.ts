import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import type { CreateNotaFiscalDTO, NotaFiscalResponseDTO } from "../dtos/NotaFiscalDTOs";
import { toNotaFiscalResponseDTO } from "../mappers/notaFiscalMapper";

export class CreateNotaFiscal {
  constructor(private readonly notaFiscalRepository: INotaFiscalRepository) {}

  async execute(dto: CreateNotaFiscalDTO, createdBy: string): Promise<NotaFiscalResponseDTO> {
    const numero = await this.notaFiscalRepository.getNextNumero();

    const notaFiscal = await this.notaFiscalRepository.create({
      numero,
      patientId: dto.patientId,
      appointmentId: dto.appointmentId ?? null,
      transactionId: dto.transactionId ?? null,
      createdBy,
      servico: dto.servico,
      valor: dto.valor,
      observacoes: dto.observacoes ?? null,
    });

    return toNotaFiscalResponseDTO(notaFiscal);
  }
}
