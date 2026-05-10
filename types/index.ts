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
    id: string;
    name: string;
    base_price: number;
    discount_price: number;
    image_url: string;
    prep_time: number;
    rating: number;
}

export type RestaurantCardData = {
    name: string;
    rating: number;
    distance: number;
    preparetime: number;
    popularproduct: ProductCardData[];
}
//Shared / Domain types

export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'SHIPPER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
}

export interface Address {
  id: string;
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