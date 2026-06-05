// src/hooks/useReports.ts
import { useQuery } from '@tanstack/react-query'
import { getAdminOverview, getTopMerchants, getTopProducts } from '@/services/reportService'
import { subDays, formatISO, startOfDay, endOfDay } from 'date-fns'

function getLast7Days() {
  const to = formatISO(endOfDay(new Date()))
  const from = formatISO(startOfDay(subDays(new Date(), 6)))
  return { from, to }
}

export function useAdminOverview() {
  const { from, to } = getLast7Days()
  return useQuery({
    queryKey: ['reports', 'overview', from, to],
    queryFn: () => getAdminOverview(from, to),
    staleTime: 60_000,
  })
}

export function useTopMerchants() {
  const { from, to } = getLast7Days()
  return useQuery({
    queryKey: ['reports', 'top-merchants', from, to],
    queryFn: () => getTopMerchants(from, to),
    staleTime: 60_000,
  })
}

export function useTopProducts() {
  const { from, to } = getLast7Days()
  return useQuery({
    queryKey: ['reports', 'top-products', from, to],
    queryFn: () => getTopProducts(from, to),
    staleTime: 60_000,
  })
}