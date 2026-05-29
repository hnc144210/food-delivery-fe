import type { User } from '@/types';

export const mockCustomerUser: User = {
  id: '2',
  name: 'Test Customer',
  phone: '0901234567',
  email: 'customer@test.com',
  role: 'CUSTOMER',
  avatar_url: 'https://wqtjigusdqbtcmdykboy.supabase.co/storage/v1/object/public/photos/aya.jpg',
};
export const mockShipperUser: User = {
  id: '1',
  name: 'Kimvux',
  phone: '0933818820',
  email: 'shipper@test.com',
  role: 'SHIPPER',
  avatar_url: 'https://wqtjigusdqbtcmdykboy.supabase.co/storage/v1/object/public/photos/aya.jpg',
};
export const mockMerchantUser: User = {
  id: '3',
  name: 'Test Merchant',
  phone: '0901234567',
  email: 'merchant@test.com',
  role: 'MERCHANT',
  avatar_url: 'https://wqtjigusdqbtcmdykboy.supabase.co/storage/v1/object/public/photos/aya.jpg',
};