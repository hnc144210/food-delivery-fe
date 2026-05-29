import { ApiPaginatedResponse, ApiResponse } from "@/services/homeService";

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
export type AddressListResponse = ApiPaginatedResponse<AddressResponseDto>;
export type AddressDetailResponse = ApiResponse<AddressResponseDto>;
