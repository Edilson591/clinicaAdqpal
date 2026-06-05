import type { ISusProcedureRepository } from "../../domain/repositories/ISusProcedureRepository";
import type { SusProcedureResponseDTO } from "../dtos/SusProcedureDTOs";
import { toSusProcedureResponseDTO } from "../mappers/susProcedureMapper";
import { NotFoundError } from "../../domain/errors/DomainError";

export class GetSusProcedure {
  constructor(private readonly repository: ISusProcedureRepository) {}

  async executeByCodigo(codigo: string): Promise<SusProcedureResponseDTO> {
    const procedure = await this.repository.findByCodigo(codigo);
    if (!procedure) throw new NotFoundError("Procedimento SUS");
    return toSusProcedureResponseDTO(procedure);
  }
}
