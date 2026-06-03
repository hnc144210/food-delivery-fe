import { ApiResponse } from "@/services/userService";

export type AddressResponseDto = {
    Id: string;
    UserId: string;
    Label: string | null;
    RecipientName: string | null;
    Phone: string | null;
    AddressLine: string | null;
    Ward: string | null;
    District: string | null;
    City: string | null;
    Lat: number | null;
    Lng: number | null;
    IsDefault: boolean;
    CreatedAt: string;
};
export type AddressRequestDto = {
    Label: string | null;
    RecipientName: string | null;
    Phone: string | null;
    AddressLine: string | null;
    Ward: string | null;
    District: string | null;
    City: string | null;
    Lat: number | null;
    Lng: number | null;
    IsDefault: boolean;
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
