import { extractData, ordersApi } from "@/services/api";
import type { Order, OrderStatus, PaginatedResponse } from "@/types/api";

export interface MerchantOrderListParams {
  status?: OrderStatus;
}

export interface UpdateMerchantOrderStatusRequest {
  status: OrderStatus;
  note?: string;
  cancelReason?: string;
}

export const orderService = {
  async getMerchantOrders(params?: MerchantOrderListParams): Promise<Order[]> {
    const res = await ordersApi.get("/api/orders/merchant/my", { params });
    const data = extractData<Order[] | PaginatedResponse<Order>>(res);

    return Array.isArray(data) ? data : data.items;
  },

  async getMerchantOrder(id: string): Promise<Order> {
    const res = await ordersApi.get(`/api/orders/merchant/my/${id}`);
    return extractData<Order>(res);
  },

  async updateMerchantOrderStatus(
    id: string,
    body: UpdateMerchantOrderStatusRequest,
  ) {
    const res = await ordersApi.patch(`/api/orders/merchant/my/${id}/status`, body);
    return extractData<{ message: string }>(res);
  },
};