//src/lib/api.ts
import axios from 'axios'
import type { AxiosError } from 'axios'
/*
const BASE_URLS = {
  auth: 'http://localhost:8081',
  files: 'http://localhost:8087',
  users: 'http://localhost:8082',
  orders: 'http://localhost:8086',
  deliveries: 'http://localhost:8084',
  reports: 'http://localhost:8088',
  wallets: 'http://localhost:8089',
}
  */
const BASE_URLS = {
  auth: '/auth-api',
  users: '/users-api',
  orders: '/orders-api',
  deliveries: '/deliveries-api',
  reports: '/reports-api',
  wallets: '/wallets-api',
  files: '/files-api',
}

function createInstance(baseURL: string) {
  const instance = axios.create({ baseURL })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as typeof error.config & { _retry?: boolean }
      if (error.response?.status === 401 && !original?._retry) {
        original._retry = true
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${BASE_URLS.auth}/api/Auth/refresh-token`, { refreshToken })
            const { accessToken, refreshToken: newRefresh } = data.data
            localStorage.setItem('access_token', accessToken)
            localStorage.setItem('refresh_token', newRefresh)
            original!.headers!['Authorization'] = `Bearer ${accessToken}`
            return instance(original!)
          } catch {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          }
        } else {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const authApi = createInstance(BASE_URLS.auth)
export const usersApi = createInstance(BASE_URLS.users)
export const ordersApi = createInstance(BASE_URLS.orders)
export const deliveriesApi = createInstance(BASE_URLS.deliveries)
export const reportsApi = createInstance(BASE_URLS.reports)
export const walletsApi = createInstance(BASE_URLS.wallets)