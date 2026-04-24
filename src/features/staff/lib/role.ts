import type { StaffRole } from '@/types/staff';

export const STAFF_ROLES: StaffRole[] = ['super_admin', 'admin', 'user'];

export const roleLabels: Record<StaffRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Operador',
};

export const roleBadgeClass: Record<StaffRole, string> = {
  super_admin: 'bg-amber-500/10 text-amber-400',
  admin: 'bg-primary/10 text-primary',
  user: 'bg-muted text-muted-foreground',
};
