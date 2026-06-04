import { UserProfileResponse, UpdateUserProfileRequestDto, MerchantProfileResponse, ShipperProfileRequest, MerchantProfileRequest } from "@/types/profile";
import api from "./api";
import { AddressDetailResponse, AddressListResponse, AddressRequestDto } from "@/types/address";
import axios from "axios";

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

const handleApiError = (error: any, methodName: string) => {
    if (axios.isAxiosError(error)) {
        console.error(`[userService.${methodName}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            message: error.message,
        });
        const backendMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message;
        throw new Error(backendMessage);
    }
    console.error(`[userService.${methodName}] Unknown Error:`, error);
    throw error;
};

export const userService = {
    updateProfile: async (userId: string, data: UpdateUserProfileRequestDto): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.put<ApiConfirmationResponse>(`/api/Users/${userId}`, data);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'updateProfile');
        }
    },
    getProfile: async (userId: string): Promise<UserProfileResponse['data']> => {
        try {
            const response = await api.get<UserProfileResponse>(`/api/Users/${userId}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getProfile');
        }
    },
    getAddresses: async (userId: string): Promise<AddressListResponse['data']> => {
        try {
            const response = await api.get<AddressListResponse>(`/api/Users/${userId}/addresses`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getAddresses');
        }
    },
    getAddressDetail: async (userId: string, addressId: string): Promise<AddressDetailResponse['data']> => {
        try {
            const response = await api.get<AddressDetailResponse>(`/api/Users/${userId}/addresses/${addressId}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getAddressDetail');
        }
    },
    deleteAddress: async (userId: string, addressId: string): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.delete<ApiConfirmationResponse>(`/api/Users/${userId}/addresses/${addressId}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'deleteAddress');
        }
    },
    createAddress: async (userId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.post<ApiConfirmationResponse>(`/api/Users/${userId}/addresses`, address);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'createAddress');
        }
    },
    updateAddress: async (userId: string, addressId: string, address: AddressRequestDto): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.put<ApiConfirmationResponse>(`/api/Users/${userId}/addresses/${addressId}`, address);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'updateAddress');
        }
    },
    getMerchantProfile: async (merchantId: string): Promise<MerchantProfileResponse['data']> => {
        try {
            const response = await api.get<MerchantProfileResponse>(`/api/merchants/${merchantId}`);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getMerchantProfile');
        }
    },
    registerForShipping: async (shipperProfile: ShipperProfileRequest): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.post<ApiConfirmationResponse>(`/api/shippers/requests`, shipperProfile);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'registerForShipping');
        }
    },
    registerForMerchant: async (merchantProfile: MerchantProfileRequest): Promise<ApiConfirmationResponse['data']> => {
        try {
            const response = await api.post<ApiConfirmationResponse>(`/api/merchants/requests`, merchantProfile);
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'registerForMerchant');
        }
    }
}