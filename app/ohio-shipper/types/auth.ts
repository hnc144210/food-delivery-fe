import { ApiResponse } from "@/services/authService";
export type AuthResponseDto = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    userId: string;
}

export type AuthResponse = ApiResponse<AuthResponseDto>;