// app/ohio-merchant/app/(merchant)/(tabs)/orders.tsx
import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
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
import { useEffect } from "react";
const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const TABS: {
  key: MerchantOrderStatus;
  label: string;
  apiStatus: OrderStatus;
}[] = [
  { key: "new", label: "New", apiStatus: "PENDING" },
  { key: "preparing", label: "Preparing", apiStatus: "PREPARING" },
  { key: "delivering", label: "Delivering", apiStatus: "DELIVERING" },
];

function mapOrderStatus(status: OrderStatus): MerchantOrderStatus {
  if (status === "PENDING") return "new";
  if (status === "PREPARING" || status === "CONFIRMED") return "preparing";
  return "delivering";
}

function mapOrder(order: Order): MerchantOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber ?? `#${order.id.slice(0, 8)}`,
    customerName: order.customerName ?? "Customer",
    status: mapOrderStatus(order.status),
    createdAt: order.createdAt ?? new Date().toISOString(),
    total: order.totalAmount ?? 0,
    paymentMethod: order.paymentMethod === "COD" ? "COD" : "Online",
    notes: order.note ?? undefined,
    tag: order.status === "PENDING" ? "NEW" : undefined,
    deliverySubStatus:
      order.status === "DELIVERING" ? "waiting_pickup" : undefined,
    items:
      order.items?.map((item) => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        optionSummary: item.selectedOptions
          ?.map((opt) => `${opt.optionName}: ${opt.valueName}`)
          .join(", "),
      })) ?? [],
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
  const ordersQuery = useMerchantOrders(queryParams);
  const updateStatus = useUpdateMerchantOrderStatus();

  const orders = ordersQuery.data?.map(mapOrder) ?? [];

  function countByTab(key: MerchantOrderStatus) {
    return key === activeTab ? orders.length : 0;
  }

  function handleAccept(id: string) {
    updateStatus.mutate({
      id,
      body: { status: "PREPARING", note: "Kitchen started" },
    });
  }

  function handleReject(id: string) {
    updateStatus.mutate({
      id,
      body: { status: "CANCELLED", cancelReason: "Merchant rejected order" },
    });
  }

  function handleReady(id: string) {
    updateStatus.mutate({
      id,
      body: { status: "READY", note: "Ready for pickup" },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.shopName}>
            {merchant?.storeName ?? "Kinetic Kitchen"}
          </Text>
          <Text style={styles.shopSub}>Orders Dashboard</Text>
        </View>
        <View style={styles.toggleWrapper}>
          <Text
            style={[styles.toggleLabel, { color: isOpen ? ORANGE : "#AAA" }]}
          >
            {isOpen ? "OPEN" : "CLOSED"}
          </Text>
          <Switch
            value={isOpen}
            onValueChange={toggle}
            trackColor={{ false: "#DDD", true: ORANGE }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatBlock label="Active" value={orders.length} />
        <View style={styles.statDivider} />
        <StatBlock label="Today" value={orders.length} />
        <View style={styles.statDivider} />
        <StatBlock label="Feedbacks" value={0} />
      </View>

      <View style={styles.tabBar}>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: ORANGE },
  tabLabel: { fontSize: 14, fontWeight: "600", color: "#BBB" },
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
