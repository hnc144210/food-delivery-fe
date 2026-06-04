// app/ohio-merchant/app/(merchant)/(tabs)/orders.tsx
import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMerchantStore } from "@/store/merchantStore";
import MerchantOrderCard from "@/components/features/MerchantOrderCard";

import {
  useMerchantOrders,
  useUpdateMerchantOrderStatus,
} from "@/hooks/useMerchantOrders";
import type { Order, OrderStatus } from "@/types/api";
import type { MerchantOrder, MerchantOrderStatus } from "@/mock/merchant";
import { useToggleStoreOpen } from "@/hooks/useMerchantProfile";
import { useMerchantReviews } from "@/hooks/useMenu";
import { useEffect } from "react";
import MerchantHeader from "@/components/common/MerchantHeader";
const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const TABS: {
  key: MerchantOrderStatus;
  label: string;
  apiStatus: OrderStatus;
}[] = [
  { key: "new", label: "Mới", apiStatus: "PENDING" },
  { key: "confirmed", label: "Đã xác nhận", apiStatus: "CONFIRMED" },
  { key: "preparing", label: "Đang chuẩn bị", apiStatus: "PREPARING" },
  { key: "delivering", label: "Đang giao", apiStatus: "DELIVERING" },
  { key: "cancelled", label: "Đã hủy", apiStatus: "CANCELLED" },
];

function mapOrderStatus(status: OrderStatus): MerchantOrderStatus {
  if (status === "PENDING") return "new";
  if (status === "CONFIRMED") return "confirmed";
  if (status === "PREPARING") return "preparing";
  if (status === "DELIVERING") return "delivering";
  if (status === "CANCELLED") return "cancelled";
  return "delivering";
}

function mapOrder(order: any): MerchantOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber ?? `#${order.id.slice(0, 8)}`,
    customerName: order.orderNumber ?? `#${order.id.slice(0, 8)}`,
    status: mapOrderStatus(order.status),
    createdAt: order.createdAt ?? new Date().toISOString(),
    total: order.totalAmount ?? 0,
    paymentMethod: order.paymentMethod === "COD" ? "COD" : "Online",
    notes: order.note ?? undefined,
    tag: order.status === "PENDING" ? "NEW" : undefined,
    deliverySubStatus:
      order.status === "DELIVERING" ? "waiting_pickup" : undefined,
    items: (order.previewItems ?? order.items ?? []).map((item: any) => ({
      id: item.id,
      name: item.productName,
      quantity: item.quantity,
      optionSummary: undefined,
    })),
  };
}

export default function MerchantOrdersScreen() {
  useEffect(() => {
    console.log("ORDERS SCREEN MOUNTED");
  }, []);
  const { merchant } = useMerchantStore();
  const { isOpen, toggle } = useToggleStoreOpen();
  const [activeTab, setActiveTab] = useState<MerchantOrderStatus>("new");

  const activeApiStatus = TABS.find((tab) => tab.key === activeTab)?.apiStatus;
  const queryParams = useMemo(
    () => ({ status: activeApiStatus }),
    [activeApiStatus],
  );
  const ordersQuery = useMerchantOrders();
  const updateStatus = useUpdateMerchantOrderStatus();
  const reviewsQuery = useMerchantReviews(merchant?.id);
  const feedbackCount = reviewsQuery.data?.items?.length ?? 0;
  const orders = useMemo(() => {
    return (ordersQuery.data ?? [])
      .map(mapOrder)
      .filter((o) => o.status === activeTab);
  }, [ordersQuery.data, activeTab]);

  const activeCount = useMemo(() => {
    return (ordersQuery.data ?? []).filter((o) =>
      ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"].includes(o.status),
    ).length;
  }, [ordersQuery.data]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return (ordersQuery.data ?? []).filter(
      (o) => o.createdAt && new Date(o.createdAt).toDateString() === today,
    ).length;
  }, [ordersQuery.data]);

  function countByTab(key: MerchantOrderStatus) {
    return key === activeTab ? orders.length : 0;
  }

  function handleReject(id: string) {
    updateStatus.mutate({
      id,
      body: { status: "CANCELLED", cancelReason: "Merchant rejected order" },
    });
  }
  // Accept → CONFIRMED (báo khách)
  function handleAccept(id: string) {
    updateStatus.mutate({ id, body: { status: "CONFIRMED" } });
  }

  // Nút mới ở tab Confirmed → PREPARING (báo shipper)
  function handleStartPreparing(id: string) {
    updateStatus.mutate({ id, body: { status: "PREPARING" } });
  }

  // Nút ở tab Preparing → READY
  function handleReady(id: string) {
    updateStatus.mutate({ id, body: { status: "READY" } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MerchantHeader />

      <View style={styles.statsRow}>
        <StatBlock label="Đang xử lý" value={activeCount} />
        <View style={styles.statDivider} />
        <StatBlock label="Hôm nay" value={todayCount} />
        <View style={styles.statDivider} />
        <StatBlock label="Phản hồi" value={feedbackCount} />
      </View>
      <View
        style={{
          height: 52,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#EEE",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#EEE",
          }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          {TABS.map((tab) => {
            const count = countByTab(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text
                      style={[
                        styles.badgeText,
                        isActive && styles.badgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MerchantOrderCard
            order={item}
            onAccept={handleAccept}
            onReject={handleReject}
            onReady={handleReady}
            onStartPreparing={handleStartPreparing}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={ordersQuery.isFetching}
        onRefresh={() => ordersQuery.refetch()}
        ListEmptyComponent={<EmptyState tab={activeTab} />}
      />
    </SafeAreaView>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EmptyState({ tab }: { tab: MerchantOrderStatus }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No {tab} orders right now</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginTop: 1,
    alignItems: "center",
  },
  statBlock: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800", color: ORANGE },
  statLabel: { fontSize: 12, color: "#AAA", marginTop: 3 },
  statDivider: { width: 1, height: 36, backgroundColor: "#EEE" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 1,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
    gap: 6,
  },
  tabActive: { backgroundColor: CREAM },
  tabLabel: { fontSize: 13, fontWeight: "600", color: "#AAA" },
  tabLabelActive: { color: ORANGE },
  badge: {
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeActive: { backgroundColor: CREAM },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#999" },
  badgeTextActive: { color: ORANGE },
  listContent: { paddingTop: 12, paddingBottom: 32 },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: 15, color: "#BBB", fontWeight: "500" },
});
