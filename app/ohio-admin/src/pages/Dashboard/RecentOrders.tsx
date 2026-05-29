import { mockOrders } from '@/mock'
import { formatCurrency, formatDate, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Đơn hàng gần nhất</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">Mã đơn</th>
              <th className="pb-2 font-medium">Khách</th>
              <th className="pb-2 font-medium">Nhà hàng</th>
              <th className="pb-2 font-medium">Tổng</th>
              <th className="pb-2 font-medium">Trạng thái</th>
              <th className="pb-2 font-medium">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockOrders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="py-2.5 font-mono text-xs text-gray-600">{o.id}</td>
                <td className="py-2.5">{o.customer.name}</td>
                <td className="py-2.5 text-gray-500">{o.merchant.name}</td>
                <td className="py-2.5 font-medium">{formatCurrency(o.total)}</td>
                <td className="py-2.5">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', ORDER_STATUS_COLOR[o.status])}>
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td className="py-2.5 text-gray-400 text-xs">{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}