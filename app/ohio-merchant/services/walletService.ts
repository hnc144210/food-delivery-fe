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

export interface TopupRequest {
  amount: number;
  bankCode?: string;
}

export interface TopupUrlResponse {
  paymentUrl: string;
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

  async createTopupUrl(body: TopupRequest): Promise<TopupUrlResponse> {
  const res = await walletsApi.post('/api/wallets/me/topup/vnpay/url', body);
  return extractData<TopupUrlResponse>(res);
},
};

