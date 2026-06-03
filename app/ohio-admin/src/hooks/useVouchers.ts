// src/hooks/useVouchers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVouchers, createVoucher, toggleVoucherStatus, deleteVoucher } from '@/services/voucherService'
import type { CreateVoucherPayload } from '@/types/api'

export function useVouchers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['vouchers', page, limit],
    queryFn: () => getVouchers({ page, limit }),
    staleTime: 30_000,
  })
}

export function useCreateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVoucherPayload) => createVoucher(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}

export function useToggleVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleVoucherStatus(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}

export function useDeleteVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}