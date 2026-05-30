import { ApiResponse } from "@/services/deliveryService";

export type ShipperAssignmentDto = {
    orderId: string;
    customerId: string;
    merchantId: string;
    orderNumber: string;
    shipperId: string;
    merchantName: string;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    deliveryFee: number;
    distanceKm: number;
    status: string;
    assignedAt: string;
    offerExpiresAt: string;
    acceptedAt: string;
    pickedUpAt: string | null;
    deliveredAt: string | null;
    respondedAt: string | null;
    rejectReason: string | null;
    cancelledReason: string | null;
    pickupProofFileKey: string | null;
    deliveryProofFileKey: string | null;
    id: string
}

export type ShipperListAssignmentDto = {
    items: ShipperAssignmentDto[];
    paginationRequest: {
        pageSize: number;
        pageIndex: number;
    } | null;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export type ShipperAssignmentResponse = ApiResponse<ShipperAssignmentDto>
export type ShipperListAssignmentResponse = ApiResponse<ShipperListAssignmentDto>   