import type { Order } from "@/types";
import { X } from "lucide-react";
import {
  cn,
  formatCurrency,
  formatDate,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
} from "@/lib/utils";

interface Props {
  order: Order | null;
  onClose: () => void;
  onCancel: (id: string) => void;
}

const TIMELINE: Array<Order["status"]> = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERING",
  "COMPLETED",
];

export default function OrderModal({ order, onClose, onCancel }: Props) {
  if (!order) return null;
  const idx = TIMELINE.indexOf(order.status as (typeof TIMELINE)[number]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800">#{order.id}</h2>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                ORDER_STATUS_COLOR[order.status],
              )}
            >
              {ORDER_STATUS_LABEL[order.status]}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-1">
            {TIMELINE.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full",
                  i <= idx && order.status !== "CANCELLED"
                    ? "bg-[#E8441A]"
                    : "bg-gray-200",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Khách hàng", order.customer.name],
              ["SĐT", order.customer.phone],
              ["Nhà hàng", order.merchant.name],
              ["Tài xế", order.shipper?.name ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-gray-400 text-xs">{k}</p>
                <p className="font-medium">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Địa chỉ</p>
            <p className="text-sm">{order.address}</p>
          </div>
          <div className="border-t pt-3 space-y-1">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>
                  {i.product_name} x{i.quantity}
                </span>
                <span>{formatCurrency(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-gray-400 pt-1">
              <span>Phí ship</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Tổng</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {formatDate(order.created_at)}
          </p>
          {!["COMPLETED", "CANCELLED"].includes(order.status) && (
            <button
              onClick={() => {
                onCancel(order.id);
                onClose();
              }}
              className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
