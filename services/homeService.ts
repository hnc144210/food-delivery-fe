import { ProductDetailResponse, ProductListResponse } from '@/types/product';
import api from './api';
import { AddressDetailResponse, AddressListResponse, AddressRequestDto } from '@/types/address';
import { CategoryDetailResponse, CategoryListResponse } from '@/types/category';
import { VoucherListResponse } from '@/types/voucher';

export type ApiResponse<T> = {
    success: true;
    data: T;
    message: string;
};
export type ApiErrorResponse = {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
};
export type PaginatedData<T> = {
    items: T[];
    total: number;
    page: number;
    perPage: number;
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;
export const homeService = {
    getVouchers: async (): Promise<VoucherListResponse['data']> => {
        const response = await api.get<VoucherListResponse>('/orders/vouchers');
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getCategories: async (): Promise<CategoryListResponse['data']> => {
        const response = await api.get<CategoryListResponse>('/catalog/categories');
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getCategoryDetail: async (id: string): Promise<CategoryDetailResponse['data']> => {
        const response = await api.get<CategoryDetailResponse>(`/catalog/categories/${id}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

    getProducts: async (): Promise<ProductListResponse['data']> => {
        const response = await api.get<ProductListResponse>('/catalog/products');
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

    getProductDetail: async (id: string): Promise<ProductDetailResponse['data']> => {
        const response = await api.get<ProductDetailResponse>(`/catalog/products/${id}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

    getAddresses: async (userId: string): Promise<AddressListResponse['data']> => {
        const response = await api.get<AddressListResponse>(`/users/${userId}/addresses`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getAddressDetail: async (userId: string, addressId: string): Promise<AddressDetailResponse['data']> => {
        const response = await api.get<AddressDetailResponse>(`/users/${userId}/addresses/${addressId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    deleteAddress: async (userId: string, addressId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>(`/users/${userId}/addresses/${addressId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    createAddress: async (userId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/users/${userId}/addresses`, address);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    updateAddress: async (userId: string, addressId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/users/${userId}/addresses/${addressId}`, address);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
};