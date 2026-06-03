import { MerchantProfileResponse, ShipperProfileResponse, ShipperUpdateProfileRequestDto, UpdateUserProfileRequestDto, UserProfileResponse } from "@/types/profile";
import api from "./api";

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
export const userService = {
    updateProfile: async (userId: string, data: UpdateUserProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {

        const response = await api.put<ApiConfirmationResponse>(`/api/Users/${userId}`, data);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;

    },
    getProfile: async (userId: string): Promise<UserProfileResponse['data']> => {
        const response = await api.get<UserProfileResponse>(`/api/Users/${userId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getShipperProfile: async (shipperId: string): Promise<ShipperProfileResponse['data']> => {
        const response = await api.get<ShipperProfileResponse>(`/api/shippers/${shipperId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getShipperByUserId: async (userId: string): Promise<ShipperProfileResponse['data']> => {
        const response = await api.get<ShipperProfileResponse>(`/api/shippers/by-user/${userId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    updateShipperProfile: async (shipperId: string, data: ShipperUpdateProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/api/shippers/${shipperId}`, data);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getMerchantProfile: async (merchantId: string): Promise<MerchantProfileResponse['data']> => {
        const response = await api.get<MerchantProfileResponse>(`/api/merchants/${merchantId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
}