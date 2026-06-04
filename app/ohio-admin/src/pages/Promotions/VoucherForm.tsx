//src/pages/Promotions/VoucherForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useCreateVoucher } from "@/hooks/useVouchers";

const schema = z.object({
  code: z.string().min(3),
  name: z.string().min(1),
  description: z.string(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(1),
  maxDiscount: z.number().optional(),
  minOrderAmount: z.number().min(0),
  discountTarget: z.enum(["SUBTOTAL", "DELIVERY_FEE"]),
  usageLimit: z.number().min(1),
  perUserLimit: z.number().min(1),
  startDate: z.string(),
  endDate: z.string(),
});
type F = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export default function VoucherForm({ onClose }: Props) {
  const { mutate: create, isPending } = useCreateVoucher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      discountTarget: "SUBTOTAL",
      perUserLimit: 1,
    },
  });

  const onSubmit = (d: F) => {
    create(
      {
        ...d,
        isActive: true,
        startDate: new Date(d.startDate).toISOString(),
        endDate: new Date(d.endDate).toISOString(),
      },
      { onSuccess: onClose },
    );
  };

  const inp =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="font-semibold">Tạo voucher mới</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
          {[
            { label: "Mã voucher", name: "code" as const, type: "text" },
            { label: "Tên", name: "name" as const, type: "text" },
            { label: "Mô tả", name: "description" as const, type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="text-xs text-gray-500 mb-1 block">
                {label}
              </label>
              <input {...register(name)} type={type} className={inp} />
              {errors[name] && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Loại giảm giá
            </label>
            <select {...register("discountType")} className={inp}>
              <option value="PERCENTAGE">Phần trăm (%)</option>
              <option value="FIXED">Cố định (VND)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Áp dụng cho
            </label>
            <select {...register("discountTarget")} className={inp}>
              <option value="SUBTOTAL">Tạm tính</option>
              <option value="DELIVERY_FEE">Phí ship</option>
            </select>
          </div>

          {[
            { label: "Giá trị", name: "discountValue" as const },
            { label: "Giảm tối đa (VND)", name: "maxDiscount" as const },
            { label: "Đơn tối thiểu", name: "minOrderAmount" as const },
            { label: "Giới hạn dùng", name: "usageLimit" as const },
            { label: "Giới hạn / người", name: "perUserLimit" as const },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="text-xs text-gray-500 mb-1 block">
                {label}
              </label>
              <input
                {...register(name, { valueAsNumber: true })}
                type="number"
                className={inp}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Từ ngày
              </label>
              <input {...register("startDate")} type="date" className={inp} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Đến ngày
              </label>
              <input {...register("endDate")} type="date" className={inp} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-[#E8441A] text-white rounded-lg text-sm font-medium hover:bg-[#d03a15] disabled:opacity-60"
          >
            {isPending ? "Đang tạo..." : "Tạo voucher"}
          </button>
        </form>
      </div>
    </div>
  );
}
