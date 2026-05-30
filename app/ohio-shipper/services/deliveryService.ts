import { ShipperListAssignmentResponse } from "@/types/shipper";
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
        const response = await api.get<ShipperListAssignmentResponse>(`/shippers/${shipperId}/assignments`);
        const resData = response.data;
        if (!resData.success) {
            throw new Error(resData.errors[0]);
        }
        return resData.data;
    }
}   