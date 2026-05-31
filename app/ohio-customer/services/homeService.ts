import { ProductDetailResponse, ProductListResponse } from '@/types/product';
import api from './api';
import { AddressDetailResponse, AddressListResponse, AddressRequestDto } from '@/types/address';
import { CategoryDetailResponse, CategoryListResponse } from '@/types/category';
import { VoucherListResponse } from '@/types/voucher';

export type ApiResponse<T> = {
    ok: true;
    data: T;
    message: string;
};
export type ApiErrorResponse = {
    ok: false;
    message: string;
    errors?: Record<string, string[]>;
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;
export const homeService = {
    getCategories: async (): Promise<CategoryListResponse['data']> => {
        const response = await api.get<CategoryListResponse>('/catalog/categories');
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getCategoryDetail: async (id: string): Promise<CategoryDetailResponse['data']> => {
        const response = await api.get<CategoryDetailResponse>(`/catalog/categories/${id}`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

    getProducts: async (): Promise<ProductListResponse['data']> => {
        const response = await api.get<ProductListResponse>('/catalog/products');
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

    getProductDetail: async (id: string): Promise<ProductDetailResponse['data']> => {
        const response = await api.get<ProductDetailResponse>(`/catalog/products/${id}`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
};