import EvilIcons from "@expo/vector-icons/EvilIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OrderCardType } from "../../mock/shipper";
import { mock_nearbyrestaurant } from "@/mock/home";
import { useMemo } from "react";
import { number } from "zod";
import { CartItemResponseDto, CartResponseDto } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { mock_merchant_new } from "@/mock/customer_cart";
import { OrderHistoryItemDto } from "@/types/order";
import { orderService } from "@/services/orderService";

export function OrderCard_ForDriver({
  id,
  status,
  merchantId,
  totalamount,
  pickuplocation,
  deliverylocation,
}: OrderCardType) {
  const router = useRouter();
  const restaurant = useMemo(
    () => mock_nearbyrestaurant.find((f) => f.id === merchantId),
    [merchantId],
  );

  const statuscolor = () => {
    if (status === "PENDING") return "#808080ff";
    if (status === "READY") return "#2cbe00ff";
    if (status === "DELIVERING") return "#EA580C";
  };
  const buttontext = () => {
    if (status === "PENDING") return "Nhận đơn";
    if (status === "READY") return "Lấy hàng";
    if (status === "DELIVERING") return "Hoàn thành";
  };
  const StatusText = () => {
    if (status === "PENDING") return "Chờ duyệt";
    if (status === "READY") return "Sẵn sàng";
    if (status === "DELIVERING") return "Đang giao hàng";
  };
  const handleAccept = () => {
    if (status === "PENDING") {
      // API update
    }
  };
  const handlePickup = () => {
    if (status === "READY") {
      // API update
    }
  };
  const handleComplete = () => {
    if (status === "DELIVERING") {
      router.push({ pathname: "/(shipper)/completion", params: { id } });
    }
  };
  return (
    <View style={styles.ordercard_container}>
      <View style={{ padding: 20, gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={[styles.status, { backgroundColor: statuscolor() }]}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
              {StatusText()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.incidentBadgeButton}
              onPress={() =>
                router.push({
                  pathname: "/(shipper)/incidentreport" as any,
                  params: { id },
                })
              }
            >
              <Ionicons name="warning-outline" size={16} color="#EF4444" />
              <Text style={styles.incidentBadgeText}>Sự cố</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chatBadgeButton}
              onPress={() =>
                router.push({
                  pathname: "/(shipper)/chatroom" as any,
                  params: { id },
                })
              }
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={16}
                color="#EE4D2D"
              />
              <Text style={styles.chatBadgeText}>Trò chuyện</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
          onPress={() =>
            router.push({ pathname: `/(shipper)/orderdetail`, params: { id } })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{ uri: restaurant?.logo_url }}
              style={{ width: 50, height: 50, borderRadius: 12 }}
            />
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {restaurant?.name}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Xem chi tiết đơn hàng
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#B22203" }}
            >
              {totalamount}đ
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>Phí vận chuyển</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            gap: 20,
          }}
        >
          <View
            style={[
              styles.round,
              (status === "DELIVERING" || status === "DELIVERED") && {
                backgroundColor: "#ee4d2d3b",
              },
            ]}
          >
            <Octicons
              name="dot-fill"
              size={20}
              color={
                status === "DELIVERING" || status === "DELIVERED"
                  ? "#EE4D2D"
                  : "black"
              }
            />
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "gray" }}>Điểm lấy hàng</Text>
            <Text>{pickuplocation}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            gap: 20,
          }}
        >
          <View
            style={[
              styles.round,
              status === "DELIVERED" && { backgroundColor: "#ee4d2d3b" },
            ]}
          >
            <EvilIcons
              name="location"
              size={20}
              color={status === "DELIVERED" ? "#EE4D2D" : "black"}
            />
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "gray" }}>Điểm giao hàng</Text>
            <Text>{deliverylocation}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          width: "100%",
          backgroundColor: statuscolor(),
        }}
        onPress={
          status === "PENDING"
            ? handleAccept
            : status === "READY"
              ? handlePickup
              : handleComplete
        }
      >
        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
          {buttontext()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function OrderCardHistory_ForDriver({
  id,
  merchantId,
  deliveredtime,
  totalamount,
  status,
  rating,
}: OrderCardType) {
  const statuscolor = () => {
    if (status === "CANCELLED") return "red";
    if (status === "DELIVERED") return "#34C759";
  };
  const StatusText = () => {
    if (status === "CANCELLED") return "Đã hủy";
    if (status === "DELIVERED") return "Đã hoàn thành";
  };
  const router = useRouter();
  const restaurant = useMemo(
    () => mock_nearbyrestaurant.find((f) => f.id === merchantId),
    [merchantId],
  );
  return (
    <TouchableOpacity
      style={styles.ordercard_container}
      onPress={() =>
        router.push({ pathname: `/(shipper)/historydetail`, params: { id } })
      }
    >
      <View style={{ padding: 20, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{ uri: restaurant?.logo_url }}
              style={{ width: 50, height: 50, borderRadius: 12 }}
            />
            <View>
              <Text style={{ fontSize: 16 }}>{restaurant?.name}</Text>
              <Text style={{ color: "gray", fontSize: 12 }}>
                {deliveredtime}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Text style={{ fontSize: 11, color: "gray" }}>Rating:</Text>
                <Entypo name="star" size={12} color="#ffd900ff" />
                <Text style={{ fontSize: 12 }}>{rating}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "#B22203" }}
              >
                {totalamount}đ
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: statuscolor(),
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {StatusText()}
                </Text>
              </View>
            </View>

            <Entypo name="chevron-thin-right" size={18} color="black" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function OrderCard_ForCustomer({ id, status, createdAt, merchantId, merchantAvatar, merchantName, totalAmount, previewItems }: OrderHistoryItemDto) {
  const statuscolor = () => {
    if (status === 'PENDING') return '#ddddddff';
    if (status === 'CONFIRMED') return '#90d9e2ff';
    if (status === 'PREPARING') return '#ffaf54ff';
    if (status === 'DELIVERING') return '#ee99e3ff';
    if (status === 'DELIVERED') return '#a6ff83ff';
    if (status === 'CANCELLED') return '#ffa6a6ff';
    return '#FEF3C7';
  }
  const textcolor = () => {
    if (status === 'PENDING') return '#000000ff';
    if (status === 'CONFIRMED') return '#005661ff';
    if (status === 'PREPARING') return '#6b4000ff';
    if (status === 'DELIVERING') return '#682b60ff';
    if (status === 'DELIVERED') return '#207000ff';
    if (status === 'CANCELLED') return '#960000ff';
    return '#92400eff';
  }
  const statusDisplay = () => {
    if (status === 'PENDING') return 'Chờ duyệt';
    if (status === 'CONFIRMED') return 'Đã xác nhận';
    if (status === 'PREPARING') return 'Đang chuẩn bị';
    if (status === 'DELIVERING') return 'Đang giao hàng';
    if (status === 'DELIVERED') return 'Đã giao hàng';
    if (status === 'CANCELLED') return 'Đã hủy';
    if (status === 'READY') return 'Sẵn sàng';
    return '';
  }
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleReview = () => {
    router.push({ pathname: `/(customer)/review`, params: { id } });
  }

  const cancleOrderMutation = useMutation({
    mutationFn: () => orderService.cancleOrder(id),
    onSuccess: () => {
      Alert.alert("Thành công", "Hủy đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order-history"] });
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.message || "Không thể hủy đơn hàng lúc này.");
    }
  });
  return (
    <View style={[styles.ordercard_container, { borderColor: statuscolor(), borderWidth: 1 }]}>
      <View style={{ padding: 20, width: '100%', gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <View style={{ backgroundColor: statuscolor(), paddingVertical: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 100 }}>
            <Text style={{ color: textcolor(), fontSize: 12 }}>{statusDisplay()}</Text>
          </View>
          <TouchableOpacity
            style={styles.chatBadgeButton}
            onPress={() => router.push({ pathname: `/(customer)/chatroom`, params: { id: id } })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#EE4D2D" />
            <Text style={styles.chatBadgeText}>Trò chuyện</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }} onPress={() => { }}>
          <Image source={{ uri: merchantAvatar || '' }} style={{ width: 50, height: 50, borderRadius: 12 }} />
          <View style={{ width: 240 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{merchantName}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>{previewItems?.map((item) => `${item.quantity}x ${item.productName}`).join(', ')}</Text>
          </View>
        </TouchableOpacity>

        {status !== "DELIVERED" && status !== "CANCELLED" && (
          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: "300" }}>
                Thời điểm đặt hàng
              </Text>
              <Text>{createdAt}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: 18,
                backgroundColor: "#ebebebff",
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 15 }}>Tổng cộng</Text>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {totalAmount}đ
              </Text>
            </View>
            {status === "PENDING" && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  width: "100%",
                  backgroundColor: cancleOrderMutation.isPending ? "#9ca3af" : "#EE4D2D",
                  borderRadius: 12,
                }}
                disabled={cancleOrderMutation.isPending}
                onPress={() => {
                  Alert.alert(
                    "Xác nhận",
                    "Bạn có chắc chắn muốn hủy đơn hàng này không?",
                    [
                      { text: "Không", style: "cancel" },
                      { text: "Có, hủy đơn", onPress: () => cancleOrderMutation.mutate() }
                    ]
                  );
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 17, fontWeight: "bold" }}
                >
                  {cancleOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn hàng"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {status === "DELIVERED" && (
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#ebebebff",
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#EE4D2D",
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={handleReview}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Đánh giá
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export function CartCard({
  merchantId,
  items,
  refetchCart,
}: {
  merchantId: string;
  items: CartItemResponseDto[];
  refetchCart: () => void;
}) {
  const router = useRouter();
  const { data: merchantData } = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => userService.getMerchantProfile(merchantId!),
    enabled: !!merchantId,
  });
  const removeCartByMerchantMutation = useMutation({
    mutationFn: () => orderService.removeCartByMerchant(merchantId!),
    onSuccess: () => {
      Alert.alert("Đã xóa giỏ hàng");
      refetchCart();
    },
    onError: (error: any) => {
      Alert.alert("Xóa giỏ hàng thất bại", error.message);
    },
  });

  const merchant = merchantData || mock_merchant_new;

  return (
    <View
      style={[
        styles.ordercard_container,
        { borderColor: "#FEF3C7", borderWidth: 1 },
      ]}
    >
      <View style={{ padding: 20, width: "100%", gap: 12 }}>
        <View
          style={{
            backgroundColor: "#FEF3C7",
            paddingVertical: 5,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
          }}
        >
          <Text style={{ color: "#92400e", fontSize: 12 }}>Đang chờ</Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}
          onPress={() => { }}
        >
          <Image
            source={{ uri: merchant?.storeLogoUrl }}
            style={{ width: 50, height: 50, borderRadius: 12 }}
          />
          <View style={{ width: 240 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {merchant?.storeName}
            </Text>
            <Text style={{ color: "gray", fontSize: 12 }}>
              {items
                ?.map((item, idx) =>
                  idx === items.length - 1
                    ? `${item.quantity}x ${item.productName}`
                    : `${item.quantity}x ${item.productName}, `,
                )
                .join("")}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#ebebebff",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() => removeCartByMerchantMutation.mutate()}
          >
            <Text style={{ fontWeight: "bold" }}>Hủy giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#EE4D2D",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() =>
              router.push({
                pathname: "/(customer)/checkout",
                params: { merchantId },
              })
            }
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Hoàn thành đơn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ordercard_container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "auto",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  status: {
    height: 35,
    width: 100,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  chatBadgeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ee4d2d12",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
  },
  chatBadgeText: {
    color: "#EE4D2D",
    fontSize: 12,
    fontWeight: "bold",
  },
  incidentBadgeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef444415",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
  },
  incidentBadgeText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  round: {
    width: 25,
    height: 25,
    borderRadius: 90,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
});
