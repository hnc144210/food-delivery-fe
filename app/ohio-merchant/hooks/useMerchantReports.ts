//hooks/useMerchantReports.ts
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import type { DateRangeParams } from '@/types/api';

const REPORT_STALE_TIME = 60 * 1000;

export function useMerchantOverview(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['merchant-reports', 'overview', params],
    queryFn: async () => {
      const data = await reportService.getMerchantOverview(params);
      console.log('OVERVIEW RESPONSE:', JSON.stringify(data, null, 2));
      return data;
    },
    staleTime: REPORT_STALE_TIME,
    retry: false,
  });
}
export function useMerchantTopProducts(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['merchant-reports', 'top-products', params],
    queryFn: async () => {
      const data = await reportService.getMerchantTopProducts(params);
      console.log('TOP PRODUCTS RESPONSE:', JSON.stringify(data, null, 2));
      return data;
    },
    staleTime: REPORT_STALE_TIME,
    retry: false,
  });
}