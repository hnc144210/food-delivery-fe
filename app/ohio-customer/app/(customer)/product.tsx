import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState, useEffect } from "react";
import {
  ProductOption,
  ProductOptions,
  ProductOptionValue,
} from "../../components/features/ProductOptions";
import {
  foods,
  mock_productdata,
  mock_nearbyrestaurant,
} from "../../mock/home";
import { homeService } from "@/services/catalogService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductOptionResponseDto,
  ProductOptionValueResponseDto,
} from "@/types/product";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { CartRequestDto, OptionValueRequestDto } from "@/types/cart";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

// Chuyển OptionGroup từ FoodItem sang ProductOption[] để dùng cho UI
function buildOptionsFromFood(options: ProductOptionResponseDto[]) {
  if (!options) return [];
  return options.map((group) => ({
    id: group.id,
    name: group.name,
    max_selection: group.maxSelections,
    options: group.values.map((opt) => ({
      id: opt.id,
      name: opt.name,
      extra_price: opt.additionalPrice,
      is_selected: false, // mặc định chọn option đầu nếu required
    })),
  }));
}

export default function ProductScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: productdata, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => homeService.getProductDetail(id!),
  });
  const { data: restaurantdata } = useQuery({
    queryKey: ["restaurant", productdata?.merchantId],
    queryFn: () => userService.getMerchantProfile(productdata?.merchantId!),
    enabled: !!productdata?.merchantId,
  });

  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<ProductOptionResponseDto[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (productdata) {
      setOptions(
        productdata.options.map((opt) => ({
          ...opt,
          values: opt.values.map((ov) => ({ ...ov, isAvailable: false })),
        })),
      );
    }
  }, [productdata]);

  const handleSelectOption = (
    option: ProductOptionResponseDto,
    optionValue: ProductOptionValueResponseDto,
  ) => {
    setOptions((prev) =>
      prev.map((o) => {
        if (o.id === option.id) {
          return {
            ...o,
            values: o.values.map((ov) => {
              if (ov.id === optionValue.id) {
                return { ...ov, isAvailable: !ov.isAvailable };
              }
              return ov;
            }),
          };
        }
        return o;
      }),
    );
  };

  const addItemCartMutation = useMutation({
    mutationFn: (cartItem: CartRequestDto) =>
      orderService.addItemCart(cartItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Alert.alert("Thêm vào giỏ hàng thành công");
      router.back();
    },
    onError: (error: any) => {
      Alert.alert("Thêm vào giỏ hàng thất bại", error.message);
    },
  });
  const handleAddCart = () => {
    if (
      options.some(
        (option) =>
          option.isRequired &&
          !option.values.some((value) => value.isAvailable),
      )
    ) {
      Alert.alert("Vui lòng chọn đầy đủ các tùy chọn bắt buộc");
      return;
    }
    const optionRequests: OptionValueRequestDto[] = options.map((option) => ({
      optionId: option.id,
      valueIds: option.values
        .filter((value) => value.isAvailable)
        .map((value) => value.id),
    }));
    addItemCartMutation.mutate({
      productId: id,
      quantity: quantity,
      note: note,
      selectedOptions: optionRequests,
    });
  };

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
          Đang tải dữ liệu món ăn...
        </Text>
      </View>
    );
  }

  if (!productdata) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 18, color: "#888" }}>
          Không tìm thấy sản phẩm
        </Text>
        <TouchableOpacity onPress={router.back} style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, color: "#EE4D2D", fontWeight: "700" }}>
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rating = productdata.averageRating ?? 0;
  const prep_time = productdata.prepTime ?? 0;
  const discount_price = productdata.discountPrice ?? productdata.basePrice;
  const totalPrice =
    (discount_price +
      options.reduce(
        (acc, option) =>
          acc +
            option.values.reduce(
              (acc2, optionValue) =>
                acc2 +
                (optionValue.isAvailable ? optionValue.additionalPrice : 0),
              0,
            ) || 0,
        0,
      )) *
    quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#EE4D2D",
            textAlign: "center",
          }}
        >
          Chi tiết món ăn
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ width: "100%" }}>
        {/* Card thông tin món */}
        <Image
          source={{ uri: productdata.imageUrl || "" }}
          style={{
            width: "100%",
            height: 240,
            position: "absolute",
            top: 0,
            alignSelf: "center",
          }}
        />
        <View style={{ paddingHorizontal: 30 }}>
          <View style={styles.card}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: "#1a1a1a",
                flex: 1,
              }}
            >
              {productdata.name}
            </Text>
            {!productdata.isAvailable && (
              <View
                style={{
                  backgroundColor: "#fee2e2",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 6,
                }}
              >
                <Text
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Món này hiện không khả dụng
                </Text>
              </View>
            )}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#EE4D2D" }}
              >
                {formatPrice(discount_price)}
              </Text>
              {discount_price !== productdata.basePrice && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#999",
                    textDecorationLine: "line-through",
                  }}
                >
                  {formatPrice(productdata.basePrice)}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff3f0",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  gap: 4,
                }}
              >
                <AntDesign name="star" size={12} color="#EE4D2D" />
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#EE4D2D" }}
                >
                  {rating}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/(customer)/reviewbyproduct",
                    params: { id: productdata.id },
                  });
                }}
              >
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#EE4D2D" }}
                >
                  Xem đánh giá
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#888" }}>
                <AntDesign name="clock-circle" size={11} color="#888" />{" "}
                {prep_time} mins
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={styles.name}>{restaurantdata?.storeName}</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/(customer)/restaurant",
                    params: { id: productdata.merchantId },
                  });
                }}
              >
                <Text style={styles.menu_button}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>

          {options.map((option, index) => (
            <ProductOptions
              key={index}
              option={option}
              onSelectOption={handleSelectOption}
            />
          ))}

          <View style={styles.notebox}>
            <Text style={[styles.name, { marginBottom: 5 }]}>Yêu cầu thêm</Text>
            <TextInput
              placeholder="Ghi chú cho cửa hàng (vd: nhiều ớt, không hành)"
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <AntDesign name="minus" size={16} color="#EE4D2D" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <AntDesign name="plus" size={16} color="#EE4D2D" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            !productdata.isAvailable && { backgroundColor: "#ccc" },
          ]}
          onPress={handleAddCart}
          disabled={!productdata.isAvailable}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          <Text style={styles.addToCartPrice}>{formatPrice(totalPrice)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "#F6F6F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 160,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  notebox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  badge: {
    backgroundColor: "#fff0ed",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EE4D2D",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#EE4D2D",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EE4D2D",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#EE4D2D",
    backgroundColor: "#EE4D2D",
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  optionPrice: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#333",
    minHeight: 60,
    backgroundColor: "#fafafa",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 28,
    width: "100%",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 6,
    minWidth: 24,
    textAlign: "center",
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: "#EE4D2D",
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addToCartText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  addToCartPrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.9,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menu_button: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#B22203",
  },
});
