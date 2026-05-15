import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __TEST_ONLY__,
  clearTokens,
  emitAuthExpired,
  getAccessToken,
  getRefreshToken,
  onAuthExpired,
  setAccessToken,
  setRefreshToken,
  setTokens,
} from './tokens';

const { ACCESS_STORAGE_KEY, REFRESH_STORAGE_KEY } = __TEST_ONLY__;

describe('tokens — storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when storage is empty', () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it('round-trips access token through storage', () => {
    setAccessToken('a-token');
    expect(localStorage.getItem(ACCESS_STORAGE_KEY)).toBe('a-token');
    expect(getAccessToken()).toBe('a-token');
  });

  it('round-trips refresh token through storage', () => {
    setRefreshToken('r-token');
    expect(localStorage.getItem(REFRESH_STORAGE_KEY)).toBe('r-token');
    expect(getRefreshToken()).toBe('r-token');
  });

  it('setTokens writes both at once', () => {
    setTokens({ accessToken: 'A', refreshToken: 'R' });
    expect(getAccessToken()).toBe('A');
    expect(getRefreshToken()).toBe('R');
  });

  it('clearTokens removes both', () => {
    setTokens({ accessToken: 'A', refreshToken: 'R' });
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it('setAccessToken(null) removes the key', () => {
    setAccessToken('A');
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem(ACCESS_STORAGE_KEY)).toBeNull();
  });

  it('always reads from storage (no in-memory cache)', () => {
    setAccessToken('first');
    // Other tab / context wrote a different value directly to storage
    localStorage.setItem(ACCESS_STORAGE_KEY, 'second');
    expect(getAccessToken()).toBe('second');
  });

  it('survives storage exceptions gracefully on read', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('quota');
      });
    expect(getAccessToken()).toBeNull();
    spy.mockRestore();
  });

  it('survives storage exceptions gracefully on write', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota');
      });
    expect(() => setAccessToken('A')).not.toThrow();
    spy.mockRestore();
  });
});

describe('tokens — auth-expired event', () => {
  let listeners: Array<() => void>;

  beforeEach(() => {
    listeners = [];
  });

  afterEach(() => {
    for (const unsubscribe of listeners) unsubscribe();
  });

  it('emit notifies registered listeners', () => {
    const handler = vi.fn();
    listeners.push(onAuthExpired(handler));
    emitAuthExpired();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops further notifications', () => {
    const handler = vi.fn();
    const unsubscribe = onAuthExpired(handler);
    unsubscribe();
    emitAuthExpired();
    expect(handler).not.toHaveBeenCalled();
  });

  it('multiple listeners all fire', () => {
    const a = vi.fn();
    const b = vi.fn();
    listeners.push(onAuthExpired(a), onAuthExpired(b));
    emitAuthExpired();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
