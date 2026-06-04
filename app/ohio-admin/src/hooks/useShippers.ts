import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getShippers, getShipperRequests, reviewShipperRequest } from '@/services/shipperService'

export function useShippers(pageIndex = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['shippers', pageIndex, pageSize],
    queryFn: () => getShippers({ PageIndex: pageIndex, PageSize: pageSize }),
    staleTime: 30_000,
  })
}

export function useShipperRequests(pageIndex = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['shipper-requests', pageIndex, pageSize],
    queryFn: () => getShipperRequests({ PageIndex: pageIndex, PageSize: pageSize }),
    staleTime: 30_000,
  })
}

export function useReviewShipperRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, body }: {
      requestId: string
      body: { verificationStatus: 'Approved' | 'Rejected'; rejectedReason?: string }
    }) => reviewShipperRequest(requestId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shippers'] })
      qc.invalidateQueries({ queryKey: ['shipper-requests'] })
    },
  })
}