//services/merchantService.ts
import { userApi, extractData } from '@/lib/api';
import type {
  MessageResponse,
  PaginatedResponse,
  PageParams,
  MerchantAddress,
  CreateMerchantAddressRequest,
} from '@/types/api';

export interface Merchant {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string | null;
  storeLogoUrl: string | null;
  storeBannerUrl: string | null;
  isOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;
  minOrderAmount: string;
  avgPrepTime: string;
  status: string;
  storeLogoFileKey: string | null;
  storeBannerFileKey: string | null;
  taxId: string | null;
  businessLicense: string | null;
}

export interface UpdateMerchantRequest {
  storeName?: string | null;
  storeDescription?: string | null;
  storeLogoUrl?: string | null;
  storeBannerUrl?: string | null;
  isOpen?: boolean | null;
  openingTime?: string | null;
  closingTime?: string | null;
  minOrderAmount?: string;
  avgPrepTime?: string;
}

export const merchantService = {
  async getMerchantByUser(userId: string): Promise<Merchant> {
    const res = await userApi.get(`/api/users/${userId}/merchant`);
    return extractData<Merchant>(res);
    
  },

  async getMerchant(merchantId: string): Promise<Merchant> {
    const res = await userApi.get(`/api/merchants/${merchantId}`);
    return extractData<Merchant>(res);
  },

  async updateMerchant(merchantId: string, body: UpdateMerchantRequest): Promise<MessageResponse> {
    const res = await userApi.put(`/api/merchants/${merchantId}`, body);
    return extractData<MessageResponse>(res);
  },

  async getMerchantAddresses(merchantId: string, params?: PageParams): Promise<PaginatedResponse<MerchantAddress>> {
    const res = await userApi.get(`/api/merchants/${merchantId}/addresses`, { params });
    return extractData<PaginatedResponse<MerchantAddress>>(res);
  },

  async createMerchantAddress(merchantId: string, body: CreateMerchantAddressRequest): Promise<MessageResponse> {
  const res = await userApi.post(`/api/merchants/${merchantId}/addresses`, body);
  return extractData<MessageResponse>(res);
},

async updateMerchantAddress(merchantId: string, addressId: string, body: CreateMerchantAddressRequest): Promise<MessageResponse> {
  const res = await userApi.put(`/api/merchants/${merchantId}/addresses/${addressId}`, body);
  return extractData<MessageResponse>(res);
},

async deleteMerchantAddress(merchantId: string, addressId: string): Promise<MessageResponse> {
  const res = await userApi.delete(`/api/merchants/${merchantId}/addresses/${addressId}`);
  return extractData<MessageResponse>(res);
},
};