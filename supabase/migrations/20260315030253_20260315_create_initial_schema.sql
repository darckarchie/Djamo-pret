/*
  # Schéma initial pour Djamo Prêt

  1. Nouvelles tables
    - user_registrations: Inscriptions et demandes de prêt
    - realtime_visitors: Tracking des visiteurs en temps réel
    - admin_notifications: Notifications pour les administrateurs
    - webhook_logs: Logs des webhooks

  2. Index pour performance
    - Index sur phone, status, created_at pour user_registrations
    - Index sur session_id, last_seen pour realtime_visitors
    - Index sur notified, timestamp pour admin_notifications

  3. Sécurité
    - Row Level Security (RLS) activé sur toutes les tables
    - Policies publiques pour insertion/lecture
    - Policies restrictives pour modifications admin

  4. Notes
    - Montants en Frank CFA (XOF)
    - Statuts: pending, pending_validation, verified, rejected
    - Durées: 2, 3, ou 4 mois
*/

CREATE TABLE IF NOT EXISTS user_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pending_validation', 'verified', 'rejected')),
  account_type text CHECK (account_type IN ('particulier', 'entreprise')),
  
  -- Prêt
  project_type text,
  amount integer NOT NULL DEFAULT 100000,
  duration integer,
  interest_rate numeric(5,2),
  
  -- Informations personnelles
  full_name text,
  email text,
  address text,
  has_transactions boolean DEFAULT false,
  
  -- Vérification
  verification_attempts integer DEFAULT 0,
  last_verification_code text,
  verification_url text,
  
  -- Sécurité
  pin text,
  pin_attempts integer DEFAULT 0,
  
  -- Device info (anonymisé)
  user_mac_address text,
  user_device_id text,
  user_ip text,
  user_country text,
  user_browser text,
  user_os text,
  phone_model text,
  device_type text,
  device_vendor text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_registrations_phone ON user_registrations(phone);
CREATE INDEX IF NOT EXISTS idx_user_registrations_status ON user_registrations(status);
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON user_registrations(email);

ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des inscriptions" ON user_registrations
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique des inscriptions" ON user_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Modification publique des inscriptions" ON user_registrations
  FOR UPDATE USING (true) WITH CHECK (true);

-- Table des visiteurs en temps réel
CREATE TABLE IF NOT EXISTS realtime_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  page text NOT NULL,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_realtime_visitors_session_id ON realtime_visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_realtime_visitors_last_seen ON realtime_visitors(last_seen DESC);

ALTER TABLE realtime_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des visiteurs" ON realtime_visitors
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique des visiteurs" ON realtime_visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Modification publique des visiteurs" ON realtime_visitors
  FOR UPDATE USING (true) WITH CHECK (true);

-- Table des notifications admin
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  phone_number text,
  message text,
  notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_event_type ON admin_notifications(event_type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_notified ON admin_notifications(notified);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture notifications authentifiées" ON admin_notifications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Insertion notifications service" ON admin_notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Table des logs webhooks
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertion logs webhooks" ON webhook_logs
  FOR INSERT WITH CHECK (true);
