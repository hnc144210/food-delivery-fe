import { authApi } from '@/lib/api'

export interface LoginResponse {
  userId: string
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await authApi.post(
    '/api/Auth/login',
    { email, password },
    {
      headers: {
        'X-Device-Id': 'web-admin',
        'X-Device-Name': 'Admin Web',
      },
    }
  )
  return data.data
}