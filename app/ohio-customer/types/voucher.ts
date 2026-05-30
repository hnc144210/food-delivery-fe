import { ApiResponse } from "@/services/orderService";

export type VoucherAvailabilityStatus =
    | "active"
    | "upcoming"
    | "expired"
    | "inactive"
    | "deleted";

export type VoucherResponseDto = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    maxDiscount: number | null;
    minOrderAmount: number | null;
    discountTarget: "SUBTOTAL" | "DELIVERY_FEE";
    merchantId: string | null;
    usageLimit: number | null;
    perUserLimit: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    deletedAt: string | null;
    usedCount: number;
    remainingUsage: number | null;
    availability: VoucherAvailabilityStatus;
};

export type VoucherListResponseDto = {
    items: VoucherResponseDto[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type VoucherValidationResponseDto = {
    voucher: VoucherResponseDto;
    discountAmount: number;
    discountTarget: "SUBTOTAL" | "DELIVERY_FEE";
    appliedAmount: number;
    finalSubtotal: number;
    finalDeliveryFee: number;
    finalTotal: number;
};

export type VoucherActorContext = {
    userId: string;
    roles: string[];
    merchantId?: string;
};

export type VoucherListResponse = ApiResponse<VoucherListResponseDto>;
export type VoucherDetailResponse = ApiResponse<VoucherResponseDto>;
export type VoucherValidationResponse = ApiResponse<VoucherValidationResponseDto>;
