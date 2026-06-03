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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { walletService } from "@/services/walletService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { AddressListResponseDto } from "@/types/address";

type PaymentMethod = "WALLET" | "VNPAY" | "COD";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function CheckoutScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { merchantId } = useLocalSearchParams<{ merchantId: string }>();

  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("COD");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const { data: addressData } = useQuery<AddressListResponseDto>({
    queryKey: ["addresses", userId],
    queryFn: () => userService.getAddresses(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (addressData && !selectedAddressId) {
      const defaultAddr =
        addressData.items.find((a) => a.isDefault) || addressData.items[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [addressData]);

  const { data: preview, isLoading: isPreviewLoading } = useQuery({
    queryKey: [
      "checkout-preview",
      merchantId,
      selectedAddressId,
      voucherCode,
      selectedPayment,
    ],
    queryFn: () => {
      console.log("=== CHECKOUT PREVIEW ===", {
        merchantId,
        selectedAddressId,
        selectedPayment,
      });
      return orderService.checkoutPreview({
        merchantId: merchantId!,
        addressId: selectedAddressId!,
        voucherCode: voucherCode,
        paymentMethod: selectedPayment,
      });
    },
    enabled: !!merchantId && !!selectedAddressId,
  });

  const createOrderMutation = useMutation({
    mutationFn: () =>
      orderService.createOrder({
        merchantId: merchantId!,
        addressId: selectedAddressId!,
        voucherCode: voucherCode,
        paymentMethod: selectedPayment,
        note: null,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["order-history"] });
      router.replace({
        pathname: "/(customer)/orderdetail",
        params: { id: data.id },
      });
    },
    onError: (error: any) => {
      Alert.alert("Đặt hàng thất bại", error.message || "Vui lòng thử lại");
    },
  });

  const selectedAddress =
    addressData?.items.find((a) => a.id === selectedAddressId) ??
    addressData?.items.find((a) => a.isDefault) ??
    addressData?.items[0];

  const paymentOptions: {
    key: PaymentMethod;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "WALLET",
      label: "Ví FoodPay",
      sublabel: "Đang tải...",
      icon: (
        <MaterialIcons
          name="account-balance-wallet"
          size={22}
          color="#EE4D2D"
        />
      ),
    },
    {
      key: "VNPAY",
      label: "Credit / Debit Card",
      sublabel: "Thanh toán qua VNPay",
      icon: <MaterialIcons name="credit-card" size={22} color="#374151" />,
    },
    {
      key: "COD",
      label: "Cash on Delivery",
      sublabel: "Thanh toán khi nhận hàng",
      icon: <MaterialIcons name="payments" size={22} color="#374151" />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() => router.push("/(customer)/addresses")}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          {selectedAddress ? (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.addressName}>
                {selectedAddress.recipientName || user?.fullName} |{" "}
                {selectedAddress.phone || user?.phoneNumber}
              </Text>
              <Text style={styles.addressDetail}>
                {[
                  selectedAddress.label,
                  selectedAddress.addressLine,
                  selectedAddress.ward,
                  selectedAddress.city,
                ]
                  .filter(Boolean)
                  .join(" - ")}
              </Text>
            </View>
          ) : (
            <Text style={styles.addressDetail}>Chưa có địa chỉ</Text>
          )}
        </View>

        {/* Order Items */}
        {isPreviewLoading ? (
          <View
            style={[styles.card, { alignItems: "center", paddingVertical: 30 }]}
          >
            <ActivityIndicator color="#EE4D2D" />
            <Text style={{ color: "#9ca3af", marginTop: 8 }}>Đang tải...</Text>
          </View>
        ) : preview ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="storefront" size={18} color="#EE4D2D" />
              <Text style={styles.cardTitle}>{preview.merchantId}</Text>
            </View>
            {preview.items.map((item) => (
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
                  {item.selectedOptions?.map((opt, i) => (
                    <Text key={i} style={styles.itemOption}>
                      {opt.values.map((v) => v.name).join(", ")}
                    </Text>
                  ))}
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.lineTotal)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Delivery Time */}
        {preview && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AntDesign name="clock-circle" size={16} color="#EE4D2D" />
              <Text style={styles.cardTitle}>Delivery Time</Text>
              <View style={styles.standardBadge}>
                <Text style={styles.standardBadgeText}>Standard</Text>
              </View>
            </View>
            <Text style={styles.deliveryTimeText}>
              ASAP - {preview.estimatedTimeMinutes ?? "..."} mins
            </Text>
            <Text style={styles.deliverySubText}>
              Khoảng cách: {preview.distanceKm?.toFixed(1)} km
            </Text>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="payment" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>
          {paymentOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.paymentRow,
                selectedPayment === opt.key && styles.paymentRowActive,
              ]}
              onPress={() => setSelectedPayment(opt.key)}
            >
              <View style={styles.paymentIcon}>{opt.icon}</View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paymentLabel,
                    selectedPayment === opt.key && {
                      color: "#EE4D2D",
                      fontWeight: "700",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={styles.paymentSublabel}>{opt.sublabel}</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === opt.key && styles.radioOuterActive,
                ]}
              >
                {selectedPayment === opt.key && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vouchers */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-offer" size={18} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Vouchers</Text>
            <Text style={styles.changeText}>
              {voucherCode ? voucherCode : "Select a voucher >"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Order Summary */}
        {preview && (
          <View style={styles.card}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({preview.itemCount} items)
              </Text>
              <Text style={styles.summaryValue}>
                {formatPrice(preview.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(preview.deliveryFee)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phương thức thanh toán</Text>
              <Text style={styles.summaryValue}>{selectedPayment}</Text>
            </View>
            {preview.voucherDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: "#EE4D2D" }]}>
                  Voucher Discount
                </Text>
                <Text style={[styles.summaryValue, { color: "#EE4D2D" }]}>
                  -{formatPrice(preview.voucherDiscount)}
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
              <Text style={styles.totalLabel}>Total Payment</Text>
              <Text style={styles.totalValue}>
                {formatPrice(preview.total)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            createOrderMutation.isPending && { opacity: 0.6 },
          ]}
          onPress={() => createOrderMutation.mutate()}
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 4,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#1f2937" },
  changeText: { fontSize: 14, color: "#EE4D2D", fontWeight: "600" },
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
  itemOption: { fontSize: 12, color: "#9ca3af" },
  itemQty: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
  deliveryTimeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 6,
  },
  deliverySubText: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  standardBadge: {
    backgroundColor: "#fff0ed",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  standardBadgeText: { fontSize: 12, fontWeight: "600", color: "#EE4D2D" },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  paymentRowActive: { borderColor: "#EE4D2D", backgroundColor: "#fff7f5" },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  paymentSublabel: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#EE4D2D" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EE4D2D",
  },
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
  totalValue: { fontSize: 18, fontWeight: "800", color: "#EE4D2D" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  placeOrderBtn: {
    backgroundColor: "#EE4D2D",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  placeOrderText: { color: "white", fontSize: 17, fontWeight: "bold" },
});
