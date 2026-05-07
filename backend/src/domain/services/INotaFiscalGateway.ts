import { PrefeituraResponse } from "../entities/Prefeitura";

export interface INotaFiscalGateway {
  enviar(filePath: string): Promise<PrefeituraResponse>;
}