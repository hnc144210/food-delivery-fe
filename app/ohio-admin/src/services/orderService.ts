import { ordersApi } from '@/lib/api'
import type { ApiOrder, ApiOrdersResponse } from '@/types/api'

export async function getOrders(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ApiOrdersResponse> {
  const { data } = await ordersApi.get('/api/orders', { params })
  return data.data
}

export async function getOrderById(id: string): Promise<ApiOrder> {
  const { data } = await ordersApi.get(`/api/orders/${id}`)
  return data.data
}

export async function cancelOrder(id: string, cancelReason: string): Promise<void> {
  await ordersApi.patch(`/api/orders/${id}/cancel`, { cancelReason })
}