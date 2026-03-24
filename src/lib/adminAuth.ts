interface AdminSession {
  timestamp: number;
  expiresAt: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'admin_session';
const VALID_CODES = ['Djamo_Admin_2024', 'admin123'];

class AdminAuth {
  async login(code: string): Promise<boolean> {
    if (!VALID_CODES.includes(code)) {
      return false;
    }

    const session: AdminSession = {
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    const encoded = btoa(JSON.stringify(session));
    localStorage.setItem(STORAGE_KEY, encoded);

    this.setCookie('admin_auth', 'true', SESSION_DURATION);

    return true;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.deleteCookie('admin_auth');
  }

  checkSession(): boolean {
    try {
      const encoded = localStorage.getItem(STORAGE_KEY);
      if (!encoded) return false;

      const session: AdminSession = JSON.parse(atob(encoded));
      const now = Date.now();

      if (now > session.expiresAt) {
        this.logout();
        return false;
      }

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

  private renewSession(): void {
    const session: AdminSession = {
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    const encoded = btoa(JSON.stringify(session));
    localStorage.setItem(STORAGE_KEY, encoded);
    this.setCookie('admin_auth', 'true', SESSION_DURATION);
  }

  private setCookie(name: string, value: string, duration: number): void {
    const expires = new Date(Date.now() + duration);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

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
