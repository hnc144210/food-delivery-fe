import api from "./api";
import axios from "axios";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  referenceId: string | null;
  referenceType: string;
};

type ApiResponse<T> = {
  statusCode: string | number;
  success: boolean;
  data: T | null;
  errors: string[];
};

type PaginatedData<T> = {
  items: T[];
  paginationRequest: { pageSize: string; pageIndex: string };
  totalCount: string;
  totalPages: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const handleApiError = (error: any, methodName: string) => {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.errors?.[0] || error.message;
    throw new Error(msg);
  }
  throw error;
};

export const notificationService = {
  getNotifications: async (params?: {
    PageSize?: number;
    PageIndex?: number;
  }): Promise<PaginatedData<AppNotification>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedData<AppNotification>>>(
        "/api/Notifications",
        { params }
      );
      const res = response.data;
      if (!res.success) throw new Error(res.errors?.[0]);
      return res.data!;
    } catch (error) {
      throw handleApiError(error, "getNotifications");
    }
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      const response = await api.patch<ApiResponse<{ message: string }>>(
        `/api/Notifications/${notificationId}/read`
      );
      if (!response.data.success) throw new Error(response.data.errors?.[0]);
    } catch (error) {
      throw handleApiError(error, "markAsRead");
    }
  },
};