import type { CouponType } from '@/types/coupons';

export const COUPON_TYPES: CouponType[] = ['percentage', 'fixed_amount'];

export const couponTypeLabels: Record<CouponType, string> = {
  percentage: 'Porcentaje',
  fixed_amount: 'Monto fijo',
};

export const couponTypeBadgeClass: Record<CouponType, string> = {
  percentage: 'bg-primary/10 text-primary',
  fixed_amount: 'bg-amber-500/10 text-amber-400',
};
