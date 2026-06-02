import { ProvinceListResponse, WardListResponse } from "@/types/addressitem";
import api from "./api";
import axios from "axios";

export type ApiResponse<T> = {
    statusCode: number;
    success: boolean;
    data: T;
    errors: string[];
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;
const handleApiError = (error: any, methodName: string) => {
    if (axios.isAxiosError(error)) {
        console.error(`[addressService.${methodName}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            message: error.message,
        });
        const backendMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message;
        throw new Error(backendMessage);
    }
    console.error(`[addressService.${methodName}] Unknown Error:`, error);
    throw error;
};

export const addressService = {
    getProvinces: async (): Promise<ProvinceListResponse['data']> => {
        try {
            const response = await api.get<ProvinceListResponse>('/api/Addresses/provinces');
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors?.[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProvinces');
        }
    },
    getWards: async (provinceCode: string): Promise<WardListResponse['data']> => {
        try {
            const response = await api.get<WardListResponse>(`/api/Addresses/provinces/${provinceCode}/wards`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors?.[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getWards');
        }
    },
    searchProvinces: async (keyword: string): Promise<ProvinceListResponse['data']> => {
        try {
            const response = await api.get<ProvinceListResponse>(`/api/Addresses/provinces/search?key=${keyword}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors?.[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'searchProvinces');
        }
    },
    searchWards: async (keyword: string): Promise<WardListResponse['data']> => {
        try {
            const response = await api.get<WardListResponse>(`/api/Addresses/wards/search?key=${keyword}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors?.[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'searchWards');
        }
    },
}