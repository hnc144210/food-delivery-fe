import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WALLET_BASE_URL } from "../constants/config"; // thêm vào config

const walletApi = axios.create({ baseURL: WALLET_BASE_URL });

walletApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type WalletResponseDto = {
  id: string;
  ownerId: string;
  ownerType: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string | null;
};

const handleApiError = (error: any, methodName: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`[walletService.${methodName}] API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      responseData: error.response?.data,
      message: error.message,
    });
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message;
    throw new Error(backendMessage);
  }
  throw error;
};

export const walletService = {
  getMyWallet: async (): Promise<WalletResponseDto> => {
    console.log('walletApi baseURL:', walletApi.defaults.baseURL);
    try {
      const response = await walletApi.get<{
        success: boolean;
        data: WalletResponseDto;
        errors: string[];
      }>("/api/wallets/me");
      const resData = response.data;
      if (!resData.success) throw new Error(resData.errors?.[0]);
      return resData.data;
    } catch (error) {
      throw handleApiError(error, "getMyWallet");
    }
  },
};