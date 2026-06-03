//src/pages/Merchants/MerchantModal.tsx
import type { ApiMerchant, ApiMerchantRequest } from "@/types/api";
import { X, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  item: ApiMerchant | ApiMerchantRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function isRequest(
  item: ApiMerchant | ApiMerchantRequest,
): item is ApiMerchantRequest {
  return "verificationStatus" in item;
}

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function MerchantModal({
  item,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!item) return null;
  const req = isRequest(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-gray-800">
            {req ? "Yêu cầu đăng ký" : "Chi tiết nhà hàng"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {req && item.businessLicenseUrl && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Giấy phép kinh doanh</p>
              <img
                src={item.businessLicenseUrl}
                alt="license"
                className="w-full h-40 object-cover rounded-lg border"
              />
            </div>
          )}
          {[
            ["Tên", item.storeName],
            ["Mô tả", item.storeDescription],
            ["Mã số thuế", item.taxId],
            req
              ? ["Trạng thái", item.verificationStatus]
              : ["Trạng thái", (item as ApiMerchant).status],
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

          {req && item.verificationStatus === "Pending" && (
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
        </div>
      </div>
    </div>
  );
}
