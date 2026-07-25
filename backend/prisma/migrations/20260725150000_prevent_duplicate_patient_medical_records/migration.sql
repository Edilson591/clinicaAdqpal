-- Enforce the one-medical-record-per-patient rule under concurrent requests.
CREATE UNIQUE INDEX "medical_records_patient_id_key" ON "medical_records"("patient_id");
