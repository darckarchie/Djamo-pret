/*
  Table temporaire pour stocker les challenges OTP en cours
  Permet au backend de tracker les sessions d'authentification
*/

CREATE TABLE IF NOT EXISTS otp_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        text NOT NULL,
  challenge_id text NOT NULL,
  device_id    text NOT NULL,
  phone_id     text NOT NULL,
  verified     boolean DEFAULT false,
  token        text,
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX idx_otp_challenges_phone        ON otp_challenges(phone);
CREATE INDEX idx_otp_challenges_challenge_id ON otp_challenges(challenge_id);
CREATE INDEX idx_otp_challenges_expires_at   ON otp_challenges(expires_at);

ALTER TABLE otp_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service peut tout faire sur otp_challenges" ON otp_challenges
  FOR ALL USING (true) WITH CHECK (true);
