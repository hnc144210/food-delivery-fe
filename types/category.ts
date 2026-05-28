import { ApiPaginatedResponse, ApiResponse } from "@/services/homeService";

export type CategoryResponseDto = {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    deletedAt: string | null;
    parent: {
        id: string;
        name: string;
    } | null;
    children: Array<{
        id: string;
        name: string;
    }>;
    productCount: number;
};

export type CategoryTreeNodeDto = CategoryResponseDto & {
    children: CategoryTreeNodeDto[];
};

export type CategoryListResponseDto = {
    items: CategoryResponseDto[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type CategoryListResponse = ApiPaginatedResponse<CategoryResponseDto>;
export type CategoryDetailResponse = ApiResponse<CategoryResponseDto>;