import type { NotaFiscal } from "../../domain/entities/NotaFiscal";
import type { NotaFiscalResponseDTO } from "../dtos/NotaFiscalDTOs";

export function toNotaFiscalResponseDTO(nf: NotaFiscal): NotaFiscalResponseDTO {
  return {
    id: nf.id,
    numero: nf.numero,
    patientId: nf.patientId,
    appointmentId: nf.appointmentId,
    transactionId: nf.transactionId,
    createdBy: nf.createdBy,
    servico: nf.servico,
    valor: nf.valor,
    status: nf.status,
    dataEmissao: nf.dataEmissao ? nf.dataEmissao.toISOString() : null,
    pdfUrl: nf.pdfUrl,
    observacoes: nf.observacoes,
    createdAt: nf.createdAt.toISOString(),
    updatedAt: nf.updatedAt.toISOString(),
  };
}
