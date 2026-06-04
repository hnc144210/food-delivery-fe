import { useQuery } from "@tanstack/react-query";
import { catalogApi, extractData } from "@/lib/api";
import type { ApiResponse, PaginatedResponse, Review } from "@/types/api";

export function useMerchantReviews(merchantId?: string) {
  return useQuery({
    queryKey: ["merchant-reviews", merchantId],
    queryFn: async () => {
      const res = await catalogApi.get(`/api/catalog/reviews/merchant/${merchantId}`);
      return extractData<PaginatedResponse<Review>>(res);
    },
    enabled: Boolean(merchantId),
    staleTime: 60 * 1000,
  });
}