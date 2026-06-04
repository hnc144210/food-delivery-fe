import type { User } from '@/types';

export const mockCustomerUser: User = {
  id: '2',
  fullName: 'Test Customer',
  avatarFileKey: '',
  phoneNumber: '0901234567',
  status: 'Active',
  roles: ['Customer'],
};
export const mockShipperUser: User = {
  id: '1',
  fullName: 'Kimvux',
  avatarFileKey: '',
  phoneNumber: '0933818820',
  status: 'Active',
  roles: ['Shipper'],
};
export const mockMerchantUser: User = {
  id: '3',
  fullName: 'Test Merchant',
  avatarFileKey: '',
  phoneNumber: '0901234567',
  status: 'Active',
  roles: ['Merchant'],
};
