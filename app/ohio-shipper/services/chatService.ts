import { ConversationResponse, MessageListResponse, MessageListResponseDto, MessageResponse, MessageResponseDto, MessageSendRequestDto } from "@/types/chat";
import api from "./api";

export type ApiResponse<T> = {
    ok: true;
    data: T;
    message: string;
};
export type ConfirmationResponse = {
    message: string;
};
export type ApiConfirmationResponse = ApiResponse<ConfirmationResponse>;

export const chatService = {
    getConversation: async (orderId: string): Promise<ConversationResponse['data']> => {
        const response = await api.get<ConversationResponse>(`/api/chats/orders/${orderId}/ORDER_SHIPPER`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    getMessages: async (conversationId: string): Promise<MessageListResponse['data']> => {
        const response = await api.get<MessageListResponse>(`/api/chats/conversations/${conversationId}/messages`);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
    sendMessage: async (conversationId: string, data: MessageSendRequestDto): Promise<MessageResponse['data']> => {
        const response = await api.post<MessageResponse>(`/api/chats/conversations/${conversationId}/messages`, data);
        const resData = response.data;
        if (!resData.ok) {
            throw new Error(resData.message);
        }
        return resData.data;
    },
}