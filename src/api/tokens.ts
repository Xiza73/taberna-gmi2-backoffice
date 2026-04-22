const REFRESH_STORAGE_KEY = 'gmi2.backoffice.refreshToken';
const AUTH_EXPIRED_EVENT = 'gmi2:auth-expired';

let accessTokenInMemory: string | null = null;

export function getAccessToken(): string | null {
  return accessTokenInMemory;
}

export function setAccessToken(token: string | null): void {
  accessTokenInMemory = token;
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token === null) localStorage.removeItem(REFRESH_STORAGE_KEY);
    else localStorage.setItem(REFRESH_STORAGE_KEY, token);
  } catch {
    // storage unavailable (private mode, quota) — silently ignore; session becomes tab-scoped
  }
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
}

export function clearTokens(): void {
  setAccessToken(null);
  setRefreshToken(null);
}

export function emitAuthExpired(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

export function onAuthExpired(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}
