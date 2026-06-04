// app/ohio-merchant/app/(merchant)/(tabs)/analytics.tsx
import { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RevenueChart, {
  type RevenueData,
} from "@/components/features/analytics/RevenueChart";

import TopSelling, {
  type TopItem,
} from "@/components/features/analytics/TopSelling";
import { useMerchantStore } from "@/store/merchantStore";
import {
  useMerchantOverview,
  useMerchantTopProducts,
} from "@/hooks/useMerchantReports";
import { useToggleStoreOpen } from "@/hooks/useMerchantProfile";
import MerchantHeader from "@/components/common/MerchantHeader";

type Period = "today" | "week" | "month";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
];

const fmtRevenue = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : `${(n / 1_000).toFixed(0)}K`;

function getDateRange(period: Period) {
  const to = new Date();
  const from = new Date();

  if (period === "today") from.setHours(0, 0, 0, 0);
  if (period === "week") from.setDate(to.getDate() - 7);
  if (period === "month") from.setMonth(to.getMonth() - 1);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toChartData(daily: Record<string, unknown>[] = []): RevenueData[] {
  return daily.map((item, index) => ({
    label:
      typeof item.metricDate === "string"
        ? item.metricDate.slice(5, 10)
        : `#${index + 1}`,
    value: toNumber(item.netRevenue),
  }));
}

export default function AnalyticsScreen() {
  const { merchant } = useMerchantStore();
  const { isOpen, toggle } = useToggleStoreOpen();
  const [period, setPeriod] = useState<Period>("month");

  const range = useMemo(() => getDateRange(period), [period]);
  const overviewQuery = useMerchantOverview(range);
  const topProductsQuery = useMerchantTopProducts(range);

  const summary = overviewQuery.data?.summary ?? {};
  const chartData = toChartData(overviewQuery.data?.daily);
  const topItems: TopItem[] = (topProductsQuery.data?.items ?? []).map(
    (item: any) => ({
      id: item.productId,
      name: item.productName,
      category: "Sản phẩm",
      orders: item.orderCount,
      imageUrl: item.productImage,
    }),
  );

  const totalRevenue = toNumber(summary.netRevenue);
  const grossRevenue = toNumber(summary.grossRevenue);
  const totalOrders = toNumber(summary.orderCount);
  const paidOrders = toNumber(summary.paidOrderCount);
  const cancelledOrders = toNumber(summary.cancelledOrderCount);
  const commission = toNumber(summary.merchantCommissionTotal);
  const avgOrderValue = toNumber(summary.avgOrderValue);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <MerchantHeader />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Hiệu suất kinh doanh</Text>
        <Text style={styles.subtitle}>
          Doanh thu & đơn hàng theo thời gian thực
        </Text>

        <View style={styles.tabBar}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.tab, period === p.key && styles.tabActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  period === p.key && styles.tabTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={18} color={ORANGE} />
            <Text style={styles.statLabel}>DOANH THU THỰC</Text>
            <Text style={styles.statValue}>{fmtRevenue(totalRevenue)}đ</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={18} color={ORANGE} />
            <Text style={styles.statLabel}>DOANH THU GỘP</Text>
            <Text style={styles.statValue}>{fmtRevenue(grossRevenue)}đ</Text>
          </View>
        </View>

        {/* Order cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={18} color={ORANGE} />
            <Text style={styles.statLabel}>TỔNG ĐƠN</Text>
            <Text style={styles.statValue}>{totalOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#22c55e"
            />
            <Text style={styles.statLabel}>ĐÃ THANH TOÁN</Text>
            <Text style={styles.statValue}>{paidOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="close-circle-outline" size={18} color="#e53e3e" />
            <Text style={styles.statLabel}>ĐÃ HỦY</Text>
            <Text style={styles.statValue}>{cancelledOrders}</Text>
          </View>
        </View>

        {/* Commission + avg order */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="cut-outline" size={18} color={ORANGE} />
            <Text style={styles.statLabel}>HOA HỒNG</Text>
            <Text style={styles.statValue}>{fmtRevenue(commission)}đ</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="stats-chart-outline" size={18} color={ORANGE} />
            <Text style={styles.statLabel}>GIÁ TRỊ ĐƠN TB</Text>
            <Text style={styles.statValue}>{fmtRevenue(avgOrderValue)}đ</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Xu hướng doanh thu</Text>
        <RevenueChart
          data={chartData.length ? chartData : [{ label: "-", value: 0 }]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Món bán chạy</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <TopSelling items={topItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  shopName: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  shopSub: { fontSize: 12, color: "#AAA", marginTop: 2 },
  toggleWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleLabel: { fontSize: 13, fontWeight: "700" },
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 36 },
  title: { fontSize: 24, fontWeight: "800", color: "#1a1a1a", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 16 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: CREAM,
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabText: { fontSize: 12, color: "#999", fontWeight: "500" },
  tabTextActive: { color: "#1a1a1a", fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 14,
    padding: 14,
    gap: 2,
  },
  change: { fontSize: 12, color: "#22c55e", fontWeight: "600", marginTop: 4 },
  statLabel: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    marginTop: 2,
  },
  retentionCard: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  retentionLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  retentionValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  viewAll: { color: ORANGE, fontWeight: "600", fontSize: 13 },
});
