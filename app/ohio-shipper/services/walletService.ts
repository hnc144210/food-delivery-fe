import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const walletsApi = axios.create({
  baseURL: 'http://192.168.48.47:8089',
  timeout: 20000,
});

walletsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

function extractData<T>(response: any): T {
  const d = response.data as any;
  const success = d.success ?? d.ok;
  if (!success || d.data === null || d.data === undefined) {
    throw new Error(d.errors?.[0] ?? d.message ?? 'Request failed');
  }
  return d.data as T;
}

export interface PageParams {
  PageIndex?: number;
  PageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: string;
  totalPages: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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