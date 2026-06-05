import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import ShipperModal from "./ShipperModal";
import {
  useShippers,
  useShipperRequests,
  useReviewShipperRequest,
} from "@/hooks/useShippers";
import type { ApiShipper, ApiShipperRequest } from "@/types/api";

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Suspended: "bg-red-100 text-red-800",
};

const TABS = [
  { v: "shippers", label: "Tài xế" },
  { v: "requests", label: "Chờ duyệt" },
];

export default function ShippersPage() {
  const [tab, setTab] = useState<"shippers" | "requests">("shippers");
  const [selected, setSelected] = useState<
    ApiShipper | ApiShipperRequest | null
  >(null);

  const { data: shippersData, isLoading: loadingShippers } = useShippers();
  const { data: requestsData, isLoading: loadingRequests } =
    useShipperRequests();
  const { mutate: review } = useReviewShipperRequest();

  const shippers = shippersData?.items ?? [];
  const requests = requestsData?.items ?? [];
  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const isLoading = tab === "shippers" ? loadingShippers : loadingRequests;

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
            {t.v === "requests" && pendingRequests.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-[#E8441A] text-white text-xs rounded-full">
                {pendingRequests.length}
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
                  {tab === "shippers"
                    ? ["Tài xế", "Biển số", "Trạng thái", "Ngày tạo", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="pb-3 font-medium pr-4 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ),
                      )
                    : ["Họ tên", "CMND/CCCD", "Bằng lái", "Trạng thái", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="pb-3 font-medium pr-4 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ),
                      )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tab === "shippers"
                  ? shippers.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A]">
                            T
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-mono text-gray-600">
                          {s.vehiclePlate}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              STATUS_COLOR[s.status] ??
                                "bg-gray-100 text-gray-600",
                            )}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400 text-xs">
                          {formatDate(s.createdAt)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setSelected(s)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : pendingRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{r.fullName}</td>
                        <td className="py-3 pr-4 text-gray-500 font-mono text-xs">
                          {r.idNumber}
                        </td>
                        <td className="py-3 pr-4 text-gray-500 font-mono text-xs">
                          {r.licenseNumber}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              STATUS_COLOR[r.status] ??
                                "bg-gray-100 text-gray-600",
                            )}
                          >
                            {r.status}
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

      <ShipperModal
        item={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
