import { mockMerchants } from '@/mock'
import { Star } from 'lucide-react'

export default function TopMerchants() {
  const top = [...mockMerchants].filter(m => m.status === 'ACTIVE').sort((a, b) => b.total_orders - a.total_orders).slice(0, 5)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top nhà hàng</h3>
      <div className="space-y-3">
        {top.map((m, i) => (
          <div key={m.id} className="flex items-center gap-3">
            <span className="w-5 text-xs font-bold text-gray-400 shrink-0">{i + 1}</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A] shrink-0">
              {m.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
              <p className="text-xs text-gray-400">{m.total_orders} đơn</p>
            </div>
            <div className="flex items-center gap-0.5 text-yellow-500 shrink-0">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-medium text-gray-600">{m.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}