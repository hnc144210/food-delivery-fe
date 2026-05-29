import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const BREADCRUMB: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Quản lý người dùng',
  '/orders': 'Quản lý đơn hàng',
  '/merchants': 'Quản lý nhà hàng',
  '/finance': 'Tài chính',
  '/promotions': 'Khuyến mãi',
  '/settings': 'Cài đặt',
}

export default function Header() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const title = BREADCRUMB[pathname] ?? 'OHIO Admin'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8441A] rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E8441A] flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0] ?? 'A'}
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.name ?? 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}