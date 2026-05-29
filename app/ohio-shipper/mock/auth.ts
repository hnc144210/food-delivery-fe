import type { User } from '@/types';

const mockShipperUser: User = {
  id: 'shipper-01',
  name: 'Tran Van B',
  email: 'shipper@ohio.com',
  phone: '0901234568',
  role: 'SHIPPER',
  avatar_url: '',
};

export const mockLoginResponse = {
  success: true as const,
  data: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockShipperUser,
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