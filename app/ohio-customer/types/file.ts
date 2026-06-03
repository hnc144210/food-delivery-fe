import { ApiResponse } from "@/services/fileService";

export type PresignReadUrlResponseDto = {
    readUrl: string;
    fileKey: string;
    expiresInSeconds: number;
}
export type PresignUrlResponseDto = {
    uploadUrl: string;
    fileKey: string;
    contentType: string;
}
export type PresignReadUrlResponse = ApiResponse<PresignReadUrlResponseDto>
export type PresignUrlResponse = ApiResponse<PresignUrlResponseDto>