import { ApiResponse } from "@/services/userService";

export type UpdateUserProfileRequestDto = {
    FullName: string;
    AvatarUrl: string;
}
export type UserProfileResponseDto = {
    Id: string;
    FullName: string;
    AvatarUrl: string;
    Status: string;
}
export type MerchantProfileResponseDto = {
    id: string;
    userId: string;
    storeName: string;
    storeDescription: string;
    storeLogoUrl: string;
    storeBannerUrl: string;
    businessLicense: string;
    taxId: string;
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
    minOrderAmount: number;
    avgPrepTime: number;
    status: string;
    createdAt: string;
    updatedAt: string | null;
}
export type UserProfileResponse = ApiResponse<UserProfileResponseDto>;
export type MerchantProfileResponse = ApiResponse<MerchantProfileResponseDto>;
