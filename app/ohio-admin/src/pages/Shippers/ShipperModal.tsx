import type { ApiShipper, ApiShipperRequest } from "@/types/api";
import { X, CheckCircle, XCircle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  item: ApiShipper | ApiShipperRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function isRequest(
  item: ApiShipper | ApiShipperRequest,
): item is ApiShipperRequest {
  return "licenseNumber" in item;
}

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ShipperModal({
  item,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!item) return null;
  const req = isRequest(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">
            {req ? "Yêu cầu đăng ký tài xế" : "Chi tiết tài xế"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {req ? (
            <>
              {[
                ["Họ tên", item.fullName],
                ["CMND/CCCD", item.idNumber],
                ["Số bằng lái", item.licenseNumber],
                ["Ngày sinh", formatDate(item.dateOfBirth)],
                ["Trạng thái", item.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-400">{k}</span>
                  <span
                    className={cn(
                      "font-medium",
                      k === "Trạng thái"
                        ? `px-2 py-0.5 rounded-full text-xs ${STATUS_COLOR[v ?? ""] ?? ""}`
                        : "",
                    )}
                  >
                    {v}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  ["Mặt trước CMND", item.idFrontUrl],
                  ["Mặt sau CMND", item.idBackUrl],
                  ["Mặt trước bằng lái", item.licenseFrontUrl],
                  ["Mặt sau bằng lái", item.licenseBackUrl],
                ].map(
                  ([label, url]) =>
                    url && (
                      <div key={label}>
                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                        <img
                          src={url}
                          alt={label}
                          className="w-full h-28 object-cover rounded-lg border"
                        />
                      </div>
                    ),
                )}
              </div>
              {item.status === "Pending" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onApprove(item.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                  >
                    <CheckCircle size={15} /> Duyệt
                  </button>
                  <button
                    onClick={() => {
                      onReject(item.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    <XCircle size={15} /> Từ chối
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {[
                ["Biển số xe", item.vehiclePlate],
                ["Trạng thái", item.status],
                ["Ngày tạo", formatDate(item.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-400">{k}</span>
                  <span
                    className={cn(
                      "font-medium",
                      k === "Trạng thái"
                        ? `px-2 py-0.5 rounded-full text-xs ${STATUS_COLOR[v ?? ""] ?? ""}`
                        : "",
                    )}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
