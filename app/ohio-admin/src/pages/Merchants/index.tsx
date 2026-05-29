import { useState, useMemo } from 'react'
import { mockMerchants } from '@/mock'
import type { Merchant, MerchantStatus } from '@/types'
import { cn, MERCHANT_STATUS_COLOR } from '@/lib/utils'
import { Eye, Star } from 'lucide-react'
import MerchantModal from './MerchantModal'

const STATUS_TABS: { v: MerchantStatus | 'ALL'; label: string }[] = [
  { v: 'ALL', label: 'Tất cả' }, { v: 'PENDING', label: 'Chờ duyệt' }, { v: 'ACTIVE', label: 'Hoạt động' }, { v: 'SUSPENDED', label: 'Đã khóa' },
]

export default function MerchantsPage() {
  const [tab, setTab] = useState<MerchantStatus | 'ALL'>('ALL')
  const [merchants, setMerchants] = useState(mockMerchants)
  const [selected, setSelected] = useState<Merchant | null>(null)

  const filtered = useMemo(() => merchants.filter(m => tab === 'ALL' || m.status === tab), [merchants, tab])

  const approve = (id: string) => setMerchants(p => p.map(m => m.id === id ? { ...m, status: 'ACTIVE' } : m))
  const reject = (id: string) => setMerchants(p => p.map(m => m.id === id ? { ...m, status: 'SUSPENDED' } : m))

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', tab === t.v ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700')}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                {['Nhà hàng', 'Địa chỉ', 'Đánh giá', 'Tổng đơn', 'Trạng thái', ''].map(h => (
                  <th key={h} className="pb-3 font-medium pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A]">{m.name[0]}</div>
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 max-w-[160px] truncate">{m.address}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor" /><span className="text-gray-700">{m.rating}</span></div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{m.total_orders}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', MERCHANT_STATUS_COLOR[m.status])}>{m.status}</span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => setSelected(m)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MerchantModal merchant={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />
    </div>
  )
}