import type { ISusProcedureRepository } from "../../domain/repositories/ISusProcedureRepository";
import type { SusProcedureResponseDTO } from "../dtos/SusProcedureDTOs";
import { toSusProcedureResponseDTO } from "../mappers/susProcedureMapper";

export class ListSusProcedures {
  constructor(private readonly repository: ISusProcedureRepository) {}

  async execute(): Promise<SusProcedureResponseDTO[]> {
    const procedures = await this.repository.findAll();
    return procedures.map(toSusProcedureResponseDTO);
  }
}
