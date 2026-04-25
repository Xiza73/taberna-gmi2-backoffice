export type CouponType = 'percentage' | 'fixed_amount';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  currentUses: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  type?: CouponType;
}

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  isActive?: boolean;
  startDate: string;
  endDate: string;
}

export interface UpdateCouponInput {
  code?: string;
  type?: CouponType;
  value?: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  maxUses?: number | null;
  maxUsesPerUser?: number | null;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}
