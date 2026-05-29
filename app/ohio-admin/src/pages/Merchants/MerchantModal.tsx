import type { Merchant } from '@/types'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { cn, MERCHANT_STATUS_COLOR } from '@/lib/utils'

interface Props { merchant: Merchant | null; onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void }

export default function MerchantModal({ merchant, onClose, onApprove, onReject }: Props) {
  if (!merchant) return null
  const isPending = merchant.status === 'PENDING'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-gray-800">Chi tiết nhà hàng</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          {merchant.license_url && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Giấy phép kinh doanh</p>
              <img src={merchant.license_url} alt="license" className="w-full h-40 object-cover rounded-lg border" />
            </div>
          )}
          {[['Tên', merchant.name], ['Địa chỉ', merchant.address], ['Đánh giá', String(merchant.rating)], ['Tổng đơn', String(merchant.total_orders)]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-gray-400">{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Trạng thái</span>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', MERCHANT_STATUS_COLOR[merchant.status])}>{merchant.status}</span>
          </div>
          {isPending && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => { onApprove(merchant.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
                <CheckCircle size={15} /> Duyệt
              </button>
              <button onClick={() => { onReject(merchant.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                <XCircle size={15} /> Từ chối
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}