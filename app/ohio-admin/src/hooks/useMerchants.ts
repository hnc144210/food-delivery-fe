import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMerchants, getMerchantRequests, reviewMerchantRequest } from '@/services/merchantService'

export function useMerchants(pageIndex = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['merchants', pageIndex, pageSize],
    queryFn: () => getMerchants({ PageIndex: pageIndex, PageSize: pageSize }),
    staleTime: 30_000,
  })
}

export function useMerchantRequests(pageIndex = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['merchant-requests', pageIndex, pageSize],
    queryFn: () => getMerchantRequests({ PageIndex: pageIndex, PageSize: pageSize }),
    staleTime: 30_000,
  })
}

export function useReviewMerchantRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, body }: {
      requestId: string
      body: { verificationStatus: 'Approved' | 'Rejected'; rejectedReason?: string }
    }) => reviewMerchantRequest(requestId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['merchants'] })
      qc.invalidateQueries({ queryKey: ['merchant-requests'] })
    },
  })
}