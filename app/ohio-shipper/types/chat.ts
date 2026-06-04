import { ApiResponse } from "@/services/chatService"

export type ConversationResponseDto = {
    id: string,
    conversationType: string,
    orderId: string,
    deliveryId: string,
    customerId: string,
    merchantId: string,
    shipperId: string,
    lastMessageAt: string,
    lastMessagePreview: string,
    unreadCustomerCount: number,
    unreadMerchantCount: number,
    unreadShipperCount: number,
    archivedAt: string,
    createdAt: string,
    updatedAt: string,
}
export type MessageResponseDto = {
    id: string,
    conversationId: string,
    senderRole: string,
    senderId: string,
    content: string,
    messageType: string,
    status: string,
    readAt: string,
    createdAt: string,
    updatedAt: string,
}
export type MessageListResponseDto = {
    items: MessageResponseDto[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}
export type MessageSendRequestDto = {
    content: string,
    messageType: string,
}
export type ConversationResponse = ApiResponse<ConversationResponseDto>;
export type MessageListResponse = ApiResponse<MessageListResponseDto>;
export type MessageResponse = ApiResponse<MessageResponseDto>;
