import api from "./api";
import axios from "axios";

export type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data: T;
};

export type DeliveryAssignment = {
  id: string;
  orderId: string;
  shipperId: string;
  merchantName: string;
  pickupAddress: string;
  pickupLatitude: string;
  pickupLongitude: string;
  dropoffAddress: string;
  dropoffLatitude: string;
  dropoffLongitude: string;
  deliveryFee: string;
  distanceKm: string;
  status: "Created" | "Assigned" | "PickingUp" | "PickedUp" | "Delivering" | "Delivered" | "Failed";
  assignedAt: string;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
};

export type LocationPoint = {
  id: string;
  orderId: string;
  shipperId: string;
  latitude: string;
  longitude: string;
  recordedAt: string;
};

export type LocationHistoryResponse = {
  ok: boolean;
  message: string;
  data: {
    items: LocationPoint[];
    totalCount: string;
  };
};

export type AssignmentListResponse = {
  ok: boolean;
  message: string;
  data: {
    items: DeliveryAssignment[];
    totalCount: string;
  };
};

const handleApiError = (error: any, methodName: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`[deliveryService.${methodName}] API Error:`, {
      status: error.response?.status,
      responseData: error.response?.data,
    });
    const backendMessage =
      error.response?.data?.message || error.message;
    throw new Error(backendMessage);
  }
  throw error;
};

export const deliveryService = {
  getAssignmentByOrder: async (orderId: string): Promise<DeliveryAssignment | null> => {
    try {
      const response = await api.get<AssignmentListResponse>(
        `/api/Deliveries/assignments`,
        { params: { PageSize: 50, PageIndex: 0 } }
      );
      const resData = response.data;
      // filter client-side vì API không có filter by orderId
      const match = resData.data?.items?.find((a) => a.orderId === orderId);
      return match ?? null;
    } catch (error) {
      throw handleApiError(error, "getAssignmentByOrder");
    }
  },

   getLocationHistory: async (orderId: string): Promise<LocationPoint[]> => {
    try {
      const response = await api.get<LocationHistoryResponse>(
        `/api/Deliveries/orders/${orderId}/location-history`,
        { params: { PageSize: 1, PageIndex: 0 } }
      );
      return response.data?.data?.items ?? [];
    } catch (error: any) {
      // 403 = chưa có shipper, trả về mảng rỗng thay vì throw
      if (error?.response?.status === 403) return [];
      throw handleApiError(error, "getLocationHistory");
    }
  },
};