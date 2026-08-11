CREATE TYPE "NotificationChannel" AS ENUM ('whatsapp', 'sms');
CREATE TYPE "NotificationOutboxStatus" AS ENUM ('PENDING', 'PUBLISHED');

CREATE TABLE "notification_outbox" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "last_error" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notification_outbox_status_created_at_idx"
ON "notification_outbox"("status", "created_at");

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_appointment_id_fkey"
FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
