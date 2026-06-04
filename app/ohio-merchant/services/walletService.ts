import { walletsApi, extractData } from '@/lib/api';
import type { PaginatedResponse, PageParams } from '@/types/api';

export interface Wallet {
  id: string;
  ownerId: string;
  ownerType: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType: string | null;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export const walletService = {
  async getMyWallet(): Promise<Wallet> {
    const res = await walletsApi.get('/api/wallets/me');
    return extractData<Wallet>(res);
  },

  async getMyTransactions(params?: PageParams): Promise<PaginatedResponse<WalletTransaction>> {
    const res = await walletsApi.get('/api/wallets/me/transactions', { params });
    return extractData<PaginatedResponse<WalletTransaction>>(res);
  },
};