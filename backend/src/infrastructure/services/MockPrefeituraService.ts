import { INotaFiscalGateway } from "../../domain/services/INotaFiscalGateway";

export class MockPrefeituraService implements INotaFiscalGateway {
  async enviar(filePath: string): ReturnType<INotaFiscalGateway["enviar"]> {
    console.log("[MOCK NFSe] simulando envio...", filePath);

    return {
      status: "processado" as const,
      notas: {
        "1": {
          numero: "MOCK-" + Date.now(),
          url: "http://localhost/mock/nfse",
        },
      },
    };
  }
}


