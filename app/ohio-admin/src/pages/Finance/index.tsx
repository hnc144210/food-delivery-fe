//src/pages/Finance/index.tsx
import { useState } from "react";
import { mockWithdrawals, mockDailyRevenue } from "@/mock";
import type { WithdrawalStatus } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

const STATUS_COLOR: Record<WithdrawalStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
};
const STATUS_LABEL: Record<WithdrawalStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  COMPLETED: "Hoàn thành",
};

export default function FinancePage() {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const totalRevenue = mockDailyRevenue.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = mockDailyRevenue.reduce((a, d) => a + d.orders, 0);
  const pending = withdrawals
    .filter((w) => w.status === "PENDING")
    .reduce((a, w) => a + w.amount, 0);

  const update = (id: string, status: WithdrawalStatus) =>
    setWithdrawals((p) => p.map((w) => (w.id === id ? { ...w, status } : w)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [
            "Tổng doanh thu (7 ngày)",
            formatCurrency(totalRevenue),
            "text-[#E8441A]",
          ],
          ["Tổng đơn hoàn thành", String(totalOrders), "text-blue-600"],
          ["Chờ thanh toán", formatCurrency(pending), "text-orange-500"],
        ].map(([t, v, c]) => (
          <div
            key={t}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <p className="text-sm text-gray-500">{t}</p>
            <p className={cn("text-2xl font-bold mt-1", c)}>{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Yêu cầu rút tiền
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                {[
                  "Người dùng",
                  "Vai trò",
                  "Số tiền",
                  "Ngân hàng",
                  "STK",
                  "Trạng thái",
                  "Ngày",
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
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">{w.user.name}</td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">
                    {w.user.role}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-800">
                    {formatCurrency(w.amount)}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{w.bank_name}</td>
                  <td className="py-3 pr-4 text-gray-500 font-mono text-xs">
                    {w.account_number}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        STATUS_COLOR[w.status],
                      )}
                    >
                      {STATUS_LABEL[w.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">
                    {formatDate(w.created_at)}
                  </td>
                  <td className="py-3">
                    {w.status === "PENDING" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => update(w.id, "COMPLETED")}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => update(w.id, "REJECTED")}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
