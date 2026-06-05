import axios from 'axios';
import { ProductDetailResponse, ProductListResponse } from '@/types/product';
import api from './api';
import { AddressDetailResponse, AddressListResponse, AddressRequestDto } from '@/types/address';
import { CategoryDetailResponse, CategoryListResponse, CategoryTreeResponse } from '@/types/category';
import { VoucherListResponse } from '@/types/voucher';
import { ReviewListResponse, ReviewSummaryResponse, ReviewQueryDto, CreateReviewDto } from '@/types/review';

export type ApiResponse<T> = {
    ok: true;
    data: T;
    message: string;
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;

const handleApiError = (error: any, methodName: string) => {
    if (axios.isAxiosError(error)) {
        console.error(`[homeService.${methodName}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            message: error.message,
        });
        const backendMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message;
        throw new Error(backendMessage);
    }
    console.error(`[homeService.${methodName}] Unknown Error:`, error);
    throw error;
};

export const homeService = {
    getCategories: async (): Promise<CategoryListResponse['data']> => {
        try {
            const response = await api.get<CategoryListResponse>('/api/catalog/categories');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getCategories');
        }
    },
    getCategoryTree: async (): Promise<CategoryTreeResponse['data']> => {
        try {
            const response = await api.get<CategoryTreeResponse>('/api/catalog/categories/tree');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getCategoryTree');
        }
    },
    getCategoryDetail: async (id: string): Promise<CategoryDetailResponse['data']> => {
        try {
            const response = await api.get<CategoryDetailResponse>(`/api/catalog/categories/${id}`);
            const resData = response.data;
            console.log(`[homeService.getCategoryDetail] Response:`, resData);
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getCategoryDetail');
        }
    },

    getProducts: async (): Promise<ProductListResponse['data']> => {
        try {
            const response = await api.get<ProductListResponse>('/api/catalog/products');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProducts');
        }
    },

    getProductDetail: async (id: string): Promise<ProductDetailResponse['data']> => {
        try {
            const response = await api.get<ProductDetailResponse>(`/api/catalog/products/${id}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProductDetail');
        }
    },

    createReview: async (review: CreateReviewDto): Promise<ApiConfirmationResponse> => {
        try {
            const response = await api.post<ApiConfirmationResponse>(`/api/catalog/reviews`, review);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData;
        } catch (error) {
            throw handleApiError(error, 'createReview');
        }
    },

    getProductReviews: async (productId: string, query?: ReviewQueryDto): Promise<ReviewListResponse['data']> => {
        try {
            const response = await api.get<ReviewListResponse>(`/api/catalog/reviews/product/${productId}`, { params: query });
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProductReviews');
        }
    },

    getProductReviewSummary: async (productId: string): Promise<ReviewSummaryResponse['data']> => {
        try {
            const response = await api.get<ReviewSummaryResponse>(`/api/catalog/reviews/product/${productId}/summary`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProductReviewSummary');
        }
    },
    getMerchantReview: async (merchantId: string): Promise<ReviewListResponse['data']> => {
        try {
            const response = await api.get<ReviewListResponse>(`/api/catalog/reviews/merchant/${merchantId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getMerchantReview');
        }
    },
    getProductsWithSearch: async (): Promise<ProductListResponse['data']> => {
    try {
        const response = await api.get<ProductListResponse>('/api/catalog/products', {
            params: { limit: 100, status: 'ACTIVE' }
        });
        const resData = response.data;
        if (!resData.ok) throw new Error(resData.message);
        return resData.data;
    } catch (error) {
        throw handleApiError(error, 'getProductsWithSearch');
    }
},
};