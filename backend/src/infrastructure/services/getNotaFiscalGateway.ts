import { INotaFiscalGateway } from "../../domain/services/INotaFiscalGateway";
import { MockPrefeituraService } from "./MockPrefeituraService";
import { PrefeituraService } from "./PrefeituraService";


export function getNotaFiscalGateway(): INotaFiscalGateway {
  if (process.env.NFSE_MODE === "mock") {
    return new MockPrefeituraService();
  }

  return new PrefeituraService();
}