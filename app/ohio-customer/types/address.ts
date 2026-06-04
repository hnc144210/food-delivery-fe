import { ApiResponse } from "@/services/userService";

export type AddressResponseDto = {
    id: string;
    userId: string;
    label: string | null;
    recipientName: string | null;
    phone: string | null;
    addressLine: string | null;
    ward: string | null;
    district: string | null;
    city: string | null;
    lat: number | null;
    lng: number | null;
    isDefault: boolean;
    createdAt: string;
};
export type AddressRequestDto = {
    label: string | null;
    recipientName: string | null;
    phone: string | null;
    addressLine: string | null;
    ward: string | null;
    district: string | null;
    city: string | null;
    lat: number | null;
    lng: number | null;
    isDefault: boolean;
};
export type AddressListResponseDto = {
    items: AddressResponseDto[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};
export type AddressListResponse = ApiResponse<AddressListResponseDto>;
export type AddressDetailResponse = ApiResponse<AddressResponseDto>;
