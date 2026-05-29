import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Voucher } from "@/types";
import { X } from "lucide-react";

const schema = z.object({
  code: z.string().min(3),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().min(1),
  min_order: z.number().min(0),
  max_discount: z.number().optional(),
  usage_limit: z.number().min(1),
  start_date: z.string(),
  end_date: z.string(),
});
type F = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onAdd: (v: Voucher) => void;
}

export default function VoucherForm({ onClose, onAdd }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = (d: F) => {
    onAdd({
      id: `v${Date.now()}`,
      ...d,
      usage_count: 0,
      active: true,
      created_at: new Date().toISOString(),
    });
    onClose();
  };

  const inp =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Tạo voucher mới</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Mã voucher
            </label>
            <input {...register("code")} type="text" className={inp} />
            {errors.code && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.code.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại</label>
            <select {...register("type")} className={inp}>
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Cố định (VND)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Giá trị</label>
            <input
              {...register("value", { valueAsNumber: true })}
              type="number"
              className={inp}
            />
            {errors.value && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.value.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Đơn tối thiểu
            </label>
            <input
              {...register("min_order", { valueAsNumber: true })}
              type="number"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Giảm tối đa
            </label>
            <input
              {...register("max_discount", { valueAsNumber: true })}
              type="number"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Giới hạn dùng
            </label>
            <input
              {...register("usage_limit", { valueAsNumber: true })}
              type="number"
              className={inp}
            />
            {errors.usage_limit && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.usage_limit.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Từ ngày
              </label>
              <input {...register("start_date")} type="date" className={inp} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Đến ngày
              </label>
              <input {...register("end_date")} type="date" className={inp} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#E8441A] text-white rounded-lg text-sm font-medium hover:bg-[#d03a15]"
          >
            Tạo voucher
          </button>
        </form>
      </div>
    </div>
  );
}
