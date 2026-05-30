import { ApiResponse } from "@/services/orderService";

export type CartSelectedValueDto = {
    valueId: string;
    name: string;
    additionalPrice: number;
};

export type CartSelectedOptionDto = {
    optionId: string;
    name: string;
    values: CartSelectedValueDto[];
};

export type CartItemResponseDto = {
    id: string;
    productId: string;
    merchantId: string;
    productName: string;
    productImage: string | null;
    note: string | null;
    quantity: number;
    baseUnitPrice: number;
    unitPrice: number;
    lineTotal: number;
    selectedOptions: CartSelectedOptionDto[];
    addedAt: string;
};

export type CartResponseDto = {
    userId: string;
    merchantId: string;
    items: CartItemResponseDto[];
    totalQuantity: number;
    subtotal: number;
    updatedAt: string;
};

export type CartListResponseDto = {
    items: CartResponseDto[];
    totalCount: number;
};

export type CartStoredItem = {
    id: string;
    productId: string;
    merchantId: string;
    productName: string;
    productImage: string | null;
    note: string | null;
    quantity: number;
    baseUnitPrice: number;
    unitPrice: number;
    lineTotal: number;
    selectedOptions: CartSelectedOptionDto[];
    signature: string;
    addedAt: string;
};

export type CartStoredRecord = {
    userId: string;
    merchantId: string;
    items: CartStoredItem[];
    updatedAt: string;
};

export type OptionValueRequestDto = {
    optionId: string;
    valueIds: string[];
};

export type CartRequestDto = {
    productId: string;
    quantity: number;
    note: string | null;
    selectedOptions: OptionValueRequestDto[];
};

export type CartUpdateItemRequestDto = {
    quantity: number;
    note: string | null;
    selectedOptions: OptionValueRequestDto[];
};
export type CartListResponse = ApiResponse<CartListResponseDto>;
export type CartResponse = ApiResponse<CartResponseDto>;