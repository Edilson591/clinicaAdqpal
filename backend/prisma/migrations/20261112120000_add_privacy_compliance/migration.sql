CREATE TYPE "PrivacySubjectType" AS ENUM ('PATIENT', 'USER', 'EMPLOYEE', 'OTHER');
CREATE TYPE "PrivacyRequestType" AS ENUM ('ACCESS', 'CORRECTION', 'PORTABILITY', 'DELETION', 'ANONYMIZATION', 'CONSENT_REVOCATION', 'SHARING_INFORMATION', 'OTHER');
CREATE TYPE "PrivacyRequestStatus" AS ENUM ('RECEIVED', 'IDENTITY_PENDING', 'IN_REVIEW', 'LEGAL_HOLD', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "RetentionCategory" AS ENUM ('PASSWORD_RESET_TOKENS', 'NOTIFICATION_OUTBOX', 'AUDIT_LOGS');
CREATE TYPE "RetentionAction" AS ENUM ('DELETE', 'ANONYMIZE', 'REVIEW');
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'CONTAINED', 'UNDER_REVIEW', 'CLOSED');

CREATE TABLE "privacy_requests" (
  "id" TEXT NOT NULL,
  "protocol" TEXT NOT NULL,
  "access_token_hash" TEXT NOT NULL,
  "requester_name" TEXT NOT NULL,
  "requester_email" TEXT NOT NULL,
  "subject_type" "PrivacySubjectType" NOT NULL,
  "request_type" "PrivacyRequestType" NOT NULL,
  "description" TEXT,
  "status" "PrivacyRequestStatus" NOT NULL DEFAULT 'RECEIVED',
  "identity_verified_at" TIMESTAMP(3),
  "decision_reason" TEXT,
  "assigned_to" TEXT,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "privacy_requests_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "privacy_requests_protocol_key" ON "privacy_requests"("protocol");
CREATE INDEX "privacy_requests_status_created_at_idx" ON "privacy_requests"("status", "created_at");
CREATE INDEX "privacy_requests_requester_email_idx" ON "privacy_requests"("requester_email");

CREATE TABLE "privacy_request_events" (
  "id" TEXT NOT NULL,
  "request_id" TEXT NOT NULL,
  "actor_id" TEXT,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "privacy_request_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "privacy_request_events_request_id_created_at_idx" ON "privacy_request_events"("request_id", "created_at");
ALTER TABLE "privacy_request_events" ADD CONSTRAINT "privacy_request_events_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "privacy_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "retention_policies" (
  "id" TEXT NOT NULL,
  "category" "RetentionCategory" NOT NULL,
  "retention_days" INTEGER,
  "legal_basis" TEXT NOT NULL,
  "criteria" TEXT NOT NULL,
  "action" "RetentionAction" NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "last_run_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "retention_policies_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "retention_policies_category_key" ON "retention_policies"("category");

CREATE TABLE "retention_runs" (
  "id" TEXT NOT NULL,
  "policy_id" TEXT NOT NULL,
  "executed_by" TEXT NOT NULL,
  "dry_run" BOOLEAN NOT NULL,
  "cutoff_at" TIMESTAMP(3) NOT NULL,
  "affected_count" INTEGER NOT NULL,
  "result" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "retention_runs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "retention_runs_policy_id_created_at_idx" ON "retention_runs"("policy_id", "created_at");
ALTER TABLE "retention_runs" ADD CONSTRAINT "retention_runs_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "retention_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "security_incidents" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "severity" "IncidentSeverity" NOT NULL,
  "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
  "occurred_at" TIMESTAMP(3),
  "discovered_at" TIMESTAMP(3) NOT NULL,
  "notification_deadline" TIMESTAMP(3) NOT NULL,
  "data_categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "affected_subjects" INTEGER,
  "containment_measures" TEXT,
  "remediation_measures" TEXT,
  "evidence_references" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "requires_anpd_review" BOOLEAN NOT NULL DEFAULT true,
  "requires_subject_review" BOOLEAN NOT NULL DEFAULT true,
  "reviewed_by" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "created_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "security_incidents_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "security_incidents_status_severity_idx" ON "security_incidents"("status", "severity");
CREATE INDEX "security_incidents_notification_deadline_idx" ON "security_incidents"("notification_deadline");

CREATE TABLE "security_incident_events" (
  "id" TEXT NOT NULL,
  "incident_id" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "security_incident_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "security_incident_events_incident_id_created_at_idx" ON "security_incident_events"("incident_id", "created_at");
ALTER TABLE "security_incident_events" ADD CONSTRAINT "security_incident_events_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "security_incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
