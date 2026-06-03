//src/mock/index.ts
import type { User, Merchant, Order, Voucher, DailyRevenue, Withdrawal } from '@/types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Nguyễn Văn An', email: 'an@gmail.com', phone: '0901234567', role: 'CUSTOMER', status: 'ACTIVE', created_at: '2024-11-01T08:00:00Z' },
  { id: 'u2', name: 'Trần Thị Bình', email: 'binh@gmail.com', phone: '0912345678', role: 'MERCHANT', status: 'ACTIVE', created_at: '2024-10-15T10:00:00Z' },
  { id: 'u3', name: 'Lê Văn Cường', email: 'cuong@gmail.com', phone: '0923456789', role: 'SHIPPER', status: 'ACTIVE', created_at: '2024-10-20T09:00:00Z' },
  { id: 'u4', name: 'Phạm Thị Dung', email: 'dung@gmail.com', phone: '0934567890', role: 'CUSTOMER', status: 'LOCKED', created_at: '2024-09-10T11:00:00Z' },
  { id: 'u5', name: 'Hoàng Văn Em', email: 'em@gmail.com', phone: '0945678901', role: 'SHIPPER', status: 'PENDING', created_at: '2024-11-10T14:00:00Z' },
  { id: 'u6', name: 'Vũ Thị Phương', email: 'phuong@gmail.com', phone: '0956789012', role: 'CUSTOMER', status: 'ACTIVE', created_at: '2024-11-12T08:30:00Z' },
]

export const mockMerchants: Merchant[] = [
  { id: 'm1', name: 'Phở Hà Nội', address: '123 Lê Lợi, Q1, HCM', rating: 4.8, status: 'ACTIVE', total_orders: 1240, owner_id: 'u2', created_at: '2024-09-01T08:00:00Z', license_url: 'https://placehold.co/400x300' },
  { id: 'm2', name: 'Bún Bò Huế Cô Ba', address: '456 Nguyễn Huệ, Q1, HCM', rating: 4.5, status: 'ACTIVE', total_orders: 890, owner_id: 'u2', created_at: '2024-09-15T08:00:00Z' },
  { id: 'm3', name: 'Cơm Tấm Sài Gòn', address: '789 Trần Hưng Đạo, Q5, HCM', rating: 4.2, status: 'PENDING', total_orders: 0, owner_id: 'u2', created_at: '2024-11-10T08:00:00Z', license_url: 'https://placehold.co/400x300' },
  { id: 'm4', name: 'Trà Sữa Tiên Hạc', address: '321 Đinh Tiên Hoàng, BT, HCM', rating: 4.6, status: 'ACTIVE', total_orders: 2100, owner_id: 'u2', created_at: '2024-08-01T08:00:00Z' },
  { id: 'm5', name: 'Pizza nhà làm', address: '654 Võ Văn Tần, Q3, HCM', rating: 3.9, status: 'SUSPENDED', total_orders: 312, owner_id: 'u2', created_at: '2024-07-01T08:00:00Z' },
]

