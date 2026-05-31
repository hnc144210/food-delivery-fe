import { CartListResponse, CartRequestDto, CartUpdateItemRequestDto } from "@/types/cart";
import api from "./api";
import { VoucherListResponse } from "@/types/voucher";

export type ApiResponse<T> = {
    ok: true;
    data: T;
    message: string;
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;

export const orderService = {
    getCart: async (): Promise<CartListResponse['data']> => {
        const response = await api.get<CartListResponse>('/orders/cart');
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    clearCart: async (): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>('/orders/cart');
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getCartByMerchant: async (merchantId: string): Promise<CartListResponse['data']> => {
        const response = await api.get<CartListResponse>(`/orders/cart/merchant/${merchantId}`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    clearMerchantCart: async (merchantId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>(`/orders/cart/merchant/${merchantId}`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    addItemCart: async (cartItem: CartRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>('/orders/cart/items', cartItem);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    updateItemCart: async (cartItemId: string, cartItem: CartUpdateItemRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.patch<ApiConfirmationResponse>(`/orders/cart/items/${cartItemId}`, cartItem);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    removeItemCart: async (cartItemId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>(`/orders/cart/items/${cartItemId}`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getVouchers: async (): Promise<VoucherListResponse['data']> => {
        const response = await api.get<VoucherListResponse>('/orders/vouchers');
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
};