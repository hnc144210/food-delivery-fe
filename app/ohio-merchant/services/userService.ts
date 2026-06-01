import { extractData, userApi } from '@/lib/api';
import type {
  CreateUserAddressRequest,
  MessageResponse,
  PageParams,
  PaginatedResponse,
  UpdateUserAddressRequest,
  UpdateUserProfileRequest,
  UserAddress,
  UserProfile,
} from '@/types/api';

export const userService = {
  async getUsers(params?: PageParams): Promise<PaginatedResponse<UserProfile>> {
    const response = await userApi.get('/api/Users', { params });
    return extractData<PaginatedResponse<UserProfile>>(response);
  },

  async getUser(id: string): Promise<UserProfile> {
    const response = await userApi.get(`/api/Users/${id}`);
    return extractData<UserProfile>(response);
  },

  async updateUser(id: string, body: UpdateUserProfileRequest): Promise<MessageResponse> {
    const response = await userApi.put(`/api/Users/${id}`, body);
    return extractData<MessageResponse>(response);
  },

  async deleteUser(id: string): Promise<MessageResponse> {
    const response = await userApi.delete(`/api/Users/${id}`);
    return extractData<MessageResponse>(response);
  },

  async getUserAddresses(id: string, params?: PageParams): Promise<PaginatedResponse<UserAddress>> {
    const response = await userApi.get(`/api/Users/${id}/addresses`, { params });
    return extractData<PaginatedResponse<UserAddress>>(response);
  },

  async getUserAddress(id: string, addressId: string): Promise<UserAddress> {
    const response = await userApi.get(`/api/Users/${id}/addresses/${addressId}`);
    return extractData<UserAddress>(response);
  },

  async createUserAddress(id: string, body: CreateUserAddressRequest): Promise<MessageResponse> {
    const response = await userApi.post(`/api/Users/${id}/addresses`, body);
    return extractData<MessageResponse>(response);
  },

  async updateUserAddress(
    id: string,
    addressId: string,
    body: UpdateUserAddressRequest
  ): Promise<MessageResponse> {
    const response = await userApi.put(`/api/Users/${id}/addresses/${addressId}`, body);
    return extractData<MessageResponse>(response);
  },

  async deleteUserAddress(id: string, addressId: string): Promise<MessageResponse> {
    const response = await userApi.delete(`/api/Users/${id}/addresses/${addressId}`);
    return extractData<MessageResponse>(response);
  },
};