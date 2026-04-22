import { Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/Sidebar';

export function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
