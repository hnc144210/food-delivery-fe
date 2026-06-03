import { usersApi } from '@/lib/api'
import type { ApiShipper, ApiShipperRequest, ApiPagedResponse } from '@/types/api'

export async function getShippers(params?: {
  PageSize?: number
  PageIndex?: number
}): Promise<ApiPagedResponse<ApiShipper>> {
  const { data } = await usersApi.get('/api/shippers', { params })
  return data.data
}

export async function getShipperRequests(params?: {
  PageSize?: number
  PageIndex?: number
}): Promise<ApiPagedResponse<ApiShipperRequest>> {
  const { data } = await usersApi.get('/api/shippers/requests', { params })
  return data.data
}

export async function reviewShipperRequest(
  requestId: string,
  body: { verificationStatus: 'Approved' | 'Rejected'; rejectedReason?: string }
): Promise<void> {
  await usersApi.patch(`/api/shippers/requests/${requestId}/review`, body)
}