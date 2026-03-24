# 🎨 Djamo — Guide Branding & Typographie pour Développeurs

> **Source analysée :** [https://www.djamo.com/ci/](https://www.djamo.com/ci/)
> **Date d'analyse :** 15 mars 2026
> **Stack détecté :** Next.js (React) — Site SSR/SSG hébergé sur Cloudflare

---

## 1. IDENTITÉ DE MARQUE

### Positionnement
Djamo est une fintech ivoirienne proposant un compte bancaire mobile avec carte VISA, ciblant le marché UEMOA (Côte d'Ivoire et Sénégal). La marque communique **simplicité, accessibilité, confiance et modernité**.

### Tagline principale
> *"L'appli pour mieux gérer votre argent"*

### Hashtag signature
```
#hellodjamo
```

### Ton de voix
- Accessible et amical (tutoiement implicite, vouvoiement formel)
- Empowering — « Reprenez le contrôle de votre argent »
- Direct et sans jargon financier
- Orienté bénéfice utilisateur (ZÉRO frais, gratuit, en 1 min)

---

## 2. PALETTE DE COULEURS

### Couleurs primaires

| Rôle | Hex | RGB | Utilisation |
|------|-----|-----|-------------|
| **Vert Djamo (Primary)** | `#00C853` / `#00B74F` | 0, 200, 83 | Boutons CTA, accents, logo |
| **Noir profond** | `#1A1A2E` / `#111827` | 26, 26, 46 | Texte principal, headers |
| **Blanc** | `#FFFFFF` | 255, 255, 255 | Fonds principaux |

### Couleurs secondaires

| Rôle | Hex | Utilisation |
|------|-----|-------------|
| **Gris foncé** | `#374151` | Texte secondaire, descriptions |
| **Gris moyen** | `#6B7280` | Texte tertiaire, labels |
| **Gris clair** | `#F3F4F6` / `#F9FAFB` | Fonds de sections alternées |
| **Vert clair (tint)** | `#ECFDF5` / `#D1FAE5` | Backgrounds highlights, badges |
| **Jaune/Or accent** | `#FFC107` / `#FBBF24` | Étoiles notation, éléments premium |

### Couleurs fonctionnelles

| Rôle | Hex | Utilisation |
|------|-----|-------------|
| **Succès** | `#10B981` | Validations, confirmations |
| **Erreur** | `#EF4444` | Messages d'erreur |
| **Info** | `#3B82F6` | Liens, informations |
| **Warning** | `#F59E0B` | Alertes, avertissements |

### CSS Variables recommandées

```css
:root {
  /* Primaires */
  --djamo-green: #00C853;
  --djamo-green-dark: #00A344;
  --djamo-green-light: #ECFDF5;
  --djamo-black: #1A1A2E;
  --djamo-white: #FFFFFF;

  /* Texte */
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6B7280;
  --text-muted: #9CA3AF;

  /* Surfaces */
  --surface-primary: #FFFFFF;
  --surface-secondary: #F9FAFB;
  --surface-tertiary: #F3F4F6;

  /* Bordures */
  --border-light: #E5E7EB;
  --border-default: #D1D5DB;
}
```

---

## 3. TYPOGRAPHIE

### Police principale
Djamo utilise une police sans-serif géométrique moderne. D'après l'analyse du rendu visuel du site :

```css
/* Police principale détectée */
font-family: 'General Sans', 'Satoshi', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

> **Note :** Le site charge ses polices personnalisées via des fichiers locaux (pas Google Fonts). La police principale s'apparente à **General Sans** ou **Satoshi** (Indian Type Foundry / Fontshare) — polices sans-serif géométriques modernes très populaires dans les fintechs africaines.

### Hiérarchie typographique

| Élément | Taille (Desktop) | Taille (Mobile) | Poids | Line-height |
|---------|-----------------|-----------------|-------|-------------|
| **H1 — Hero** | 48–56px | 32–36px | 700 (Bold) | 1.1–1.2 |
| **H2 — Section** | 36–42px | 28–32px | 700 (Bold) | 1.2–1.3 |
| **H3 — Sous-section** | 24–28px | 20–24px | 600 (SemiBold) | 1.3 |
| **H4 — Card title** | 20–22px | 18–20px | 600 (SemiBold) | 1.4 |
| **Body** | 16–18px | 15–16px | 400 (Regular) | 1.6–1.7 |
| **Body small** | 14px | 13–14px | 400 (Regular) | 1.5 |
| **Caption / Label** | 12–13px | 12px | 500 (Medium) | 1.4 |
| **CTA Button** | 16px | 15–16px | 600 (SemiBold) | 1 |

### Styles de texte

```css
/* Hero H1 */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

/* Section H2 */
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.625rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

/* Body text */
.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.65;
  color: var(--text-secondary);
}

/* CTA Button */
.cta-button {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none; /* Pas de uppercase */
}
```

---

## 4. COMPOSANTS UI

### Boutons CTA

```css
/* Bouton principal (vert) */
.btn-primary {
  background-color: var(--djamo-green);
  color: #FFFFFF;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 200, 83, 0.25);
}

.btn-primary:hover {
  background-color: var(--djamo-green-dark);
  box-shadow: 0 4px 16px rgba(0, 200, 83, 0.35);
  transform: translateY(-1px);
}

/* Bouton secondaire (outline) */
.btn-secondary {
  background-color: transparent;
  color: var(--djamo-green);
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid var(--djamo-green);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--djamo-green-light);
}
```

### Cards

```css
.feature-card {
  background: var(--surface-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06),
              0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08),
              0 12px 32px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
