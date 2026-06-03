//src/pages/Dashboard/TopMerchants.tsx
import { Star } from "lucide-react";
import { useTopMerchants } from "@/hooks/useReports";

export default function TopMerchants() {
  const { data, isLoading } = useTopMerchants();
  const top = data?.items.slice(0, 5) ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top nhà hàng</h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Đang tải...</p>
      ) : (
        <div className="space-y-3">
          {top.map((m, i) => (
            <div key={m.merchantId} className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-gray-400 shrink-0">
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A] shrink-0">
                {m.merchantName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {m.merchantName}
                </p>
                <p className="text-xs text-gray-400">{m.orderCount ?? 0} đơn</p>
              </div>
              <Star
                size={12}
                className="text-yellow-500 shrink-0"
                fill="currentColor"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
