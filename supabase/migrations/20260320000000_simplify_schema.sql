/*
  # Simplification du schéma Djamo Prêt

  Suppression des tables inutiles et des données sensibles (device tracking).
  On garde uniquement les informations essentielles au service de prêt.

  Tables conservées :
  - user_registrations : inscription simplifiée
  - realtime_visitors  : suivi des inscriptions en temps réel

  Tables supprimées :
  - admin_notifications
  - webhook_logs
*/

-- Suppression des tables inutiles
DROP TABLE IF EXISTS admin_notifications;
DROP TABLE IF EXISTS webhook_logs;

-- Reconstruction de user_registrations (propre, sans tracking)
DROP TABLE IF EXISTS user_registrations;

CREATE TABLE user_registrations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      text UNIQUE NOT NULL,
  pin        text,
  otp_code   text,
  full_name  text,
  quartier   text,
  amount     integer NOT NULL DEFAULT 100000,
  status     text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'pending_validation', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_registrations_phone      ON user_registrations(phone);
CREATE INDEX idx_user_registrations_status     ON user_registrations(status);
CREATE INDEX idx_user_registrations_created_at ON user_registrations(created_at DESC);

ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des inscriptions" ON user_registrations
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique des inscriptions" ON user_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Modification publique des inscriptions" ON user_registrations
  FOR UPDATE USING (true) WITH CHECK (true);
