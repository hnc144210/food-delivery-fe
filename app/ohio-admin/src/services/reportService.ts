//src/services/reportService.ts
import { reportsApi } from '@/lib/api'
import type { AdminOverview, TopMerchantsReport } from '@/types/api'

export async function getAdminOverview(from: string, to: string): Promise<AdminOverview> {
  const { data } = await reportsApi.get('/api/reports/admin/overview', { params: { from, to } })
  return data.data
}

export async function getTopMerchants(from: string, to: string): Promise<TopMerchantsReport> {
  const { data } = await reportsApi.get('/api/reports/admin/top-merchants', { params: { from, to } })
  return data.data
}