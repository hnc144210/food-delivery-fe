//src/pages/Settings/index.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  merchant_standard: z.number().min(0).max(100),
  merchant_premium: z.number().min(0).max(100),
  shipper_bronze: z.number().min(0).max(100),
  shipper_silver: z.number().min(0).max(100),
  shipper_gold: z.number().min(0).max(100),
  base_fee: z.number().min(0),
  per_km_fee: z.number().min(0),
  free_km: z.number().min(0),
});
type F = z.infer<typeof schema>;

const DEFAULTS: F = {
  merchant_standard: 15,
  merchant_premium: 10,
  shipper_bronze: 20,
  shipper_silver: 15,
  shipper_gold: 10,
  base_fee: 15000,
  per_km_fee: 3000,
  free_km: 2,
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<F>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  const onSubmit = (_d: F) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const inp =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]/30";

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{children}</div>
    </div>
  );

  const Field = ({ label, name }: { label: string; name: keyof F }) => (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <input
        {...register(name, { valueAsNumber: true })}
        type="number"
        className={inp}
      />
      {errors[name] && (
        <p className="text-xs text-red-500 mt-0.5">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <Section title="Hoa hồng nhà hàng (%)">
        <Field label="Standard (%)" name="merchant_standard" />
        <Field label="Premium (%)" name="merchant_premium" />
      </Section>
      <Section title="Hoa hồng tài xế (%)">
        <Field label="Bronze (%)" name="shipper_bronze" />
        <Field label="Silver (%)" name="shipper_silver" />
        <Field label="Gold (%)" name="shipper_gold" />
      </Section>
      <Section title="Phí giao hàng">
        <Field label="Phí cơ bản (VND)" name="base_fee" />
        <Field label="Phí / km (VND)" name="per_km_fee" />
        <Field label="Km miễn phí" name="free_km" />
      </Section>
      <button
        type="submit"
        className="px-6 py-2.5 bg-[#E8441A] text-white rounded-lg text-sm font-medium hover:bg-[#d03a15] transition-colors"
      >
        {saved ? "✓ Đã lưu" : "Lưu cài đặt"}
      </button>
    </form>
  );
}
