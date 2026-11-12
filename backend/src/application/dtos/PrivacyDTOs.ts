import { z } from "zod";

const optionalText = (max: number) => z.string().trim().min(1).max(max).optional();

export const CreatePrivacyRequestSchema = z.object({
  requesterName: z.string().trim().min(2).max(120),
  requesterEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  subjectType: z.enum(["PATIENT", "USER", "EMPLOYEE", "OTHER"]),
  requestType: z.enum([
    "ACCESS",
    "CORRECTION",
    "PORTABILITY",
    "DELETION",
    "ANONYMIZATION",
    "CONSENT_REVOCATION",
    "SHARING_INFORMATION",
    "OTHER",
  ]),
  description: optionalText(2000),
});

export const UpdatePrivacyRequestSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "IDENTITY_PENDING",
    "IN_REVIEW",
    "LEGAL_HOLD",
    "APPROVED",
    "PARTIALLY_APPROVED",
    "REJECTED",
    "COMPLETED",
    "CANCELLED",
  ]).optional(),
  identityVerified: z.boolean().optional(),
  decisionReason: optionalText(2000),
  assignedTo: z.string().uuid().nullable().optional(),
}).refine((value) => Object.keys(value).length > 0, "Informe pelo menos uma alteração.");

export const UpsertRetentionPolicySchema = z.object({
  category: z.enum(["PASSWORD_RESET_TOKENS", "NOTIFICATION_OUTBOX", "AUDIT_LOGS"]),
  retentionDays: z.number().int().positive().max(36500).nullable(),
  legalBasis: z.string().trim().min(10).max(1000),
  criteria: z.string().trim().min(10).max(2000),
  action: z.enum(["DELETE", "ANONYMIZE", "REVIEW"]),
  enabled: z.boolean().default(false),
}).superRefine((value, context) => {
  if (value.enabled && value.retentionDays === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["retentionDays"], message: "Uma política ativa exige prazo fundamentado." });
  }
});

export const RunRetentionSchema = z.object({
  dryRun: z.boolean().default(true),
  confirmation: z.string().trim().optional(),
});

export const CreateIncidentSchema = z.object({
  title: z.string().trim().min(5).max(160),
  summary: z.string().trim().min(10).max(5000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  occurredAt: z.coerce.date().optional(),
  discoveredAt: z.coerce.date(),
  dataCategories: z.array(z.string().trim().min(1).max(100)).max(30).default([]),
  affectedSubjects: z.number().int().nonnegative().nullable().optional(),
  containmentMeasures: optionalText(5000),
  remediationMeasures: optionalText(5000),
  evidenceReferences: z.array(z.string().trim().min(1).max(500)).max(50).default([]),
});

export const UpdateIncidentSchema = z.object({
  status: z.enum(["OPEN", "CONTAINED", "UNDER_REVIEW", "CLOSED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  affectedSubjects: z.number().int().nonnegative().nullable().optional(),
  containmentMeasures: optionalText(5000),
  remediationMeasures: optionalText(5000),
  evidenceReferences: z.array(z.string().trim().min(1).max(500)).max(50).optional(),
  requiresAnpdReview: z.boolean().optional(),
  requiresSubjectReview: z.boolean().optional(),
  markHumanReviewed: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "Informe pelo menos uma alteração.");
