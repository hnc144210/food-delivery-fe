import { AuthResponse } from "@/types/auth";
import api from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const authService = {
    refreshToken: async (): Promise<AuthResponse> => {
        const token = await AsyncStorage.getItem('refresh_token');
        if (!token) {
            throw new Error('No refresh token found');
        }
        const response = await api.post<AuthResponse>(`/api/Auth/refresh-token`, {
            refreshToken: token
        }, {
            headers: {
                'X-Device-Id': '1234567890',
            }
        });
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0] || 'Refresh token failed');
        }
        return resData;
    }
}   