import type { User } from '@/types';
import { mockCustomerUser } from './customer';

export const mockLoginResponse = {
  success: true as const,
  data: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockCustomerUser,
  },
  message: 'Đăng nhập thành công',
};

export const mockForgotPasswordResponse = {
  success: true as const,
  message: 'OTP đã được gửi',
};

export const mockVerifyOtpResponse = {
  success: true as const,
  message: 'Xác thực thành công',
};