import { usersApi } from '@/lib/api'
import type { ApiUser, ApiUsersResponse } from '@/types/api'

export async function getUserById(id: string): Promise<ApiUser> {
  const { data } = await usersApi.get(`/api/Users/${id}`)
  return data.data
}

export async function getUsers(params?: {
  PageSize?: number
  PageIndex?: number
}): Promise<ApiUsersResponse> {
  const { data } = await usersApi.get('/api/Users', { params })
  return data.data
}

export async function deleteUser(id: string): Promise<void> {
  await usersApi.delete(`/api/Users/${id}`)
}