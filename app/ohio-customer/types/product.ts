import { ApiResponse } from "@/services/catalogService";

export type ProductOptionValueResponseDto = {
    id: string;
    name: string;
    additionalPrice: number;
    isAvailable: boolean;
};

export type ProductOptionResponseDto = {
    id: string;
    categoryId: string | null;
    name: string;
    isRequired: boolean;
    maxSelections: number;
    createdAt: string;
    values: ProductOptionValueResponseDto[];
};

export type ProductResponseDto = {
    id: string;
    merchantId: string;
    categoryId: string | null;
    name: string;
    description: string | null;
    imageUrl: string | null;
    basePrice: number;
    discountPrice: number | null;
    isAvailable: boolean;
    isFeatured: boolean;
    prepTime: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    category: {
        id: string;
        name: string;
    } | null;
    reviewCount: number;
    averageRating: number | null;
    options: ProductOptionResponseDto[];
};

export type ProductListResponseDto = {
    items: ProductResponseDto[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type ProductDetailResponse = ApiResponse<ProductResponseDto>;
export type ProductListResponse = ApiResponse<ProductListResponseDto>;