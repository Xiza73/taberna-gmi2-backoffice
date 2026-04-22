import { motion } from 'motion/react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Users,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  FolderTree,
  Truck,
  MessageSquare,
  UserCog,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Principal',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' }],
  },
  {
    title: 'Catálogo',
    items: [
      { id: 'products', label: 'Productos', icon: Package, path: '/products' },
      { id: 'categories', label: 'Categorías', icon: FolderTree, path: '/categories' },
    ],
  },
  {
    title: 'Ventas',
    items: [
      { id: 'orders', label: 'Pedidos', icon: ShoppingCart, path: '/orders' },
      { id: 'shipping', label: 'Envíos', icon: Truck, path: '/shipping' },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { id: 'users', label: 'Staff', icon: Users, path: '/users' },
      { id: 'customers', label: 'Clientes', icon: UserCog, path: '/customers' },
    ],
  },
  {
    title: 'Comunicación',
    items: [
      { id: 'reviews', label: 'Reseñas', icon: MessageSquare, path: '/reviews' },
    ],
  },
  {
    title: 'Sistema',
    items: [{ id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' }],
  },
];

const roleLabels: Record<'super_admin' | 'admin' | 'user', string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Operador',
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { me, logout, isLoggingOut } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-5 z-50 p-2.5 rounded-lg bg-sidebar border border-sidebar-border text-foreground shadow-lg transition-all duration-300 ${
          isOpen ? 'left-[17rem]' : 'left-4'
        }`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-[46] transition-transform duration-300 flex flex-col lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl tracking-tight">
              <span className="text-primary">E</span>
              <span className="text-foreground">Commerce</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Backoffice</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <h3 className="px-4 mb-2 text-xs uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isActive =
                      item.path === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(item.path);
                    const globalIndex = sectionIndex * 10 + itemIndex;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: globalIndex * 0.02 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-sidebar-accent text-foreground shadow-lg shadow-primary/10'
                              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                          }`}
                        >
                          <Icon size={18} className={isActive ? 'text-primary' : ''} />
                          <span className="text-sm">{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <span>{me ? getInitials(me.name) : '…'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{me?.name ?? 'Cargando…'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {me ? roleLabels[me.role] : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={16} />
              <span>{isLoggingOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
