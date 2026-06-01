export interface ApiResponse<T> {
  statusCode: string | number;
  success: boolean;
  data: T | null;
  errors: string[];
}

export interface MessageResponse {
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  paginationRequest: {
    pageSize: string;
    pageIndex: string;
  };
  totalCount: string;
  totalPages: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageParams {
  PageSize?: number;
  PageIndex?: number;
}

export type UserStatus = string;

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  phoneNumber: string;
  status: UserStatus;
}

export interface UpdateUserProfileRequest {
  fullName: string;
  avatarUrl: string;
  phoneNumber: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string | null;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  addressLine: string;
  ward: string | null;
  district: string | null;
  city: string | null;
  lat: string;
  lng: string;
}

export interface CreateUserAddressRequest {
  label: string | null;
  recipientName: string | null;
  phone: string | null;
  isDefault: boolean;
  addressLine: string;
  ward: string | null;
  district: string | null;
  city: string | null;
  lat: string;
  lng: string;
}

export type UpdateUserAddressRequest = CreateUserAddressRequest;

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponseData {
  userId: string;
  email: string;
  message: string;
  requiresOtpVerification: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
  expiresInSeconds: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

//reports

export interface DateRangeParams {
  from?: string;
  to?: string;
}

export interface ReportOverview {
  from: string;
  to: string;
  summary: Record<string, number>;
  daily: Record<string, unknown>[];
}

export interface ReportTopProduct {
  productId: string;
  productName: string;
  productImage: string;
  quantitySold: number;
  orderCount: number;
}

export interface ReportTopProducts {
  from: string;
  to: string;
  items: ReportTopProduct[];
}

//order

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string | null;
  selectedOptions?: {
    optionName: string;
    valueName: string;
    additionalPrice: number;
  }[];
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId?: string;
  customerName?: string;
  merchantId?: string;
  status: OrderStatus;
  items?: OrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  note?: string | null;
  cancelReason?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

//catalog-menu

export interface CatalogListParams {
  page?: number;
  limit?: number;
  search?: string;
  merchantId?: string;
  categoryId?: string;
  status?: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive: boolean;
}

export interface ProductOptionValue {
  id?: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
}

export interface ProductOption {
  id?: string;
  categoryId?: string | null;
  name: string;
  isRequired: boolean;
  maxSelections: number;
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  discountPrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  prepTime: number;
  options: ProductOption[];
}

export interface ProductPayload {
  merchantId: string;
  categoryId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  discountPrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  prepTime: number;
  options: ProductOption[];
}

export interface ProductAvailabilityPayload {
  isAvailable: boolean;
}