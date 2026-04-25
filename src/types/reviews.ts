export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListQuery {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  productId?: string;
  rating?: number;
}
