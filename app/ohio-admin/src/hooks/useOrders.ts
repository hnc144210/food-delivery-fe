import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrderById, cancelOrder } from '@/services/orderService'

export function useOrders(page = 1, limit = 20, status?: string) {
  return useQuery({
    queryKey: ['orders', page, limit, status],
    queryFn: () => getOrders({ page, limit, status }),
    staleTime: 30_000,
  })
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => getOrders({ page: 1, limit: 5 }),
    staleTime: 30_000,
  })
}

export function useOrderById(id: string | null) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelOrder(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}