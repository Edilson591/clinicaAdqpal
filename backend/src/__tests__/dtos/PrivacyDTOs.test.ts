import {
  CreateIncidentSchema,
  CreatePrivacyRequestSchema,
  RunRetentionSchema,
  UpsertRetentionPolicySchema,
} from "../../application/dtos/PrivacyDTOs";

describe("PrivacyDTOs", () => {
  it("valida uma solicitação de titular sem exigir documento completo", () => {
    const result = CreatePrivacyRequestSchema.parse({
      requesterName: "Maria Silva",
      requesterEmail: "MARIA@example.com",
      subjectType: "PATIENT",
      requestType: "ACCESS",
    });
    expect(result.requesterEmail).toBe("maria@example.com");
  });

  it("impede política ativa sem prazo juridicamente configurado", () => {
    const result = UpsertRetentionPolicySchema.safeParse({
      category: "AUDIT_LOGS",
      retentionDays: null,
      legalBasis: "Critério sujeito à aprovação do controlador.",
      criteria: "Registros sem bloqueio jurídico ou investigação ativa.",
      action: "DELETE",
      enabled: true,
    });
    expect(result.success).toBe(false);
  });

  it("executa retenção em modo de simulação por padrão", () => {
    expect(RunRetentionSchema.parse({}).dryRun).toBe(true);
  });

  it("exige dados mínimos para registrar incidente", () => {
    const result = CreateIncidentSchema.safeParse({
      title: "Acesso indevido detectado",
      summary: "Conta acessou prontuário sem vínculo assistencial.",
      severity: "HIGH",
      discoveredAt: "2026-11-12T12:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});
