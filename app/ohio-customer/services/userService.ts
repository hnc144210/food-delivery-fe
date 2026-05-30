import { UserProfileResponse, UpdateUserProfileRequestDto, MerchantProfileResponse } from "@/types/profile";
import api from "./api";
import { AddressDetailResponse, AddressListResponse, AddressRequestDto } from "@/types/address";

export type ApiResponse<T> = {
    statusCode: number;
    success: boolean;
    data: T;
    errors: string[];
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;

export const userService = {
    updateProfile: async (userId: string, data: UpdateUserProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/users/${userId}`, data);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getProfile: async (userId: string): Promise<UserProfileResponse['data']> => {
        const response = await api.get<UserProfileResponse>(`/users/${userId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getAddresses: async (userId: string): Promise<AddressListResponse['data']> => {
        const response = await api.get<AddressListResponse>(`/users/${userId}/addresses`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getAddressDetail: async (userId: string, addressId: string): Promise<AddressDetailResponse['data']> => {
        const response = await api.get<AddressDetailResponse>(`/users/${userId}/addresses/${addressId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    deleteAddress: async (userId: string, addressId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.delete<ApiConfirmationResponse>(`/users/${userId}/addresses/${addressId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    createAddress: async (userId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/users/${userId}/addresses`, address);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    updateAddress: async (userId: string, addressId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.put<ApiConfirmationResponse>(`/users/${userId}/addresses/${addressId}`, address);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getMerchantProfile: async (merchantId: string): Promise<MerchantProfileResponse['data']> => {
        const response = await api.get<MerchantProfileResponse>(`/merchants/${merchantId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
}