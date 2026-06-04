import { ApiResponse } from "@/services/authService";
export type AuthResponseDto = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    userId: string;
}
export type ForgetPasswordResponseDto = {
    message: string;
    expiresInSeconds: string;
}
export type VerifyOTPResponseDto = {
    message: string;
    resetToken: string;
}
export type ResetPasswordResponseDto = {
    message: string;
}
export type AuthResponse = ApiResponse<AuthResponseDto>;
export type ForgetPasswordResponse = ApiResponse<ForgetPasswordResponseDto>;
export type VerifyOTPResponse = ApiResponse<VerifyOTPResponseDto>;
export type ResetPasswordResponse = ApiResponse<ResetPasswordResponseDto>;