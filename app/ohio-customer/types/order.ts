export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';


export type PaymentMethod = 'COD' | 'VNPAY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_TO_DELIVER' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' | 'DELIVERY_FAILED';

export type CheckoutPreviewItemDto = {
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    note: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    selectedOptions: Array<{
        optionId: string;
        name: string;
        values: Array<{
            valueId: string;
            name: string;
            additionalPrice: number;
        }>;
    }>;
};

export type CheckoutAddressDto = {
    id: string;
    addressLine: string;
    ward: string | null;
    district: string | null;
    city: string | null;
    lat: number;
    lng: number;
    recipientName: string | null;
    phone: string | null;
};

export type CheckoutMerchantAddressDto = {
    id: string;
    addressLine: string;
    ward: string | null;
    district: string | null;
    city: string | null;
    lat: number;
    lng: number;
};

export type AppliedVoucherPreviewDto = {
    id: string;
    code: string;
    name: string;
    discountTarget: "SUBTOTAL" | "DELIVERY_FEE";
    discountAmount: number;
};

export type CheckoutPreviewResponseDto = {
    userId: string;
    merchantId: string;
    paymentMethod: PaymentMethod | null;
    items: CheckoutPreviewItemDto[];
    userAddress: CheckoutAddressDto;
    merchantAddress: CheckoutMerchantAddressDto;
    subtotal: number;
    deliveryFee: number;
    voucherDiscount: number;
    total: number;
    distanceKm: number;
    estimatedTimeMinutes: number | null;
    deliveryFeeCurrency: string;
    isWithinDeliveryRadius: boolean | null;
    maxDeliveryDistanceKm: number | null;
    appliedVoucher: AppliedVoucherPreviewDto | null;
    itemCount: number;
};

export type CreateOrderResponseDto = {
    id: string;
    orderNumber: string;
    userId: string;
    merchantId: string;
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    voucherId: string | null;
    createdAt: string;
    items: CheckoutPreviewItemDto[];
};

export type OrderHistoryItemDto = {
    id: string;
    orderNumber: string;
    merchantId: string;
    merchantName: string;
    merchantAvatar: string | null;
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: OrderPaymentStatus;
    status: OrderStatus;
    createdAt: string;
    itemCount: number;
    previewItems: Array<{
        id: string;
        productId: string;
        productName: string;
        productImage: string | null;
        quantity: number;
    }>;
};

export type MyOrdersResponseDto = {
    items: OrderHistoryItemDto[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type OrderDetailResponseDto = {
    id: string;
    orderNumber: string;
    userId: string;
    merchantId: string;
    merchantName: string;
    merchantAvatar: string | null;
    deliveryAddress: string;
    deliveryWard: string | null;
    deliveryDistrict: string | null;
    deliveryCity: string | null;
    deliveryLat: number | null;
    deliveryLng: number | null;
    recipientName: string;
    recipientPhone: string;
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: OrderPaymentStatus;
    status: OrderStatus;
    cancelReason: string | null;
    cancelledBy: string | null;
    note: string | null;
    voucherId: string | null;
    createdAt: string;
    updatedAt: string;
    items: Array<{
        id: string;
        productId: string;
        productName: string;
        productImage: string | null;
        unitPrice: number;
        selectedOptions: unknown;
        quantity: number;
        note: string | null;
        createdAt: string;
    }>;
    statusHistory: Array<{
        id: string;
        status: OrderStatus;
        note: string | null;
        createdBy: string | null;
        createdAt: string;
    }>;
};