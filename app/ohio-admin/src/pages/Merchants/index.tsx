// src/pages/Merchants/index.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import MerchantModal from "./MerchantModal";
import {
  useMerchants,
  useMerchantRequests,
  useReviewMerchantRequest,
} from "@/hooks/useMerchants";
import type { ApiMerchant, ApiMerchantRequest } from "@/types/api";

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Suspended: "bg-red-100 text-red-800",
};

const TABS = [
  { v: "merchants", label: "Nhà hàng" },
  { v: "requests", label: "Chờ duyệt" },
];

export default function MerchantsPage() {
  const [tab, setTab] = useState<"merchants" | "requests">("merchants");
  const [selected, setSelected] = useState<
    ApiMerchant | ApiMerchantRequest | null
  >(null);

  const { data: merchantsData, isLoading: loadingMerchants } = useMerchants();
  const { data: requestsData, isLoading: loadingRequests } =
    useMerchantRequests();
  const { mutate: review } = useReviewMerchantRequest();

  const merchants = merchantsData?.items ?? [];
  const requests = requestsData?.items ?? [];
  const isLoading = tab === "merchants" ? loadingMerchants : loadingRequests;

  const handleApprove = (id: string) =>
    review({ requestId: id, body: { verificationStatus: "Approved" } });

  const handleReject = (id: string) =>
    review({ requestId: id, body: { verificationStatus: "Rejected" } });

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v as typeof tab)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              tab === t.v
                ? "bg-white shadow text-gray-800"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
            {t.v === "requests" && requests.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-[#E8441A] text-white text-xs rounded-full">
                {requests.length}
              </span>
            )}
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
                  {tab === "merchants"
                    ? ["Nhà hàng", "Trạng thái", "Mở cửa", ""].map((h) => (
                        <th
                          key={h}
                          className="pb-3 font-medium pr-4 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))
                    : ["Nhà hàng", "Mã số thuế", "Trạng thái", ""].map((h) => (
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
                {tab === "merchants"
                  ? merchants.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A]">
                              {m.storeName?.[0]}
                            </div>
                            <span className="font-medium">{m.storeName}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              STATUS_COLOR[m.status] ??
                                "bg-gray-100 text-gray-600",
                            )}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {m.isOpen ? "🟢 Đang mở" : "🔴 Đóng"}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setSelected(m)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : requests.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A]">
                              {r.storeName?.[0]}
                            </div>
                            <span className="font-medium">{r.storeName}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">{r.taxId}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              STATUS_COLOR[r.verificationStatus] ??
                                "bg-gray-100 text-gray-600",
                            )}
                          >
                            {r.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setSelected(r)}
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

      <MerchantModal
        item={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
