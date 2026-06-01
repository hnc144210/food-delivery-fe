import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import type { ApiResponse, AuthTokenResponse } from '@/types/api';

const AUTH_BASE_URL = 'http://192.168.48.47:8081';
const USER_BASE_URL = 'http://192.168.48.47:8082';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<AuthTokenResponse> | null = null;

export const authApi = axios.create({ baseURL: AUTH_BASE_URL, timeout: 20000 });
export const userApi = axios.create({ baseURL: USER_BASE_URL, timeout: 20000 });

const clients = [authApi, userApi];

clients.forEach((client) => {
  client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const originalRequest = error.config as RetryConfig | undefined;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          refreshPromise ??= refreshToken();
          const tokens = await refreshPromise;
          refreshPromise = null;

          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          refreshPromise = null;
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          router.replace('/(auth)/login');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(toApiError(error));
    }
  );
});

async function refreshToken(): Promise<AuthTokenResponse> {
  const refreshTokenValue = await AsyncStorage.getItem('refresh_token');

  if (!refreshTokenValue) {
    throw new Error('Phiên đăng nhập đã hết hạn');
  }

  const response = await authApi.post<ApiResponse<AuthTokenResponse>>('/api/Auth/refresh-token', {
    refreshToken: refreshTokenValue,
  });

  const data = extractData<AuthTokenResponse>(response);

  await AsyncStorage.multiSet([
    ['access_token', data.accessToken],
    ['refresh_token', data.refreshToken],
  ]);

  return data;
}

export function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!response.data.success || response.data.data === null) {
    throw new Error(response.data.errors[0] ?? 'Request failed');
  }

  return response.data.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Đã có lỗi xảy ra';
}

function toApiError(error: AxiosError<ApiResponse<unknown>>): Error {
  const message =
    error.response?.data?.errors?.[0] ??
    (error.response?.status && error.response.status >= 500
      ? 'Máy chủ đang lỗi. Vui lòng thử lại sau.'
      : 'Không thể kết nối máy chủ');

  return new Error(message);
}