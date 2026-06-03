import { CartListResponse, CartRequestDto, CartUpdateItemRequestDto } from "@/types/cart";
import api from "./api";
import { VoucherListResponse } from "@/types/voucher";
import { MyOrderResponse, OrderDetailResponse } from "@/types/order";
import axios from "axios";

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
        console.error(`[orderService.${methodName}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            message: error.message,
        });
        const backendMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message;
        throw new Error(backendMessage);
    }
    console.error(`[orderService.${methodName}] Unknown Error:`, error);
    throw error;
};

export const orderService = {
    getCart: async (): Promise<CartListResponse['data']> => {
        try {
            const response = await api.get<CartListResponse>('/api/orders/cart');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getCart');
        }
    },
    clearCart: async (): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.delete<ApiConfirmationResponse>('/api/orders/cart');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'clearCart');
        }
    },
    getCartByMerchant: async (merchantId: string): Promise<CartListResponse['data']> => {
        try {
            const response = await api.get<CartListResponse>(`/api/orders/cart/merchant/${merchantId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getCartByMerchant');
        }
    },
    clearMerchantCart: async (merchantId: string): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.delete<ApiConfirmationResponse>(`/api/orders/cart/merchant/${merchantId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'clearMerchantCart');
        }
    },
    addItemCart: async (cartItem: CartRequestDto): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.post<ApiConfirmationResponse>('/api/orders/cart/items', cartItem);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'addItemCart');
        }
    },
    updateItemCart: async (cartItemId: string, cartItem: CartUpdateItemRequestDto): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.patch<ApiConfirmationResponse>(`/api/orders/cart/items/${cartItemId}`, cartItem);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'updateItemCart');
        }
    },
    removeItemCart: async (cartItemId: string): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.delete<ApiConfirmationResponse>(`/api/orders/cart/items/${cartItemId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'removeItemCart');
        }
    },
    removeCartByMerchant: async (merchantId: string): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.delete<ApiConfirmationResponse>(`/api/orders/cart/merchant/${merchantId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'removeCartByMerchant');
        }
    },
    getVouchers: async (): Promise<VoucherListResponse['data']> => {
        try {
            const response = await api.get<VoucherListResponse>('/api/orders/vouchers');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getVouchers');
        }
    },
    getMyOrderHistory: async (): Promise<MyOrderResponse['data']> => {
        try {
            const response = await api.get<MyOrderResponse>('/api/orders/my');
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getMyOrderHistory');
        }
    },
    getOrderDetail: async (orderId: string): Promise<OrderDetailResponse['data']> => {
        try {
            const response = await api.get<OrderDetailResponse>(`/api/orders/${orderId}`);
            const resData = response.data;
            if (!resData.ok) {
                throw new Error(resData.message);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getOrderDetail');
        }
    }
};