import { useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { onAuthExpired } from '@/api/tokens';

export function RootLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();

  useEffect(() => {
    return onAuthExpired(() => {
      const currentHref = routerState.location.href;
      void navigate({
        to: '/login',
        search: { redirect: currentHref },
      });
    });
  }, [navigate, routerState.location.href]);

  return (
    <>
      <Outlet />
      <Toaster position="top-right" theme="dark" />
    </>
  );
}
