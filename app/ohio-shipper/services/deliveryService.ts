import { AssignmentAcceptRequestDto, AssignmentRejectRequestDto, ShipperListAssignmentResponse, ShipperOfferResponse, ToggleOnlineRequestDto, UpdateDeliveryStatusRequestDto } from "@/types/assignment";
import api from "./api";

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

export const deliveryService = {
    getAssignedDeliveries: async (shipperId: string): Promise<ShipperListAssignmentResponse['data']> => {
        const response = await api.get<ShipperListAssignmentResponse>(`/api/Deliveries/shippers/${shipperId}/assignments`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    acceptAssignment: async (assignmentId: string, request: AssignmentAcceptRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/accept`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    rejectAssignment: async (assignmentId: string, request: AssignmentRejectRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/reject`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getOffer: async (): Promise<ShipperOfferResponse['data']> => {
        const response = await api.get<ShipperOfferResponse>(`/api/Deliveries/shippers/me/active-offer`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    acceptOffer: async (request: AssignmentAcceptRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/accept`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    updateDeliveryStatus: async (assignmentId: string, request: UpdateDeliveryStatusRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/status`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    toggleOnline: async (shipperId: string, request: ToggleOnlineRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/availability/toggle?shipperId=${shipperId}`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
}   