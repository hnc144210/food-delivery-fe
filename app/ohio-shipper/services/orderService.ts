import api from "./api";
import { OrderDetailResponse } from "@/types/order";
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