```

### Input / Champ téléphone

```css
.phone-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-primary);
  border: 1.5px solid var(--border-default);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.phone-input:focus-within {
  border-color: var(--djamo-green);
  box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.12);
}

.phone-prefix {
  color: var(--text-tertiary);
  font-weight: 500;
  padding-right: 8px;
  border-right: 1px solid var(--border-light);
}
```

### Navigation

```css
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--djamo-green);
}
```

---

## 5. STRUCTURE DE LA PAGE (SITEMAP)

### Architecture du site

```
djamo.com/ci/
├── / (Accueil)
├── /coffres (Produit Épargne)
├── /transferts (Produit Transferts)
├── /cartes (Produit Cartes VISA)
├── /business (Offre Business)
├── /tarifs (Plans Free & Premium)
├── /temoignages (Social proof)
├── /points-relais (Réseau physique)
├── /apprendre (Blog / Éducation financière)
├── /conditions-generales-et-tarifaires
└── /politique-de-confidentialite

Sous-domaines :
├── support.djamo.ci/fr/ (Centre d'aide)
├── careers.djamo.com (Recrutement)
├── go.djamo.com/ci (Deep link → App store)
└── static-assets.djamo.io/ (CDN images)
```

### Structure de la page d'accueil (sections)

```
1. NAVBAR
   ├── Logo Djamo
   ├── Navigation (Accueil, Produits ▼, Tarifs, Témoignages, Points relais, Apprendre, FAQs)
   └── CTA "Ouvrir un compte gratuit"

2. HERO SECTION
   ├── Hashtag "#hellodjamo"
   ├── Titre "L'appli pour mieux gérer votre argent"
   ├── Sous-titre + Champ SMS (indicatif +225)
   ├── Logo partenaire BGFIBank
   ├── Image app mockup (SVG)
   └── Image carte Djamo VISA

3. ONBOARDING STEPS (3 étapes)
   ├── Étape 1 : Ouvrez un compte en 1min
   ├── Étape 2 : Commandez votre carte physique
   └── Étape 3 : Accédez aux services via l'appli

4. FEATURES GRID (6 features)
   ├── NRB (Numéro de réception bancaire)
   ├── Coffres (Épargne automatique)
   ├── Transferts (Gratuits)
   ├── Retraits gratuits
   ├── Gestion des dépenses
   └── Carte VISA

5. SECTION ZÉRO FRAIS
   ├── Titre + Liste des 6 avantages "ZÉRO frais"
   ├── CTA → /tarifs
   └── Photo lifestyle (femme heureuse)

6. SECTION COFFRES (Épargne)
   ├── Screenshot app coffres
   ├── 3 avantages listés
   └── CTA → /coffres

7. SECTION CONTRÔLE (Suivi dépenses)
   ├── 3 avantages listés
   ├── Screenshot app contrôle
   └── CTA

8. SECTION SANS LIMITES
   ├── Screenshot app
   ├── 4 avantages listés
   └── CTA

9. SOCIAL PROOF
   ├── Stats : +1.5M téléchargements, 4.7★
   ├── Badges App Store / Google Play / Huawei
   └── 3 témoignages clients (carousel)

10. SECTION PARRAINAGE
    ├── "Gagnez jusqu'à 100.000 F CFA"
    └── CTA

11. SECTION SÉCURITÉ (3 garanties)
    ├── Argent en sécurité
    ├── Carte volée/perdue → blocage instantané
    └── Paiements sécurisés

12. CTA FINAL
    └── "Reprenez le contrôle de votre argent"

13. FOOTER
    ├── Société (À propos, Carrières, CGT, Confidentialité)
    ├── Produits (Coffres, Transferts, Cartes, Business)
    ├── Ressources (Tarifs, Points relais, Apprendre)
    ├── Pays (🇨🇮 Côte d'Ivoire, 🇸🇳 Sénégal)
    └── © 2020-2025 Djamo Inc.

14. MODAL QR CODE (Sticky bottom)
    └── QR code téléchargement + champ SMS alternatif
```

---

## 6. ÉLÉMENTS VISUELS & ASSETS

### Logo
- **Format :** SVG (vectoriel)
- **Variantes :** Logo couleur (vert sur blanc), logo blanc (sur fond sombre)
- **Emplacement :** Navbar + Footer

### Images & Illustrations

| Asset | URL | Format | Usage |
|-------|-----|--------|-------|
| App mockup | `/images/djamo_app_in_phone_sn.svg` | SVG | Hero section |
| Carte VISA | `/images/djamo_card_small_bgfi.png` | PNG | Hero section |
| Carte ISO | `/images/djamo-card-iso.webp` | WebP | Section sécurité |
| App coffres | `/images/djamo_app_vaults.svg` | SVG | Section épargne |
| App contrôle | `/images/djamo_app_control.svg` | SVG | Section contrôle |
| App sans limites | `/images/djamo_app_no_limit.svg` | SVG | Section limites |
| Femme heureuse | `/images/djamo_woman_happy.webp` | WebP | Section zéro frais |
| QR Code | `/images/djamo_civ_qr_code.svg` | SVG | Modal download |
| Logo BGFIBank | `/logos/bgfi-bank-logo.png` | PNG | Partenaire |

### Icônes

| Icône | URL | Usage |
|-------|-----|-------|
| Coffres menu | `/icons/menu-icon-vault.svg` | Navigation dropdown |
| Transferts menu | `/icons/menu-icon-transfers.svg` | Navigation dropdown |
| Cartes menu | `/icons/menu-icon-card.svg` | Navigation dropdown |
| Business | `/icons/icon-plan-plus.png` | Navigation + Tarifs |
| Plan Free | `/icons/icon-plan-free.png` | Page tarifs |
| Plan Premium | `/icons/icon-plan-premium.png` | Page tarifs |
| Drapeau CI | `/icons/flag_civ_icon.svg` | Footer pays |
| Drapeau SN | `/icons/flag_sen_icon.svg` | Footer pays |

### Badges stores

| Store | URL | Format |
|-------|-----|--------|
| Google Play | `/images/google-play-badge.webp` | WebP |
| App Store | `/images/apple-appstore-badge.webp` | WebP |
| Huawei AppGallery | `/images/huawei-appgallery-badge.webp` | WebP |

### CDN pour images dynamiques
```
https://static-assets.djamo.io/website/
```

---

## 7. LAYOUT & SPACING

### Grille

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 48px;
  }
}

@media (min-width: 1280px) {
  .container {
    padding: 0 64px;
  }
}
```

### Spacing scale (8px base)

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### Sections spacing

```css
.section {
  padding: var(--space-20) 0; /* 80px vertical */
}

@media (min-width: 768px) {
  .section {
    padding: var(--space-24) 0; /* 96px vertical */
  }
}
```

### Border radius scale

```css
:root {
  --radius-sm: 8px;    /* Petits éléments, badges */
  --radius-md: 12px;   /* Boutons, inputs */
  --radius-lg: 16px;   /* Cards */
  --radius-xl: 24px;   /* Sections, modals */
  --radius-full: 9999px; /* Avatars, pills */
}
```

---

## 8. PATTERNS DE DESIGN

### Alternance de fonds
Les sections alternent entre fond blanc et fond gris clair pour créer un rythme visuel :
```
Section 1: blanc → Section 2: gris → Section 3: blanc → ...
```

### Layout des sections features
Pattern récurrent : **texte + image côte à côte**, alternant gauche/droite :
```
Section A: [Texte | Image]
Section B: [Image | Texte]
Section C: [Texte | Image]
```

### Approche Mobile-First
- Design responsive avec breakpoints à `640px`, `768px`, `1024px`, `1280px`
- Les sections texte+image passent en stack vertical sur mobile
- Navigation hamburger sur mobile
- CTA sticky bottom sur mobile

### Témoignages
- Carousel horizontal avec 3 cartes
- Photo de profil ronde + nom + étoiles jaunes + citation en italique

### Plans tarifaires
- 2 colonnes (Free vs Premium)
- Le plan Premium a un badge "Tout inclus" et un traitement visuel distinct
- Liste comparative avec check marks

---

## 9. ANIMATIONS & TRANSITIONS

```css
/* Transitions globales */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* Hover sur les cards */
.card {
  transition: transform var(--transition-slow), box-shadow var(--transition-slow);
}
.card:hover {
  transform: translateY(-4px);
}

/* Fade in au scroll (suggestion) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 10. INFORMATIONS BUSINESS (pour contexte)

### Partenaire bancaire
- **BGFIBank Côte d'Ivoire** — émetteur de la carte VISA co-brandée

### Marchés
- 🇨🇮 Côte d'Ivoire (principal) — indicatif `+225`
- 🇸🇳 Sénégal (secondaire) — indicatif `+221`

### Plans tarifaires

| Feature | Free | Premium (2 000 F/mois) |
|---------|------|----------------------|
| IBAN | 0F | 0F |
| Dépôts | 0F | 0F |
| Transferts internes | 0F | 0F |
| Retraits UEMOA | 0F | 0F |
| Paiements UEMOA | 0F | 0F |
| Hors UEMOA | 200F + change | 200F + change |
| Vers Mobile Money | 1.5% | 0F (≤1M) puis 1% |
| Vers Banques | 1.5% | 0F |
| Coffres | 2 max | 10 max |
| Support prioritaire | ✗ | ✓ |

### Métriques affichées
- **+1.5 millions** de téléchargements
- **4.7★** note moyenne stores
- Disponible sur **Google Play**, **App Store**, **Huawei AppGallery**

### Contact
- Email : `hello@djamo.ci`
- Support : via chat in-app ou `support.djamo.ci`

---

## 11. RECOMMANDATIONS POUR LE DÉVELOPPEUR

### Polices à utiliser
Si tu ne peux pas accéder aux polices exactes de Djamo, utilise ces alternatives proches :
1. **General Sans** (Fontshare — gratuit) — Le plus proche
2. **Satoshi** (Fontshare — gratuit) — Alternative excellente
3. **Plus Jakarta Sans** (Google Fonts — gratuit) — Backup accessible

```html
<!-- Option 1: Fontshare -->
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">

<!-- Option 2: Google Fonts backup -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Stack technique recommandé
- **Framework :** Next.js 14+ (App Router)
- **Styling :** Tailwind CSS
- **Animations :** Framer Motion
- **Icônes :** Lucide React ou custom SVG
- **Images :** Format WebP + SVG pour illustrations

### Config Tailwind suggérée

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        djamo: {
          green: '#00C853',
          'green-dark': '#00A344',
          'green-light': '#ECFDF5',
        },
      },
      fontFamily: {
        sans: ['General Sans', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
    },
  },
}
```

---

*Document généré par analyse du site djamo.com/ci — Mars 2026*
