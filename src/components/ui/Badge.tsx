import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'destructive' | 'default';
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  default: 'bg-muted text-muted-foreground border-border',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs border',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
