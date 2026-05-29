import { useState, useMemo } from "react";
import { mockOrders } from "@/mock";
import type { Order, OrderStatus } from "@/types";
import {
  cn,
  formatCurrency,
  formatDate,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
} from "@/lib/utils";
import { Eye } from "lucide-react";
import OrderModal from "./OrderModal";

const STATUSES: Array<{ v: OrderStatus | "ALL"; label: string }> = [
  { v: "ALL", label: "Tất cả" },
  { v: "PENDING", label: "Chờ" },
  { v: "DELIVERING", label: "Đang giao" },
  { v: "COMPLETED", label: "Hoàn thành" },
  { v: "CANCELLED", label: "Đã hủy" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "ALL">("ALL");
  const [orders, setOrders] = useState(mockOrders);
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () => orders.filter((o) => tab === "ALL" || o.status === tab),
    [orders, tab],
  );

  const cancel = (id: string) =>
    setOrders((p) =>
      p.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o)),
    );

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                {[
                  "Mã đơn",
                  "Khách",
                  "Nhà hàng",
                  "Tài xế",
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
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                    {o.id}
                  </td>
                  <td className="py-3 pr-4 font-medium">{o.customer.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{o.merchant.name}</td>
                  <td className="py-3 pr-4 text-gray-500">
                    {o.shipper?.name ?? "—"}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        ORDER_STATUS_COLOR[o.status],
                      )}
                    >
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(o.created_at)}
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
      </div>

      <OrderModal
        order={selected}
        onClose={() => setSelected(null)}
        onCancel={cancel}
      />
    </div>
  );
}
