-- AlterTable: add pluggy_account_id to financial_accounts
ALTER TABLE "financial_accounts" ADD COLUMN "pluggy_account_id" TEXT;
CREATE UNIQUE INDEX "financial_accounts_pluggy_account_id_key" ON "financial_accounts"("pluggy_account_id");

-- CreateTable: pluggy_items
CREATE TABLE "pluggy_items" (
    "id" TEXT NOT NULL,
    "pluggy_item_id" TEXT NOT NULL,
    "connector_name" TEXT NOT NULL,
    "connector_logo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPDATED',
    "last_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pluggy_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pluggy_items_pluggy_item_id_key" ON "pluggy_items"("pluggy_item_id");
