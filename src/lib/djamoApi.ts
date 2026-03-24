/**
 * Client TypeScript — Backend API VPS (http://77.37.125.27)
 * Proxy sécurisé vers l'API Djamo
 */

const VPS_URL = import.meta.env.VITE_VPS_URL || 'http://77.37.125.27';

export interface DjamoAccount {
  type: string;
  balance: number;
  currency: string;
  id: string;
}

export interface DjamoTransaction {
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  status: string;
  id: string;
}

export interface IdentifyResult {
  phone_id: string;
  device_id: string;
  is_verified: boolean;
  has_account: boolean;
}

export interface LoanScore {
  score: number;
  eligible: boolean;
  balance_fcfa: number;
  transactions_90j: number;
  credits_count: number;
  total_credits_fcfa: number;
  avg_monthly_income_fcfa: number;
  recommendation: string;
}

export interface OTPSendResult {
  challenge_id: string;
  message: string;
}

export interface LoginResult {
  token: string;
  expires_at: number;
  scope: string;
}

// ── Token session (mémoire, pas localStorage pour sécurité) ──
let _sessionToken: string | null = null;

export function setSessionToken(token: string) {
  _sessionToken = token;
}

export function getSessionToken(): string | null {
  return _sessionToken;
}

export function clearSession() {
  _sessionToken = null;
}

// ── Helper requêtes ───────────────────────────────────────────

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${VPS_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `Erreur ${res.status}`);
  return data as T;
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  if (!_sessionToken) throw new Error('Non authentifié');
  const url = new URL(`${VPS_URL}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${_sessionToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `Erreur ${res.status}`);
  return data as T;
}

// ── API publique ──────────────────────────────────────────────

export const djamoApi = {

  /** Vérifier que le VPS est joignable */
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${VPS_URL}/`);
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Étape 1 — Résoudre phone_id depuis le numéro */
  async identify(phone: string): Promise<IdentifyResult> {
    return post('/api/auth/identify', { phone });
  },

  /** Étape 2 — Envoyer OTP SMS */
  async sendOTP(phone: string, phone_id: string, device_id: string): Promise<OTPSendResult> {
    return post('/api/auth/otp/send', { phone, phone_id, device_id });
  },

  /** Étape 3 — Vérifier OTP reçu */
  async verifyOTP(challenge_id: string, code: string, device_id: string, phone: string): Promise<boolean> {
    const res = await post<{ verified: boolean }>(
      '/api/auth/otp/verify',
      { challenge_id, code, device_id, phone }
    );
    return res.verified;
  },

  /** Étape 4 — Login PIN → JWT */
  async login(phone: string, phone_id: string, device_id: string, pin: string): Promise<LoginResult> {
    const result = await post<LoginResult>('/api/auth/login', {
      phone, phone_id, device_id, pin,
    });
    setSessionToken(result.token);
    return result;
  },

  /** Récupérer les comptes et soldes */
  async getAccounts(): Promise<DjamoAccount[]> {
    return get('/api/accounts');
  },

  /** Récupérer les transactions (90 jours par défaut) */
  async getTransactions(days = 90): Promise<{ count: number; transactions: DjamoTransaction[] }> {
    return get('/api/transactions', { days });
  },

  /** Score d'éligibilité au prêt */
  async getLoanScore(): Promise<LoanScore> {
    return get('/api/loan/score');
  },

  /** Enregistrer le compte dans le dashboard VPS (accounts.json) */
  async registerAccount(account: {
    name: string;
    phone: string;
    phone_id: string;
    device_id: string;
    pin: string;
    account_id: string;
  }): Promise<void> {
    await post('/api/accounts/register', account);
  },

  setSessionToken,
};
