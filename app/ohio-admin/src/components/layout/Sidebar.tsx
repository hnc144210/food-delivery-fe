import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, Store, DollarSign, Tag, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Người dùng' },
  { to: '/orders', icon: ShoppingBag, label: 'Đơn hàng' },
  { to: '/merchants', icon: Store, label: 'Nhà hàng' },
  { to: '/finance', icon: DollarSign, label: 'Tài chính' },
  { to: '/promotions', icon: Tag, label: 'Khuyến mãi' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
]

interface Props { collapsed: boolean; onToggle: () => void }

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className={cn('flex flex-col h-screen bg-[#1a1a2e] text-white transition-all duration-300 relative', collapsed ? 'w-16' : 'w-60')}>
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        {!collapsed && <span className="font-bold text-lg text-[#E8441A]">OHIO Admin</span>}
        {collapsed && <span className="font-bold text-[#E8441A] mx-auto">O</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-[#E8441A] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}>
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#E8441A] flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <LogOut size={16} />
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>

      <button onClick={onToggle}
        className="absolute -right-3 top-20 bg-[#1a1a2e] border border-white/20 rounded-full p-1 text-white/70 hover:text-white">
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}