import { ApiResponse } from "@/services/addressService";

export type AdministrativeUnitResponseDto = {
    id: string;
    fullName: string | null;
    fullNameEn: string | null;
    shortName: string | null;
    shortNameEn: string | null;
    codeName: string | null;
    codeNameEn: string | null;
}
export type ProvinceResponseDto = {
    code: string;
    name: string;
    nameEn: string | null;
    fullName: string;
    fullNameEn: string | null;
    codeName: string | null;
    administrativeUnit: AdministrativeUnitResponseDto;
}
export type WardResponseDto = {
    code: string;
    name: string;
    nameEn: string | null;
    fullName: string | null;
    fullNameEn: string | null;
    codeName: string | null;
    provinceCode: string | null;
    provinceName: string | null;
    provinceFullName: string | null;
    administrativeUnit: AdministrativeUnitResponseDto;
}
export type ProvinceListResponseDto = {
    items: ProvinceResponseDto[];
    paginationRequest: {
        pageSize: number;
        pageIndex: number;
    } | null;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export type WardListResponseDto = {
    items: WardResponseDto[];
    paginationRequest: {
        pageSize: number;
        pageIndex: number;
    } | null;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export type ProvinceResponse = ApiResponse<ProvinceResponseDto>
export type WardResponse = ApiResponse<WardResponseDto>
export type ProvinceListResponse = ApiResponse<ProvinceListResponseDto>
export type WardListResponse = ApiResponse<WardListResponseDto>