import { ApiResponse } from "@/services/homeService";

export type UserProfileResponseDto = {
    Id: string,
    FullName: string | null,
    AvatarUrl: string | null,
    Status: string | null
}

export type UserProfileRequestDto = {
    FullName: string | null,
    AvatarUrl: string | null,
}

export type UserProfileResponse = ApiResponse<UserProfileResponseDto>;

