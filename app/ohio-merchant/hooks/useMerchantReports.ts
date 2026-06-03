//hooks/useMerchantReports.ts
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import type { DateRangeParams } from '@/types/api';

const REPORT_STALE_TIME = 60 * 1000;

export function useMerchantOverview(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['merchant-reports', 'overview', params],
    queryFn: () => reportService.getMerchantOverview(params),
    staleTime: REPORT_STALE_TIME,
    retry: false,
  });
}
export function useMerchantTopProducts(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['merchant-reports', 'top-products', params],
    queryFn: () => reportService.getMerchantTopProducts(params),
    staleTime: REPORT_STALE_TIME,
    retry: false,
  });
}