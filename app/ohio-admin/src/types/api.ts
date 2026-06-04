export interface ApiUser {
  id: string
  fullName: string
  avatarUrl: string
  phoneNumber: string
  status: string
  roles: string[] 
}
export interface AdminOverview {
  from: string
  to: string
  summary: Record<string, number>
  daily: Array<Record<string, unknown>>
}

export interface TopMerchantItem {
  merchantId: string
  merchantName: string
  totalRevenue?: number
  orderCount?: number
}

export interface TopMerchantsReport {
  from: string
  to: string
  items: TopMerchantItem[]
}

export interface ApiOrdersResponse {
  items: ApiOrder[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiUsersResponse {
  items: ApiUser[]
  paginationRequest: { pageSize: number; pageIndex: number }
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiMerchant {
  id: string
  userId: string
  storeName: string
  storeDescription: string
  storeLogoUrl: string
  storeBannerUrl: string
  businessLicense: string
  taxId: string
  isOpen: boolean
  openingTime: string | null
  closingTime: string | null
  minOrderAmount: string
  avgPrepTime: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
  createdAt: string
  updatedAt: string | null
}

export interface ApiMerchantRequest {
  id: string
  userId: string
  storeName: string
  storeDescription: string
  businessLicense: string
  businessLicenseUrl: string
  taxId: string
  verificationStatus: 'Pending' | 'Approved' | 'Rejected'
  rejectedReason: string
  createdAt: string
  verifiedAt: string | null
  reviewedBy: string | null
}

export interface ApiPagedResponse<T> {
  items: T[]
  paginationRequest: { pageSize: number; pageIndex: number }
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiOrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  note?: string
}

export interface ApiOrder {
  id: string
  orderNumber: string
  customerId: string
  merchantId: string
  merchantName?: string
  customerName?: string
  shipperId?: string
  items: ApiOrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  totalAmount: number
  status: string
  paymentStatus: string
  address: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface ApiOrdersResponse {
  items: ApiOrder[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiVoucher {
  id: string
  code: string
  name: string
  description: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  maxDiscount: number | null
  minOrderAmount: number
  discountTarget: string
  merchantId: string | null
  usageLimit: number
  perUserLimit: number
  usageCount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export interface ApiVouchersResponse {
  items: ApiVoucher[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateVoucherPayload {
  code: string
  name: string
  description: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  maxDiscount?: number
  minOrderAmount: number
  discountTarget: 'SUBTOTAL' | 'DELIVERY_FEE'
  merchantId?: string | null
  usageLimit: number
  perUserLimit: number
  startDate: string
  endDate: string
  isActive: boolean
}
export interface ApiShipper {
  id: string
  userId: string
  vehiclePlate: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
  createdAt: string
  updatedAt: string | null
}

export interface ApiShipperRequest {
  id: string
  userId: string
  licenseNumber: string
  licenseFrontUrl: string
  licenseBackUrl: string
  idFrontUrl: string
  idBackUrl: string
  selfieUrl: string
  idNumber: string
  fullName: string
  dateOfBirth: string
  status: 'Pending' | 'Approved' | 'Rejected'
  rejectedReason: string
  createdAt: string
  verifiedAt: string | null
  reviewedBy: string | null
}