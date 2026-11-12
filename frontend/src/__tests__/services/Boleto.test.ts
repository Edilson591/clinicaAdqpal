import { describe, expect, it } from "vitest";
import { boletoCancellationIdempotencyKey } from "../../services/Boleto";

describe("cancelamento de boleto", () => {
  it("gera a mesma chave para tentativas duplicadas", () => {
    const request = { scope: "BOLETO" as const, boletoId: "boleto-123" };
    expect(boletoCancellationIdempotencyKey(request)).toBe(boletoCancellationIdempotencyKey(request));
  });

  it("separa chaves de parcelas distintas", () => {
    expect(boletoCancellationIdempotencyKey({ scope: "CARNET_INSTALLMENT", seriesId: "serie", installmentNumber: 1 }))
      .not.toBe(boletoCancellationIdempotencyKey({ scope: "CARNET_INSTALLMENT", seriesId: "serie", installmentNumber: 2 }));
  });
});
