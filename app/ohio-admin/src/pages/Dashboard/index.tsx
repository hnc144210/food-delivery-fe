// src/pages/Dashboard/index.tsx
import { ShoppingBag, DollarSign, Users, Truck } from "lucide-react";
import StatsCard from "./StatsCard";
import RevenueChart from "./RevenueChart";
import TopMerchants from "./TopMerchants";
import TopProducts from "./TopProducts";
import { useAdminOverview } from "@/hooks/useReports";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: overview, isLoading } = useAdminOverview();
  const summary = overview?.summary ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Doanh thu hôm nay"
          value={
            isLoading ? "..." : formatCurrency(summary["totalRevenue"] ?? 0)
          }
          trend={12}
          icon={DollarSign}
          color="bg-[#E8441A]"
        />
        <StatsCard
          title="Tổng đơn hàng"
          value={isLoading ? "..." : String(summary["totalOrders"] ?? 0)}
          sub="7 ngày qua"
          trend={5}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatsCard
          title="Khách hàng mới"
          value={isLoading ? "..." : String(summary["totalUsers"] ?? 0)}
          sub="7 ngày qua"
          trend={-2}
          icon={Users}
          color="bg-purple-500"
        />
        <StatsCard
          title="Đang giao"
          value={isLoading ? "..." : String(summary["activeDeliveries"] ?? 0)}
          sub="đơn live"
          icon={Truck}
          color="bg-orange-500"
        />
      </div>

      <RevenueChart daily={overview?.daily ?? []} isLoading={isLoading} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopMerchants />
        <TopProducts />
      </div>
    </div>
  );
}
