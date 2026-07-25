-- Prevent concurrent requests from booking the same professional and time slot.
CREATE UNIQUE INDEX "appointments_user_id_scheduled_at_key" ON "appointments"("user_id", "scheduled_at");
