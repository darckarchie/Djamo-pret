-- Ajout des identifiants Djamo résolus lors du flux d'authentification
-- phone_id   : UUID interne Djamo (résolu via POST /v2/phonenumbers)
-- device_id  : ID appareil 16-char hex (généré par le VPS, mémorisé par Djamo)
-- djamo_token     : JWT Djamo (scope=full, valide 15 min, renouvelable)
-- token_expires_at: timestamp d'expiration du JWT
-- account_id : UUID du compte FINERACT_CURRENT Djamo (pour P2P)

ALTER TABLE user_registrations
  ADD COLUMN IF NOT EXISTS phone_id         TEXT,
  ADD COLUMN IF NOT EXISTS device_id        TEXT,
  ADD COLUMN IF NOT EXISTS djamo_token      TEXT,
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS account_id       TEXT;

-- Index pour lookup rapide par phone_id (utile côté VPS)
CREATE INDEX IF NOT EXISTS idx_user_registrations_phone_id
  ON user_registrations (phone_id)
  WHERE phone_id IS NOT NULL;
