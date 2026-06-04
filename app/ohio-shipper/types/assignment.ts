import { ApiResponse } from "@/services/deliveryService";

export type ShipperAssignmentDto = {

    orderId: string,
    customerId: string,
    merchantId: string,
    orderNumber: string,
    shipperId: string,
    customerName: string,
    customerPhone: string,
    merchantName: string,
    pickupAddress: string,
    pickupLatitude: number,
    pickupLongitude: number,
    dropoffAddress: string,
    dropoffLatitude: number,
    dropoffLongitude: number,
    deliveryFee: number,
    distanceKm: number,
    status: 'Pending' | 'Offering' | 'Assigned' | 'PickingUp' | 'PickedUp' | 'Delivering' | 'Delivered' | 'Failed' | 'Completed' | string,
    assignedAt: string,
    offerExpiresAt: string,
    acceptedAt: string,
    pickedUpAt: string,
    deliveredAt: string,
    respondedAt: string,
    rejectReason: string | null,
    cancelledReason: string | null,
    pickupProofFileKey: string | null,
    deliveryProofFileKey: string | null,
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

export type AssignmentAcceptRequestDto = {
    assignmentId: string;
    isAccepted: boolean;
    offerId: string | null;
    rejectionReason: string | null;
}

export type AssignmentRejectRequestDto = {
    offerId: string | null;
    reason: string | null;
}

export type ShipperOfferDto = {
    hasActiveOffer: boolean;
    assignmentId: string | null;
    offerId: string | null;
    orderId: string | null;
    expiresAt: string | null;
}

export type UpdateDeliveryStatusRequestDto = {
    note: string | null;
    proofFileKey: string | null;
    status: 'Pending' | 'Assigned' | 'PickingUp' | 'PickedUp' | 'Delivering' | 'Delivered' | 'Failed' | "Completed";
}

export type ToggleOnlineRequestDto = {
    isGoOnline: boolean;
    lat: number;
    lng: number;
}

export type ShipperOfferResponse = ApiResponse<ShipperOfferDto>
export type ShipperAssignmentResponse = ApiResponse<ShipperAssignmentDto>
export type ShipperListAssignmentResponse = ApiResponse<ShipperListAssignmentDto>   