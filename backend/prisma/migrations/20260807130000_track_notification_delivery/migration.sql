ALTER TYPE "NotificationOutboxStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "NotificationOutboxStatus" ADD VALUE 'SENT';
ALTER TYPE "NotificationOutboxStatus" ADD VALUE 'FAILED';

ALTER TABLE "notification_outbox"
ADD COLUMN "attempt_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "idempotency_key" TEXT,
ADD COLUMN "last_attempt_at" TIMESTAMP(3),
ADD COLUMN "sent_at" TIMESTAMP(3);

UPDATE "notification_outbox"
SET "idempotency_key" = "id";

ALTER TABLE "notification_outbox"
ALTER COLUMN "idempotency_key" SET NOT NULL;

CREATE UNIQUE INDEX "notification_outbox_idempotency_key_key"
ON "notification_outbox"("idempotency_key");
