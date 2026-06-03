// app/ohio-admin/src/services/merchantService.ts   
import { usersApi } from '@/lib/api'
import type { ApiMerchant, ApiMerchantRequest, ApiPagedResponse } from '@/types/api'

export async function getMerchants(params?: {
  PageSize?: number
  PageIndex?: number
}): Promise<ApiPagedResponse<ApiMerchant>> {
  const { data } = await usersApi.get('/api/merchants', { params })
  return data.data
}

export async function getMerchantRequests(params?: {
  PageSize?: number
  PageIndex?: number
}): Promise<ApiPagedResponse<ApiMerchantRequest>> {
  const { data } = await usersApi.get('/api/merchants/requests', { params })
  return data.data
}

export async function reviewMerchantRequest(
  requestId: string,
  body: { verificationStatus: 'Approved' | 'Rejected'; rejectedReason?: string }
): Promise<void> {
  await usersApi.patch(`/api/merchants/requests/${requestId}/review`, body)
}