import { ApiResponse } from "@/services/userService";

export type UpdateUserProfileRequestDto = {
    fullName: string;
    avatarUrl: string;
    phoneNumber: string;
}
export type UserProfileResponseDto = {
    id: string;
    fullName: string;
    avatarFileKey: string;
    phoneNumber: string;
    status: string;
    roles: string[]
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
export type ShipperProfileRequest = {
    dateOfBirth: string
    fullName: string
    idCardBackUrl: string
    idCardFrontUrl: string
    idNumber: string
    licenseBackUrl: string
    licenseFrontUrl: string
    licenseNumber: string
    selfieUrl: string
}
export type MerchantProfileRequest = {
    storeName: string;
    storeDescription: string;
    businessLicense: string;
    businessLicenseUrl: string;
    taxId: string;
}
export type UserProfileResponse = ApiResponse<UserProfileResponseDto>;
export type MerchantProfileResponse = ApiResponse<MerchantProfileResponseDto>;