export const mockOrders: Order[] = [
  { id: 'ORD001', customer: { id: 'u1', name: 'Nguyễn Văn An', phone: '0901234567' }, merchant: { id: 'm1', name: 'Phở Hà Nội' }, shipper: { id: 'u3', name: 'Lê Văn Cường', phone: '0923456789' }, items: [{ id: 'i1', product_name: 'Phở bò tái', quantity: 2, price: 65000 }], subtotal: 130000, delivery_fee: 15000, discount: 0, total: 145000, status: 'DELIVERING', address: '100 Nguyễn Trãi, Q5', created_at: '2024-11-12T10:00:00Z', updated_at: '2024-11-12T10:30:00Z' },
  { id: 'ORD002', customer: { id: 'u6', name: 'Vũ Thị Phương', phone: '0956789012' }, merchant: { id: 'm4', name: 'Trà Sữa Tiên Hạc' }, items: [{ id: 'i2', product_name: 'Trà sữa matcha L', quantity: 1, price: 55000 }], subtotal: 55000, delivery_fee: 15000, discount: 10000, total: 60000, status: 'COMPLETED', address: '200 CMT8, Q3', created_at: '2024-11-12T09:00:00Z', updated_at: '2024-11-12T09:45:00Z' },
  { id: 'ORD003', customer: { id: 'u1', name: 'Nguyễn Văn An', phone: '0901234567' }, merchant: { id: 'm2', name: 'Bún Bò Huế Cô Ba' }, items: [{ id: 'i3', product_name: 'Bún bò đặc biệt', quantity: 1, price: 70000 }], subtotal: 70000, delivery_fee: 20000, discount: 0, total: 90000, status: 'PENDING', address: '100 Nguyễn Trãi, Q5', created_at: '2024-11-12T11:00:00Z', updated_at: '2024-11-12T11:00:00Z' },
  { id: 'ORD004', customer: { id: 'u4', name: 'Phạm Thị Dung', phone: '0934567890' }, merchant: { id: 'm1', name: 'Phở Hà Nội' }, items: [{ id: 'i4', product_name: 'Phở gà', quantity: 3, price: 60000 }], subtotal: 180000, delivery_fee: 15000, discount: 50000, total: 145000, status: 'CANCELLED', address: '50 Đinh Bộ Lĩnh, BT', created_at: '2024-11-11T14:00:00Z', updated_at: '2024-11-11T14:10:00Z' },
]

export const mockDailyRevenue: DailyRevenue[] = [
  { date: '11/06', revenue: 4200000, orders: 38 },
  { date: '11/07', revenue: 5800000, orders: 52 },
  { date: '11/08', revenue: 3900000, orders: 34 },
  { date: '11/09', revenue: 6700000, orders: 61 },
  { date: '11/10', revenue: 7200000, orders: 67 },
  { date: '11/11', revenue: 5100000, orders: 46 },
  { date: '11/12', revenue: 8400000, orders: 78 },
]

export const mockVouchers: Voucher[] = [
  { id: 'v1', code: 'NEWUSER50', type: 'PERCENT', value: 50, min_order: 50000, max_discount: 30000, usage_count: 423, usage_limit: 1000, active: true, start_date: '2024-11-01T00:00:00Z', end_date: '2024-12-31T23:59:59Z', created_at: '2024-11-01T00:00:00Z' },
  { id: 'v2', code: 'FREESHIP', type: 'FIXED', value: 15000, min_order: 80000, usage_count: 201, usage_limit: 500, active: true, start_date: '2024-11-05T00:00:00Z', end_date: '2024-11-30T23:59:59Z', created_at: '2024-11-05T00:00:00Z' },
  { id: 'v3', code: 'WEEKEND30', type: 'PERCENT', value: 30, min_order: 100000, max_discount: 50000, usage_count: 500, usage_limit: 500, active: false, start_date: '2024-10-01T00:00:00Z', end_date: '2024-10-31T23:59:59Z', created_at: '2024-10-01T00:00:00Z' },
]

export const mockWithdrawals: Withdrawal[] = [
  { id: 'w1', user: { id: 'u3', name: 'Lê Văn Cường', role: 'SHIPPER' }, amount: 500000, bank_name: 'Vietcombank', account_number: '****7890', status: 'PENDING', created_at: '2024-11-12T08:00:00Z' },
  { id: 'w2', user: { id: 'u2', name: 'Trần Thị Bình', role: 'MERCHANT' }, amount: 2500000, bank_name: 'Techcombank', account_number: '****3456', status: 'PENDING', created_at: '2024-11-11T15:00:00Z' },
  { id: 'w3', user: { id: 'u3', name: 'Lê Văn Cường', role: 'SHIPPER' }, amount: 300000, bank_name: 'Vietcombank', account_number: '****7890', status: 'COMPLETED', created_at: '2024-11-10T09:00:00Z' },
]