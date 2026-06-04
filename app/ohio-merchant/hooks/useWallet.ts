import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/walletService';

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