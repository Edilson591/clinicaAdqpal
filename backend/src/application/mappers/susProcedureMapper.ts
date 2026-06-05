import type { SusProcedure } from "../../domain/entities/SusProcedure";
import type { SusProcedureResponseDTO } from "../dtos/SusProcedureDTOs";

export function toSusProcedureResponseDTO(p: SusProcedure): SusProcedureResponseDTO {
  return {
    id: p.id,
    codigo: p.codigo,
    nome: p.nome,
    modalidade: p.modalidade,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
