//components/features/MerchantOrderCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MerchantOrder } from "../../mock/merchant";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

interface Props {
  order: MerchantOrder;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onReady?: (id: string) => void;
}

function getMinutesAgo(isoString: string): number {
  return Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
}

function formatCurrency(amount: number): string {
  if (amount < 1000) return `$${amount.toFixed(2)}`;
  return amount.toLocaleString("vi-VN") + "đ";
}

function itemsSummary(items: MerchantOrder["items"]): string {
  return items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
}

// ─── Full card (New orders) ───────────────────────────────────────────────────
function FullOrderCard({ order, onAccept, onReject }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.fullBody}>
        {/* Order number + badge */}
        <View style={styles.fullTopRow}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          {order.tag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{order.tag}</Text>
            </View>
          )}
        </View>

        <Text style={styles.customerName}>{order.customerName}</Text>

        {/* Items */}
        <View style={{ marginTop: 10, gap: 6 }}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.optionSummary && (
                  <Text style={styles.itemOption}>{item.optionSummary}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>📝 {order.notes}</Text>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.fullFooter}>
          <View>
            <Text style={styles.total}>{formatCurrency(order.total)}</Text>
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentBadgeText}>
                {order.paymentMethod === "Online" ? "ONLINE PAID" : "COD"}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => onReject?.(order.id)}
            >
              <Text style={styles.rejectLabel}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => onAccept?.(order.id)}
            >
              <Text style={styles.acceptLabel}>Accept Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Compact card (Preparing / Delivering) ────────────────────────────────────
function CompactOrderCard({ order, onReady }: Props) {
  const minutes = getMinutesAgo(order.createdAt);

  const buttonConfig = (() => {
    if (order.status === "preparing") {
      return {
        label: "Ready for Pick-up",
        color: ORANGE,
        onPress: () => onReady?.(order.id),
      };
    }
    if (order.deliverySubStatus === "waiting_pickup") {
      return {
        label: "Waiting for Pick-up",
        color: "#F59E0B",
        onPress: undefined,
      };
    }
    return { label: "On the way", color: "#10B981", onPress: undefined };
  })();

  return (
    <View style={styles.card}>
      <View style={styles.compactBody}>
        <View style={styles.compactTopRow}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.timer}>{minutes}m</Text>
        </View>
        <Text style={styles.compactItems} numberOfLines={1}>
          {itemsSummary(order.items)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.compactBtn, { backgroundColor: buttonConfig.color }]}
        onPress={buttonConfig.onPress}
        activeOpacity={buttonConfig.onPress ? 0.7 : 1}
      >
        <Text style={styles.compactBtnLabel}>{buttonConfig.label}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function MerchantOrderCard(props: Props) {
  if (props.order.status === "new") return <FullOrderCard {...props} />;
  return <CompactOrderCard {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  // Full card
  fullBody: { padding: 16 },
  fullTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: { fontSize: 12, color: "#AAA", fontWeight: "500" },
  tag: {
    backgroundColor: ORANGE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: "#fff", fontWeight: "700" },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 4,
  },
  itemRow: { flexDirection: "row", gap: 8 },
  itemQty: { fontSize: 13, fontWeight: "700", color: ORANGE, width: 28 },
  itemName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  itemOption: { fontSize: 12, color: "#AAA", marginTop: 1 },
  notesBox: {
    backgroundColor: CREAM,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  notesText: { fontSize: 12, color: "#666" },
  divider: { height: 1, backgroundColor: "#F2F2F2", marginVertical: 14 },
  fullFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  paymentBadge: {
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
    alignSelf: "flex-start",
  },
  paymentBadgeText: { fontSize: 10, color: "#888", fontWeight: "700" },
  actions: { flexDirection: "row", gap: 8 },
  rejectBtn: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  rejectLabel: { fontSize: 13, fontWeight: "600", color: "#555" },
  acceptBtn: {
    backgroundColor: ORANGE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  acceptLabel: { fontSize: 13, fontWeight: "600", color: "#fff" },
  // Compact card
  compactBody: { padding: 14 },
  compactTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timer: { fontSize: 12, color: "#AAA" },
  compactItems: { fontSize: 13, color: "#888", marginTop: 4 },
  compactBtn: { height: 48, justifyContent: "center", alignItems: "center" },
  compactBtnLabel: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
