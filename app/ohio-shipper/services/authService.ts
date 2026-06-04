import { AuthResponse, ForgetPasswordResponse, ResetPasswordResponse, VerifyOTPResponse } from "@/types/auth";
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
    },
    forgetPassword: async (email: string): Promise<ForgetPasswordResponse> => {
        const response = await api.post<ForgetPasswordResponse>(`/api/Auth/forgot-password`, {
            "email": email
        });
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0] || 'Forget password failed');
        }
        return resData;
    },
    verifyOTP: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
        const response = await api.post<VerifyOTPResponse>(`/api/Auth/verify-reset-otp`, {
            "email": email,
            "otp": otp
        });
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0] || 'Verify OTP failed');
        }
        return resData;
    },
    resendOTP: async (email: string): Promise<ForgetPasswordResponse> => {
        const response = await api.post<ForgetPasswordResponse>(`/api/Auth/resend-otp`, {
            "email": email
        });
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0] || 'Resend OTP failed');
        }
        return resData;
    },
    resetPassword: async (email: string, newPassword: string, confirmPassword: string, resetToken: string): Promise<ResetPasswordResponse> => {
        const response = await api.post<ResetPasswordResponse>(`/api/Auth/reset-password`, {
            "email": email,
            "newPassword": newPassword,
            "confirmPassword": confirmPassword,
            "resetToken": resetToken
        });
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0] || 'Reset password failed');
        }
        return resData;
    },
}   