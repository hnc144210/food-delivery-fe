import { AssignmentAcceptRequestDto, AssignmentRejectRequestDto, ShipperAssignmentDto, ShipperAssignmentResponse, ShipperAvailabilityResponse, ShipperListAssignmentResponse, ShipperOfferResponse, ToggleOnlineRequestDto, UpdateDeliveryStatusRequestDto, UpdateShipperLocationRequestDto } from "@/types/assignment";
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
        const response = await api.get<ShipperListAssignmentResponse>(`/api/Deliveries/shippers/${shipperId}/assignments?pageIndex=1&pageSize=100`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getAvailability: async (shipperId: string): Promise<ShipperAvailabilityResponse['data']> => {
        const response = await api.get<ShipperAvailabilityResponse>(`/api/Deliveries/shippers/${shipperId}/availability`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    updateShipperLocation: async (shipperId: string, request: UpdateShipperLocationRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.patch<ApiConfirmationResponse>(`/api/Deliveries/shippers/${shipperId}/location`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    getAssignmentById: async (assignmentId: string): Promise<ShipperAssignmentResponse['data']> => {
        const response = await api.get<ShipperAssignmentResponse>(`/api/Deliveries/assignments/${assignmentId}`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Accept assignment using path-based endpoint (preferred)
     */
    acceptAssignment: async (assignmentId: string): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/accept`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Reject assignment using path-based endpoint (preferred)
     */
    rejectAssignment: async (assignmentId: string, request: AssignmentRejectRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/reject`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Get active offer for current shipper
     */
    getOffer: async (): Promise<ShipperOfferResponse['data']> => {
        const response = await api.get<ShipperOfferResponse>(`/api/Deliveries/shippers/me/active-offer`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Legacy accept offer endpoint (kept for backward compatibility)
     */
    acceptOffer: async (request: AssignmentAcceptRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/accept`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Update delivery status
     */
    updateDeliveryStatus: async (assignmentId: string, request: UpdateDeliveryStatusRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/assignments/${assignmentId}/status`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
    /**
     * Toggle shipper online/offline status with location
     */
    toggleOnline: async (shipperId: string, request: ToggleOnlineRequestDto): Promise<ApiConfirmationResponse['data']> => {
        const response = await api.post<ApiConfirmationResponse>(`/api/Deliveries/availability/toggle?shipperId=${shipperId}`, request);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    },
}   
