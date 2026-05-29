import { cn, formatDate, USER_STATUS_COLOR } from '@/lib/utils'
import type { User, UserStatus } from '@/types'
import { Lock, Unlock, Eye } from 'lucide-react'

interface Props {
  users: User[]
  onView: (u: User) => void
  onToggle: (u: User) => void
}

const ROLE_LABEL: Record<string, string> = { CUSTOMER: 'Khách hàng', MERCHANT: 'Nhà hàng', SHIPPER: 'Tài xế', ADMIN: 'Admin' }
const STATUS_LABEL: Record<UserStatus, string> = { ACTIVE: 'Hoạt động', LOCKED: 'Đã khóa', PENDING: 'Chờ duyệt' }

export default function UserTable({ users, onView, onToggle }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            {['Người dùng', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', ''].map(h => (
              <th key={h} className="pb-3 font-medium pr-4 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A] shrink-0">
                    {u.name[0]}
                  </div>
                  <span className="font-medium text-gray-800 whitespace-nowrap">{u.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-500">{u.email}</td>
              <td className="py-3 pr-4 text-gray-500">{u.phone}</td>
              <td className="py-3 pr-4">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{ROLE_LABEL[u.role]}</span>
              </td>
              <td className="py-3 pr-4">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', USER_STATUS_COLOR[u.status])}>
                  {STATUS_LABEL[u.status]}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(u.created_at)}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => onView(u)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Eye size={14} /></button>
                  <button onClick={() => onToggle(u)} className={cn('p-1.5 rounded-lg', u.status === 'LOCKED' ? 'hover:bg-green-50 text-green-600' : 'hover:bg-red-50 text-red-500')}>
                    {u.status === 'LOCKED' ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}