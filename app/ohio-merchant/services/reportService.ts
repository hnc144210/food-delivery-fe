//services/reportService.ts
import { reportsApi, extractData } from '@/lib/api';
import type { ApiResponse, DateRangeParams, ReportOverview, ReportTopProducts } from '@/types/api';

function unwrap<T>(raw: ApiResponse<T> | T): T {
  if (typeof raw === 'object' && raw !== null && 'success' in raw && 'data' in raw) {
    return extractData({ data: raw } as never);
  }

  return raw as T;
}

export const reportService = {
  async getMerchantOverview(params?: DateRangeParams): Promise<ReportOverview> {
    const res = await reportsApi.get('/api/reports/merchant/me/overview', { params });
    return extractData<ReportOverview>(res);
  },

  async getMerchantTopProducts(params?: DateRangeParams): Promise<ReportTopProducts> {
    const res = await reportsApi.get('/api/reports/merchant/me/top-products', { params });
    return extractData<ReportTopProducts>(res);
  },
};