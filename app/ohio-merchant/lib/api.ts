//lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import type { ApiResponse, AuthTokenResponse } from '@/types/api';

const BASE_URLS = {
  auth: 'http://192.168.48.47:8081',
  user: 'http://192.168.48.47:8082',
  delivery: 'http://192.168.48.47:8084',
  catalog: 'http://192.168.48.47:8085',
  orders: 'http://192.168.48.47:8086',
  files: 'http://192.168.48.47:8087',
  reports: 'http://192.168.48.47:8088',
  wallets: 'http://192.168.48.47:8089',
};

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<AuthTokenResponse> | null = null;

function createApi(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL, timeout: 20000 });

  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    console.log('REQUEST:', config.url, 'token:', token?.slice(-10));
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      console.log('RESPONSE ERROR:', error.response?.status, error.config?.url);
      const original = error.config as RetryConfig | undefined;

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        try {
          refreshPromise ??= refreshAccessToken();
          const tokens = await refreshPromise;
          refreshPromise = null;

          original.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return instance(original);
        } catch (refreshError) {
            console.log('REFRESH FAILED, redirecting to login', refreshError);
            refreshPromise = null;
            await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
            router.replace('/(auth)/login');
            return Promise.reject(refreshError);
          }
      }

      return Promise.reject(toApiError(error));
    }
  );

  return instance;
}

async function refreshAccessToken(): Promise<AuthTokenResponse> {
  const refreshTokenValue = await AsyncStorage.getItem('refresh_token');
  const deviceId = await AsyncStorage.getItem('device_id');
  
  console.log('REFRESH ATTEMPT, token:', refreshTokenValue?.slice(0, 10));
  if (!refreshTokenValue) throw new Error('Phiên đăng nhập đã hết hạn');

  const response = await axios.post<ApiResponse<AuthTokenResponse>>(
    `${BASE_URLS.auth}/api/Auth/refresh-token`,
    { refreshToken: refreshTokenValue },
    {
      headers: {
        'X-Device-Id': deviceId ?? 'unknown',
      },
    }
  );

  const data = response.data.data;
  if (!data) throw new Error(response.data.errors?.[0] ?? 'Refresh token failed');

  await AsyncStorage.multiSet([
    ['access_token', data.accessToken],
    ['refresh_token', data.refreshToken],
  ]);

  return data;
}

export function extractData<T>(response: AxiosResponse): T {
  const d = response.data as any;
  const success = d.success ?? d.ok;

  if (!success || d.data === null || d.data === undefined) {
    throw new Error(d.errors?.[0] ?? d.message ?? 'Request failed');
  }

  return d.data as T;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Đã có lỗi xảy ra';
}

function toApiError(error: AxiosError<any>): Error {
  const data = error.response?.data as any;
  const message =
    data?.errors?.[0] ??
    data?.message ??
    (error.response?.status && error.response.status >= 500
      ? 'Máy chủ đang lỗi. Vui lòng thử lại sau.'
      : 'Không thể kết nối máy chủ');

  return new Error(message);
}

export const authApi = createApi(BASE_URLS.auth);
export const userApi = createApi(BASE_URLS.user);
export const deliveryApi = createApi(BASE_URLS.delivery);
export const catalogApi = createApi(BASE_URLS.catalog);
export const ordersApi = createApi(BASE_URLS.orders);
export const filesApi = createApi(BASE_URLS.files);
export const reportsApi = createApi(BASE_URLS.reports);
export const walletsApi = createApi(BASE_URLS.wallets);
