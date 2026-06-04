export type VoucherData = {
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

export type Category = {
  id: string;
  name: string;
  icon_url: string;
}

export type ProductCardData = {
  food: FoodItem;
  base_price: number;
  discount_price: number;
  prep_time: number;
  rating: number;
}

export type RestaurantCardData = {
  id: string;
  name: string;
  logo_url: string;
  banner_url: string;
  rating: number;
  opening_time: string;
  closing_time: string;
  distance: number;
  preparetime: number;
  description: string;
  popularproduct: ProductCardData[];
}
export interface AddressCardProps {
  id: string;
  addressLabel: string;
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  street: string;
  district: string;
  city: string;
  defaultAddress: boolean;
}
//Shared / Domain types

export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'SHIPPER' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  avatarFileKey: string;
  phoneNumber: string;
  status: string;
  roles: string[];
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  lat: number;
  lng: number;
  receiverName: string;
  phone: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'PICKING_UP'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Option {
  id: string;
  name: string;
  priceDiff: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: Option[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
  options?: OptionGroup[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedOptions: Option[];
  note?: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrder: number;
  maxDiscount: number;
  expiresAt: string;
}

export * from './review';
