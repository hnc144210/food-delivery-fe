import { ApiCartListResponse } from "@/types/cart";
import api from "./api";

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

export const cartService = {
    getCart: async (): Promise<ApiCartListResponse['data']> => {
        const response = await api.get<ApiCartListResponse>('/order/cart');
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },

}