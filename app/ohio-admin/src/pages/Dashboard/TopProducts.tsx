// src/pages/Dashboard/TopProducts.tsx
import { ShoppingBag } from "lucide-react";
import { useTopProducts } from "@/hooks/useReports";

export default function TopProducts() {
  const { data, isLoading } = useTopProducts();
  const top = data?.items.slice(0, 5) ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top sản phẩm</h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Đang tải...</p>
      ) : (
        <div className="space-y-3">
          {top.map((p, i) => (
            <div key={p.productId} className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-gray-400 shrink-0">
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                {p.productImage ? (
                  <img
                    src={p.productImage}
                    alt={p.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ShoppingBag size={14} className="text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {p.productName}
                </p>
                <p className="text-xs text-gray-400">
                  {p.quantitySold ?? 0} đã bán
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {p.orderCount ?? 0} đơn
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
