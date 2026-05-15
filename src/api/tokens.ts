const ACCESS_STORAGE_KEY = 'gmi2.backoffice.accessToken';
const REFRESH_STORAGE_KEY = 'gmi2.backoffice.refreshToken';
const AUTH_EXPIRED_EVENT = 'gmi2:auth-expired';

function readFromStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode, quota) — silently ignore
  }
}

// Tokens are read directly from storage on every access. This avoids stale
// in-memory copies across tabs and keeps the refresh queue in client.ts
// honest: it always sees the latest value that other tabs (or onAuthExpired
// handlers) may have just cleared.
export function getAccessToken(): string | null {
  return readFromStorage(ACCESS_STORAGE_KEY);
}

export function setAccessToken(token: string | null): void {
  writeToStorage(ACCESS_STORAGE_KEY, token);
}

export function getRefreshToken(): string | null {
  return readFromStorage(REFRESH_STORAGE_KEY);
}

export function setRefreshToken(token: string | null): void {
  writeToStorage(REFRESH_STORAGE_KEY, token);
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

// Exported for tests so they can clear storage between runs without coupling
// to the storage key constant.
export const __TEST_ONLY__ = {
  ACCESS_STORAGE_KEY,
  REFRESH_STORAGE_KEY,
};
