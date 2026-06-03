import { ApiResponse } from "@/services/orderService";

export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';


export type PaymentMethod = 'COD' | 'VNPAY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

export type SelectedOptionType = {
    name: string;
    value: string;
    price: number;
}

export type OrderItemType = {
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    unitPrice: number;
    selectedOptions: SelectedOptionType[];
    quantity: number;
    note: string | null;
    createdAt: string;
}

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
    items: OrderItemType[];
    statusHistory: Array<{
        id: string;
        status: OrderStatus;
        note: string | null;
        createdBy: string | null;
        createdAt: string;
    }>;
};

export type OrderDetailResponse = ApiResponse<OrderDetailResponseDto>;