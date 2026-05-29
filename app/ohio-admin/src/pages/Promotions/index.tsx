import { useState } from "react";
import { mockVouchers } from "@/mock";
import type { Voucher } from "@/types";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";
import VoucherForm from "./VoucherForm";

export default function PromotionsPage() {
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [showForm, setShowForm] = useState(false);

  const toggle = (id: string) =>
    setVouchers((p) =>
      p.map((v) => (v.id === id ? { ...v, active: !v.active } : v)),
    );
  const add = (v: Voucher) => setVouchers((p) => [v, ...p]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8441A] text-white rounded-lg text-sm font-medium hover:bg-[#d03a15]"
        >
          <Plus size={16} /> Tạo voucher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                {[
                  "Mã",
                  "Loại",
                  "Giá trị",
                  "Đơn tối thiểu",
                  "Đã dùng",
                  "Hiệu lực",
                  "Kích hoạt",
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
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono font-semibold text-gray-800">
                    {v.code}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    {v.type === "PERCENT"
                      ? `${v.value}%`
                      : formatCurrency(v.value)}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">
                    {formatCurrency(v.min_order)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E8441A] rounded-full"
                          style={{
                            width: `${Math.min(100, (v.usage_count / v.usage_limit) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {v.usage_count}/{v.usage_limit}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-400 whitespace-nowrap">
                    {formatDateShort(v.start_date)} →{" "}
                    {formatDateShort(v.end_date)}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggle(v.id)}
                      className={cn(
                        "transition-colors",
                        v.active ? "text-[#E8441A]" : "text-gray-300",
                      )}
                    >
                      {v.active ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <VoucherForm onClose={() => setShowForm(false)} onAdd={add} />
      )}
    </div>
  );
}
