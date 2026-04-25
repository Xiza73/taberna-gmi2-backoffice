import type { BannerPosition } from '@/types/banners';

export const BANNER_POSITIONS: BannerPosition[] = ['hero', 'secondary', 'footer'];

export const positionLabels: Record<BannerPosition, string> = {
  hero: 'Hero (principal)',
  secondary: 'Secundario',
  footer: 'Footer',
};

export const positionBadgeClass: Record<BannerPosition, string> = {
  hero: 'bg-primary/10 text-primary',
  secondary: 'bg-cyan-500/10 text-cyan-400',
  footer: 'bg-muted text-muted-foreground',
};
