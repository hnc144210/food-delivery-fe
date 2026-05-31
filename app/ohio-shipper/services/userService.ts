import { ShipperProfileResponse, ShipperUpdateProfileRequestDto, UpdateUserProfileRequestDto, UserProfileResponse } from "@/types/profile";
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
    updateUserProfile: async (userId: string, data: UpdateUserProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/api/Users/${userId}`, data);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getUserProfile: async (userId: string): Promise<UserProfileResponse['data']> => {
        const response = await api.get<UserProfileResponse>(`/api/Users/${userId}`);
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
    getShipperProfile: async (shipperId: string): Promise<ShipperProfileResponse['data']> => {
        const response = await api.get<ShipperProfileResponse>(`/api/shippers/${shipperId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getShipperProfileByUserId: async (userId: string): Promise<ShipperProfileResponse['data']> => {
        const response = await api.get<ShipperProfileResponse>(`/api/users/${userId}/shipper`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    }
}