import { ApiResponse } from '@/services/catalogService';

export interface CreateReviewDto {
  userId: string;
  orderId: string;
  merchantId?: string | null;
  productId?: string | null;
  shipperId?: string | null;
  rating: number;
  comment?: string | null;
  images?: string[] | null;
  merchantReply?: string | null;
  repliedAt?: string | null;
}

export interface UpdateReviewDto {
  userId?: string;
  orderId?: string;
  merchantId?: string | null;
  productId?: string | null;
  shipperId?: string | null;
  rating?: number;
  comment?: string | null;
  images?: string[] | null;
  merchantReply?: string | null;
  repliedAt?: string | null;
}

export interface ReviewQueryDto {
  productId?: string;
  userId?: string;
  orderId?: string;
  merchantId?: string;
  rating?: number;
  hasImages?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewReplyDto {
  merchantReply: string;
}

export interface ReviewResponseDto {
  id: string;
  userId: string;
  orderId: string;
  merchantId: string | null;
  productId: string | null;
  shipperId: string | null;
  rating: number;
  comment: string | null;
  images: string[] | null;
  merchantReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  deletedAt: string | null;
  product: {
    id: string;
    name: string;
  } | null;
}

export interface ReviewListResponseDto {
  items: ReviewResponseDto[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewSummaryDto {
  productId: string;
  averageRating: number;
  totalReviews: number;
  counts: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
}

export type ReviewListResponse = ApiResponse<ReviewListResponseDto>;
export type ReviewSummaryResponse = ApiResponse<ReviewSummaryDto>;
