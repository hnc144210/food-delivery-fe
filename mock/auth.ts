import type { User } from '@/types';
import { mockCustomerUser } from './customer';
/*
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
*/

const mockMerchantUser: User = {
  id: 'merchant-01',
  name: 'Kinetic Kitchen',
  email: 'merchant@ohio.com',
  phone: '0901234567',
  role: 'MERCHANT',
  avatar_url: '',
};

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