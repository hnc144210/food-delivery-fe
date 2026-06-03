import axios from "axios";
import * as FileSystem from 'expo-file-system/legacy';
import api from "./api";
import { PresignReadUrlResponse, PresignUrlResponse } from "@/types/file";

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
        console.error(`[fileService.${methodName}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            message: error.message,
        });
        const backendMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message;
        throw new Error(backendMessage);
    }
    console.error(`[fileService.${methodName}] Unknown Error:`, error);
    throw error;
};

export const fileService = {
    getUploadUrl: async (fileName: string, contentType: string): Promise<PresignUrlResponse['data']> => {
        try {
            const response = await api.get<PresignUrlResponse>(`/api/Files/get-upload-url`, {
                params: {
                    fileName,
                    contentType
                }
            });
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getUploadUrl');
        }
    },
    getReadUrl: async (fileKey: string): Promise<PresignReadUrlResponse['data']> => {
        try {
            const response = await api.get<PresignReadUrlResponse>(`/api/Files/get-read-url`, {
                params: {
                    fileKey
                }
            });
            const resData = response.data;
            if (!resData.success) {
                throw new Error(resData.errors[0]);
            }
            return resData.data;
        } catch (error) {
            throw handleApiError(error, 'getReadUrl');
        }
    },
    uploadFile: async (uploadUrl: string, localUri: string, contentType: string): Promise<FileSystem.FileSystemUploadResult> => {
        try {
            const result = await FileSystem.uploadAsync(uploadUrl, localUri, {
                httpMethod: 'PUT',
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                headers: {
                    'Content-Type': contentType
                }
            });
            if (result.status < 200 || result.status >= 300) {
                throw new Error(`Upload failed with status ${result.status}: ${result.body}`);
            }
            return result;
        } catch (error) {
            console.error('[fileService.uploadFile] Upload Error:', error);
            throw error;
        }
    }
}