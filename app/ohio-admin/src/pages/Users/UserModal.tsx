import type { User } from '@/types'
import { formatDate } from '@/lib/utils'
import { X } from 'lucide-react'

interface Props { user: User | null; onClose: () => void }

const ROLE_LABEL: Record<string, string> = { CUSTOMER: 'Khách hàng', MERCHANT: 'Nhà hàng', SHIPPER: 'Tài xế', ADMIN: 'Admin' }

export default function UserModal({ user, onClose }: Props) {
  if (!user) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-gray-800">Chi tiết người dùng</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-[#E8441A]">
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-400">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>
          {[['Email', user.email], ['Số điện thoại', user.phone], ['Trạng thái', user.status], ['Ngày tạo', formatDate(user.created_at)]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-gray-400">{k}</span>
              <span className="text-gray-800 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}