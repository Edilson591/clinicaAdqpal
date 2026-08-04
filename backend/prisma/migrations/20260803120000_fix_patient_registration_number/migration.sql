-- Registration numbers are public sequential identifiers, not encrypted data.
CREATE SEQUENCE IF NOT EXISTS "patient_registration_seq"
    START WITH 1
    INCREMENT BY 1;

-- Move the sequence past every valid registration already stored.
DO $$
DECLARE
    highest_registration BIGINT;
BEGIN
    SELECT COALESCE(MAX("registration_number"::BIGINT), 0)
      INTO highest_registration
      FROM "patients"
     WHERE "registration_number" ~ '^[0-9]+$';

    PERFORM setval(
        'patient_registration_seq',
        GREATEST(highest_registration, 1),
        highest_registration > 0
    );
END $$;

-- Replace null, empty, or previously encrypted values with unique registrations.
UPDATE "patients"
   SET "registration_number" = LPAD(nextval('patient_registration_seq')::text, 6, '0')
 WHERE "registration_number" IS NULL
    OR "registration_number" !~ '^[0-9]+$';

ALTER TABLE "patients"
    ALTER COLUMN "registration_number"
    SET DEFAULT LPAD(nextval('patient_registration_seq')::text, 6, '0'),
    ALTER COLUMN "registration_number" SET NOT NULL;
