import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { ReturnButton } from "@/components/ui/ReturnButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  READY: "Sẵn sàng",
  PICKED_UP: "Đã lấy hàng",
  DELIVERING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PREPARING: "#8b5cf6",
  READY: "#10b981",
  PICKED_UP: "#06b6d4",
  DELIVERING: "#EE4D2D",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id, waitingPayment } = useLocalSearchParams<{
    id: string;
    waitingPayment?: string;
  }>();
  const [paymentChecked, setPaymentChecked] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderDetail(id!),
    enabled: !!id,
    refetchInterval:
      waitingPayment === "true" && !paymentChecked ? 3000 : false,
  });

  useEffect(() => {
    if (waitingPayment !== "true" || paymentChecked || !order) return;
    if (order.paymentStatus === "PAID") {
      setPaymentChecked(true);
      Alert.alert("Thanh toán thành công", "Đơn hàng đã được xác nhận!");
    } else if (order.paymentStatus === "FAILED") {
      setPaymentChecked(true);
      Alert.alert("Thanh toán thất bại", "Giao dịch không thành công.");
    }
  }, [order?.paymentStatus]);

  useEffect(() => {
    if (waitingPayment !== "true") return;
    const timeout = setTimeout(
      () => {
        if (!paymentChecked) {
          setPaymentChecked(true);
          Alert.alert(
            "Chưa thanh toán",
            "Bạn chưa hoàn tất thanh toán. Đơn hàng sẽ bị hủy nếu không thanh toán.",
            [{ text: "OK" }],
          );
        }
      },
      10 * 60 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#EE4D2D" />
        <Text style={{ marginTop: 12, color: "#888" }}>
          Đang tải đơn hàng...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#888" }}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity onPress={router.back} style={{ marginTop: 12 }}>
          <Text style={{ color: "#EE4D2D", fontWeight: "700" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor = STATUS_COLOR[order.status] || "#6b7280";
  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 30 * 60000,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Địa chỉ giao hàng */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
          </View>
          <Text style={styles.addressName}>
            {order.recipientName} | {order.recipientPhone}
          </Text>
          <Text style={styles.addressDetail}>
            {[order.deliveryAddress, order.deliveryWard, order.deliveryCity]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>

        {/* Cửa hàng + Sản phẩm */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="storefront" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>{order.merchantName}</Text>
          </View>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              {item.productImage ? (
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.itemImage}
                />
              ) : (
                <View
                  style={[styles.itemImage, { backgroundColor: "#f3f4f6" }]}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatPrice(item.unitPrice * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Thời gian giao hàng */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="clock-circle" size={16} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Thời gian giao hàng</Text>
          </View>
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeLabel}>THỜI GIAN ĐẶT</Text>
              <Text style={styles.timeValue}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.timeLabel}>DỰ KIẾN NHẬN</Text>
              <Text style={[styles.timeValue, { color: "#EE4D2D" }]}>
                {`${estimatedDelivery.getHours().toString().padStart(2, "0")}:${estimatedDelivery.getMinutes().toString().padStart(2, "0")}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Tóm tắt đơn hàng */}
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Tạm tính ({order.items.length} sản phẩm)
            </Text>
            <Text style={styles.summaryValue}>
              {formatPrice(order.subtotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(order.deliveryFee)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phương thức thanh toán</Text>
            <Text style={styles.summaryValue}>
              {order.paymentMethod === "COD"
                ? "Tiền mặt"
                : order.paymentMethod === "VNPAY"
                  ? "VNPay"
                  : "Ví FoodPay"}
            </Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#EE4D2D" }]}>
                Giảm giá
              </Text>
              <Text style={[styles.summaryValue, { color: "#EE4D2D" }]}>
                -{formatPrice(order.discountAmount)}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.summaryRow,
              {
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: "#f3f4f6",
              },
            ]}
          >
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>
              {formatPrice(order.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Trạng thái */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info-outline" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Trạng thái đơn hàng</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {STATUS_LABEL[order.status] || order.status}
            </Text>
          </View>
        </View>

        {/* Nút theo dõi */}
        {[
          "PENDING",
          "CONFIRMED",
          "PREPARING",
          "READY",
          "PICKED_UP",
          "DELIVERING",
        ].includes(order.status) && (
          <TouchableOpacity
            style={[styles.reviewBtn, { backgroundColor: "#1f2937" }]}
            onPress={() =>
              router.push({
                pathname: "/(customer)/ordertracking",
                params: { id: order.id },
              })
            }
          >
            <Ionicons name="navigate" size={18} color="white" />
            <Text style={styles.reviewBtnText}>Theo dõi đơn hàng</Text>
          </TouchableOpacity>
        )}

        {/* Nút đánh giá */}
        {order.status === "DELIVERED" && (
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() =>
              router.push({
                pathname: "/(customer)/review",
                params: { id: order.id },
              })
            }
          >
            <AntDesign name="star" size={18} color="white" />
            <Text style={styles.reviewBtnText}>Đánh giá đơn hàng</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#1f2937" },
  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  addressDetail: { fontSize: 13, color: "#6b7280", lineHeight: 20 },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f9fafb",
  },
  itemImage: { width: 56, height: 56, borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1f2937" },
  itemQty: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeValue: { fontSize: 15, fontWeight: "700", color: "#1f2937" },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: "#6b7280" },
  summaryValue: { fontSize: 14, color: "#1f2937", fontWeight: "500" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#1f2937" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#EE4D2D" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  statusText: { fontSize: 14, fontWeight: "700" },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EE4D2D",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  reviewBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
