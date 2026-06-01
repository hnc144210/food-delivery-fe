import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, extractData } from '@/lib/api';
import type {
  AuthTokenResponse,
  ChangePasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  RegisterResponseData,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
} from '@/types/api';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

async function getDeviceId(): Promise<string> {
  let deviceId = await AsyncStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    await AsyncStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

export const authService = {
  async login(body: LoginRequest): Promise<AuthTokenResponse> {
  const deviceId = await getDeviceId();
  const response = await authApi.post('/api/Auth/login', body, {
    headers: {
      'X-Device-Id': deviceId,
      'X-Device-Name': 'Mobile App',
    },
  });
  const data = extractData<AuthTokenResponse>(response);

  await AsyncStorage.multiSet([
    ['access_token', data.accessToken],
    ['refresh_token', data.refreshToken],
  ]);

  return data;
},

  async register(body: RegisterRequest): Promise<RegisterResponseData> {
    const response = await authApi.post('/api/Auth/register', body);
    return extractData<RegisterResponseData>(response);
  },

  async verifyOtp(body: VerifyOtpRequest): Promise<MessageResponse> {
    const response = await authApi.post('/api/Auth/verify-otp', body);
    return extractData<MessageResponse>(response);
  },

  async resendOtp(body: ResendOtpRequest): Promise<ResendOtpResponse> {
    const response = await authApi.post('/api/Auth/resend-otp', body);
    return extractData<ResendOtpResponse>(response);
  },

  async logout(): Promise<MessageResponse> {
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    if (!refreshToken) {
      return { message: 'Logged out' };
    }

    const deviceId = await getDeviceId();
    const response = await authApi.post(
      '/api/Auth/logout',
      { refreshToken },
      { headers: { 'X-Device-Id': deviceId } }
    );
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);

    return extractData<MessageResponse>(response);
  },

  async changePassword(body: ChangePasswordRequest): Promise<MessageResponse> {
    const response = await authApi.post('/api/Auth/change-password', body);
    return extractData<MessageResponse>(response);
  },
};