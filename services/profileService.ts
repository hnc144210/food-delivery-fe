import { UserProfileRequestDto, UserProfileResponse } from "@/types/profile";
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
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;
export type ConfirmationResponse = {
    message: string;
};

export const profileService = {
    getProfile: async (userId: string): Promise<UserProfileResponse['data']> => {
        const response = await api.get<UserProfileResponse>(`/users/${userId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    updateProfile: async (userId: string, profile: UserProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/users/${userId}`, profile);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    deleteProfile: async (userId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>(`/users/${userId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.message);
        }
        return resData.data;
    }
}