-- Ajouter pending_otp et pending_pin à la liste des statuts autorisés
ALTER TABLE user_registrations
  DROP CONSTRAINT IF EXISTS user_registrations_status_check;

ALTER TABLE user_registrations
  ADD CONSTRAINT user_registrations_status_check
  CHECK (status IN (
    'pending',
    'pending_validation',
    'pending_pin',
    'pending_otp',
    'verified',
    'rejected'
  ));
