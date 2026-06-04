//services/orderService.ts
import { extractData, ordersApi } from "@/lib/api";
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
  const resData = res.data;
  if (!resData.ok) throw new Error(resData.message);
  const data = resData.data;
  return data.items ?? [];
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