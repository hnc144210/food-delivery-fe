import { useQuery, useMutation } from '@tanstack/react-query';
import { walletService, type TopupRequest } from '@/services/walletService';
export function useMyWallet() {
  return useQuery({
    queryKey: ['wallet', 'me'],
    queryFn: () => walletService.getMyWallet(),
    staleTime: 60 * 1000,
  });
}

export function useMyTransactions(page = 1) {
  return useQuery({
    queryKey: ['wallet', 'transactions', page],
    queryFn: () => walletService.getMyTransactions({ PageIndex: page, PageSize: 20 }),
    staleTime: 30 * 1000,
  });
}

export function useCreateTopup() {
  return useMutation({
    mutationFn: (body: TopupRequest) => walletService.createTopupUrl(body),
  });
}