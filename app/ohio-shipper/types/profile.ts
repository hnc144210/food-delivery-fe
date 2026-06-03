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
    roles: string[];
}
export type ShipperProfileResponseDto = {
    id: string;
    userId: string;
    vehiclePlate: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
    createdAt: string;
    updatedAt: string | null;
}
export type ShipperUpdateProfileRequestDto = {
    vehiclePlate: string | null;
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
export type ShipperProfileResponse = ApiResponse<ShipperProfileResponseDto>;