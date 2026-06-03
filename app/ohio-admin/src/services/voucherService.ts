import { ordersApi } from '@/lib/api'
import type { ApiVoucher, ApiVouchersResponse, CreateVoucherPayload } from '@/types/api'

export async function getVouchers(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<ApiVouchersResponse> {
  const { data } = await ordersApi.get('/api/orders/vouchers', { params })
  return data.data
}

export async function createVoucher(payload: CreateVoucherPayload): Promise<ApiVoucher> {
  const { data } = await ordersApi.post('/api/orders/vouchers', payload)
  return data.data
}

export async function toggleVoucherStatus(id: string, isActive: boolean): Promise<void> {
  await ordersApi.patch(`/api/orders/vouchers/${id}/status`, { isActive })
}

export async function deleteVoucher(id: string): Promise<void> {
  await ordersApi.delete(`/api/orders/vouchers/${id}`)
}