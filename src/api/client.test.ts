import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './client';
import { ApiError } from './errors';
import { clearTokens, setTokens } from './tokens';

type FetchMock = ReturnType<typeof vi.fn>;

const fetchMock = vi.fn() as FetchMock;
vi.stubGlobal('fetch', fetchMock);

function jsonResponse<T>(
  status: number,
  body: { success: true; data: T } | { success: false; message: string },
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function noContentResponse(): Response {
  return new Response(null, { status: 204 });
}

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
});

afterEach(() => {
  clearTokens();
});

describe('apiClient — happy paths', () => {
  it('GET parses BaseResponse.data', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { success: true, data: { hello: 'world' } }),
    );
    const out = await apiClient.get<{ hello: string }>('/things');
    expect(out).toEqual({ hello: 'world' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('/things');
    expect((init as RequestInit).method).toBe('GET');
  });

  it('204 returns undefined', async () => {
    fetchMock.mockResolvedValueOnce(noContentResponse());
    const out = await apiClient.delete('/things/1');
    expect(out).toBeUndefined();
  });

  it('sends Authorization header when access token is set', async () => {
    setTokens({ accessToken: 'A', refreshToken: 'R' });
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { success: true, data: null }),
    );
    await apiClient.get('/secure');
    const init = fetchMock.mock.calls[0]![1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer A',
    );
  });

  it('serializes body as JSON with Content-Type', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { success: true, data: { id: 1 } }),
    );
    await apiClient.post('/things', { name: 'x' });
    const init = fetchMock.mock.calls[0]![1] as RequestInit;
    expect((init.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json',
    );
    expect(init.body).toBe(JSON.stringify({ name: 'x' }));
  });

  it('appends query params, skipping undefined/null', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { success: true, data: [] }),
    );
    await apiClient.get('/things', {
      query: { page: 1, search: 'abc', empty: undefined, nope: null },
    });
    const url = String(fetchMock.mock.calls[0]![0]);
    expect(url).toContain('page=1');
    expect(url).toContain('search=abc');
    expect(url).not.toContain('empty=');
    expect(url).not.toContain('nope=');
  });
});

describe('apiClient — error paths', () => {
  it('throws ApiError with NETWORK_ERROR on fetch failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('boom'));
    await expect(apiClient.get('/things')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      status: 0,
    });
  });

  it('rethrows AbortError as-is', async () => {
    const abort = new Error('aborted');
    abort.name = 'AbortError';
    fetchMock.mockRejectedValueOnce(abort);
    await expect(apiClient.get('/things')).rejects.toBe(abort);
  });

  it('throws ApiError with message from { success: false }', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(400, { success: false, message: 'Invalid' }),
    );
    await expect(apiClient.get('/things')).rejects.toMatchObject({
      status: 400,
      message: 'Invalid',
    });
  });

  it('throws ApiError on malformed JSON', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('not json', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      }),
    );
    await expect(apiClient.get('/things')).rejects.toBeInstanceOf(ApiError);
  });
});

describe('apiClient — refresh flow', () => {
  it('refreshes on 401 and retries original request', async () => {
    setTokens({ accessToken: 'stale', refreshToken: 'R' });
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, message: 'Expired' }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, {
          success: true,
          data: { accessToken: 'fresh', refreshToken: 'R2' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { success: true, data: { ok: true } }),
      );

    const out = await apiClient.get<{ ok: boolean }>('/secure');
    expect(out).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    // 3rd attempt uses the new token
    const retryInit = fetchMock.mock.calls[2]![1] as RequestInit;
    expect((retryInit.headers as Record<string, string>).Authorization).toBe(
      'Bearer fresh',
    );
    expect(localStorage.getItem('gmi2.backoffice.accessToken')).toBe('fresh');
  });

  it('shares one refresh promise across concurrent 401s', async () => {
    setTokens({ accessToken: 'stale', refreshToken: 'R' });
    let resolveRefresh!: (v: Response) => void;
    const refreshPromise = new Promise<Response>((resolve) => {
      resolveRefresh = resolve;
    });

    fetchMock.mockImplementation((url: string) => {
      const u = String(url);
      if (u.endsWith('/staff/auth/refresh')) return refreshPromise;
      // 1st GET → 401, 2nd GET (retry) → 200
      if (u.endsWith('/secure-a') || u.endsWith('/secure-b')) {
        const state = (fetchMock as unknown as { _state?: Record<string, number> })
          ._state ?? {};
        (fetchMock as unknown as { _state?: Record<string, number> })._state =
          state;
        state[u] = (state[u] ?? 0) + 1;
        if (state[u] === 1) {
          return Promise.resolve(
            jsonResponse(401, { success: false, message: 'Expired' }),
          );
        }
        return Promise.resolve(
          jsonResponse(200, { success: true, data: u.endsWith('a') ? 'A' : 'B' }),
        );
      }
      throw new Error(`unexpected url ${u}`);
    });

    const p1 = apiClient.get<string>('/secure-a');
    const p2 = apiClient.get<string>('/secure-b');

    // Let initial 401s land
    await new Promise((r) => setTimeout(r, 0));
    resolveRefresh(
      jsonResponse(200, {
        success: true,
        data: { accessToken: 'fresh', refreshToken: 'R2' },
      }),
    );

    const [a, b] = await Promise.all([p1, p2]);
    expect(a).toBe('A');
    expect(b).toBe('B');

    // Refresh endpoint called exactly once
    const refreshCalls = fetchMock.mock.calls.filter((c) =>
      String(c[0]).endsWith('/staff/auth/refresh'),
    );
    expect(refreshCalls).toHaveLength(1);
  });

  it('clears tokens and throws when refresh fails', async () => {
    setTokens({ accessToken: 'stale', refreshToken: 'R' });
    const emitSpy = vi.fn();
    window.addEventListener('gmi2:auth-expired', emitSpy);

    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, message: 'Expired' }),
      )
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, message: 'Refresh denied' }),
      );

    await expect(apiClient.get('/secure')).rejects.toMatchObject({
      status: 401,
    });
    expect(localStorage.getItem('gmi2.backoffice.accessToken')).toBeNull();
    expect(localStorage.getItem('gmi2.backoffice.refreshToken')).toBeNull();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    window.removeEventListener('gmi2:auth-expired', emitSpy);
  });

  it('does not refresh on 401 when there is no refresh token', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(401, { success: false, message: 'Expired' }),
    );
    await expect(apiClient.get('/secure')).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
