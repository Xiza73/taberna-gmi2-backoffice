import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { authKeys, useAuth } from './useAuth';
import type { StaffMe } from '@/types/auth';

vi.mock('@/api/staffAuthApi', () => {
  return {
    staffAuthApi: {
      me: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    },
  };
});

import { staffAuthApi } from '@/api/staffAuthApi';

function buildClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function wrapperFor(qc: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

const mockMe: StaffMe = {
  id: 'staff-1',
  name: 'Lola',
  email: 'lola@example.com',
  role: 'admin',
  isActive: true,
  invitedBy: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useAuth', () => {
  it('reports authenticated when /me resolves', async () => {
    vi.mocked(staffAuthApi.me).mockResolvedValue(mockMe);
    const qc = buildClient();

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.me).toEqual(mockMe);
    expect(result.current.role).toBe('admin');
  });

  it('reports not authenticated when /me rejects', async () => {
    vi.mocked(staffAuthApi.me).mockRejectedValue(new Error('401'));
    const qc = buildClient();

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.me).toBeUndefined();
    expect(result.current.role).toBeNull();
  });

  it('login fetches /me and populates cache', async () => {
    vi.mocked(staffAuthApi.me)
      .mockRejectedValueOnce(new Error('401'))
      .mockResolvedValueOnce(mockMe);
    vi.mocked(staffAuthApi.login).mockResolvedValue({
      accessToken: 'A',
      refreshToken: 'R',
    });
    const qc = buildClient();

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      await result.current.login({
        email: 'lola@example.com',
        password: 'secret',
      });
    });

    await waitFor(() => {
      expect(qc.getQueryData(authKeys.me)).toEqual(mockMe);
    });
    // TanStack passes a context object as 2nd arg to mutationFn — assert only on payload.
    expect(staffAuthApi.login).toHaveBeenCalledTimes(1);
    expect(vi.mocked(staffAuthApi.login).mock.calls[0]![0]).toEqual({
      email: 'lola@example.com',
      password: 'secret',
    });
  });

  it('logout clears the query cache', async () => {
    vi.mocked(staffAuthApi.me).mockResolvedValue(mockMe);
    vi.mocked(staffAuthApi.logout).mockResolvedValue(undefined);
    const qc = buildClient();

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(qc.getQueryData(authKeys.me)).toBeUndefined();
  });

  it('login surfaces error to caller', async () => {
    vi.mocked(staffAuthApi.me).mockRejectedValue(new Error('401'));
    vi.mocked(staffAuthApi.login).mockRejectedValue(new Error('bad creds'));
    const qc = buildClient();

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => {
        await result.current.login({ email: 'x', password: 'y' });
      }),
    ).rejects.toThrow('bad creds');

    await waitFor(() => {
      expect(result.current.loginError).not.toBeNull();
    });
  });
});
