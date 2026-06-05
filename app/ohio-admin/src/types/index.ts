//src/types/index.ts
export type UserStatus = 'ACTIVE' | 'LOCKED' | 'PENDING'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED'
export type MerchantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type VoucherType = 'PERCENT' | 'FIXED'
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
export type UserRole = 'Customer' | 'Merchant' | 'Shipper' | 'Admin'
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar_url?: string
  status: UserStatus
  created_at: string
}

export interface Merchant {
  id: string
  name: string
  address: string
  rating: number
  status: MerchantStatus
  license_url?: string
  cover_url?: string
  total_orders: number
  created_at: string
  owner_id: string
}

export interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer: Pick<User, 'id' | 'name' | 'phone'>
  merchant: Pick<Merchant, 'id' | 'name'>
  shipper?: Pick<User, 'id' | 'name' | 'phone'>
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  status: OrderStatus
  address: string
  note?: string
  created_at: string
  updated_at: string
}

export interface Voucher {
  id: string
  code: string
  type: VoucherType
  value: number
  min_order: number
  max_discount?: number
  usage_count: number
  usage_limit: number
  active: boolean
  start_date: string
  end_date: string
  created_at: string
}

export interface Withdrawal {
  id: string
  user: Pick<User, 'id' | 'name' | 'role'>
  amount: number
  bank_name: string
  account_number: string
  status: WithdrawalStatus
  created_at: string
}

export interface CommissionConfig {
  merchant_standard: number
  merchant_premium: number
  shipper_bronze: number
  shipper_silver: number
  shipper_gold: number
}

export interface DeliveryFeeConfig {
  base_fee: number
  per_km_fee: number
  free_km: number
}

export interface DailyRevenue {
  date: string
  revenue: number
  orders: number
}

export interface ApiUserMapped {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  created_at: string
}