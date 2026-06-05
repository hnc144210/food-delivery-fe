//src/pages/Promotions/index.tsx
import { useState } from "react";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import VoucherForm from "./VoucherForm";
import {
  useVouchers,
  useToggleVoucher,
  useDeleteVoucher,
} from "@/hooks/useVouchers";

export default function PromotionsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useVouchers();
  const { mutate: toggle } = useToggleVoucher();
  const { mutate: remove } = useDeleteVoucher();

  const vouchers = data?.items ?? [];

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
        {isLoading ? (
          <p className="text-sm text-gray-400">Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  {[
                    "Mã",
                    "Tên",
                    "Loại",
                    "Giá trị",
                    "Đơn tối thiểu",
                    "Đã dùng",
                    "Hiệu lực",
                    "Kích hoạt",
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
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-mono font-semibold text-gray-800">
                      {v.code}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 max-w-[120px] truncate">
                      {v.name}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {v.discountType}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {v.discountType === "PERCENTAGE"
                        ? `${v.discountValue}%`
                        : formatCurrency(v.discountValue)}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {formatCurrency(v.minOrderAmount)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#E8441A] rounded-full"
                            style={{
                              width: `${Math.min(100, (v.usageCount / v.usageLimit) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {v.usageCount}/{v.usageLimit}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-400 whitespace-nowrap">
                      {formatDateShort(v.startDate)} →{" "}
                      {formatDateShort(v.endDate)}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() =>
                          toggle({ id: v.id, isActive: !v.isActive })
                        }
                        className={cn(
                          "transition-colors",
                          v.isActive ? "text-[#E8441A]" : "text-gray-300",
                        )}
                      >
                        {v.isActive ? (
                          <ToggleRight size={24} />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          if (confirm(`Xóa voucher ${v.code}?`)) remove(v.id);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <VoucherForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
