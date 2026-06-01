import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import type { ApiResponse, AuthTokenResponse } from '@/types/api';

const BASE_URLS = {
  auth: 'http://192.168.48.47:8081',
  user: 'http://192.168.48.47:8082',
  delivery: 'http://192.168.48.47:8084',
  catalog: 'http://192.168.48.47:8085',
  orders: 'http://192.168.48.47:8086',
  reports: 'http://192.168.48.47:8088',
  wallets: 'http://192.168.48.47:8089',
};

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<AuthTokenResponse> | null = null;

function createApi(baseURL: string) {
  const instance = axios.create({
    baseURL,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const original = error.config as RetryConfig | undefined;
      const statusCode = error.response?.status;

      if (statusCode === 401 && original && !original._retry) {
        original._retry = true;

        try {
          refreshPromise ??= refreshAccessToken();
          const tokens = await refreshPromise;
          refreshPromise = null;

          original.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return instance(original);
        } catch (refreshError) {
          refreshPromise = null;
          await clearTokens();
          router.replace('/(auth)/login');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(normalizeApiError(error));
    }
  );

  return instance;
}

async function refreshAccessToken(): Promise<AuthTokenResponse> {
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('Phiên đăng nhập đã hết hạn');

  const res = await axios.post<ApiResponse<AuthTokenResponse>>(
    `${BASE_URLS.auth}/api/Auth/refresh-token`,
    { refreshToken }
  );

  const tokens = res.data.data;
  if (!tokens) throw new Error(res.data.errors[0] ?? 'Refresh token failed');
  await AsyncStorage.multiSet([
    ['access_token', tokens.accessToken],
    ['refresh_token', tokens.refreshToken],
  ]);

  return tokens;
}

export async function clearTokens() {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
}

export function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const d = response.data as any;
  const success = d.success ?? d.ok;

  if (!success || d.data === null) {
    throw new Error(d.errors?.[0] ?? d.message ?? 'Request failed');
  }

  return d.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.errors?.[0] ?? error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Đã có lỗi xảy ra';
}

function normalizeApiError(error: AxiosError<ApiResponse<unknown>>) {
  console.log('API error response data:', JSON.stringify(error.response?.data));
  console.log('API error status:', error.response?.status);
  
  const message =
    error.response?.data?.errors?.[0] ??
    (error.response?.status && error.response.status >= 500
      ? 'Máy chủ đang lỗi. Vui lòng thử lại sau.'
      : error.message);

  return new Error(message);
}

export const authApi = createApi(BASE_URLS.auth);
export const userApi = createApi(BASE_URLS.user);
export const deliveryApi = createApi(BASE_URLS.delivery);
export const catalogApi = createApi(BASE_URLS.catalog);
export const ordersApi = createApi(BASE_URLS.orders);
export const reportsApi = createApi(BASE_URLS.reports);
export const walletsApi = createApi(BASE_URLS.wallets);

export default authApi;