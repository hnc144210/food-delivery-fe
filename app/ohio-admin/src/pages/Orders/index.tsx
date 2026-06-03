//src/pages/Orders/index.tsx
import { useState } from "react";
import {
  cn,
  formatCurrency,
  formatDate,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
} from "@/lib/utils";
import { Eye } from "lucide-react";
import OrderModal from "./OrderModal";
import { useOrders, useCancelOrder } from "@/hooks/useOrders";
import type { ApiOrder } from "@/types/api";

const STATUSES = [
  { v: "", label: "Tất cả" },
  { v: "PENDING", label: "Chờ" },
  { v: "DELIVERING", label: "Đang giao" },
  { v: "COMPLETED", label: "Hoàn thành" },
  { v: "CANCELLED", label: "Đã hủy" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState("");
  const [selected, setSelected] = useState<ApiOrder | null>(null);

  const { data, isLoading } = useOrders(1, 20, tab || undefined);
  const { mutate: cancel } = useCancelOrder();

  const orders = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.v}
            onClick={() => setTab(s.v)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              tab === s.v
                ? "bg-white shadow text-gray-800"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {isLoading ? (
          <p className="text-sm text-gray-400">Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  {[
                    "Mã đơn",
                    "Nhà hàng",
                    "Tổng",
                    "Trạng thái",
                    "Thời gian",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="pb-3 font-medium pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                      {o.orderNumber ?? o.id.slice(0, 8)}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {o.merchantName ?? o.merchantId}
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          ORDER_STATUS_COLOR[o.status] ??
                            "bg-gray-100 text-gray-600",
                        )}
                      >
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelected(o)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderModal
        order={selected}
        onClose={() => setSelected(null)}
        onCancel={(id) => cancel({ id, reason: "Admin cancelled" })}
      />
    </div>
  );
}
