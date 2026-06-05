import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  ProductCard_Large,
  ProductCard_Small,
} from "../../components/features/ProductCard";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { mock_nearbyrestaurant, mock_productdata_new } from "../../mock/home";
import { ProductCardData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { mock_merchant_new } from "@/mock/customer_cart";
import { homeService } from "@/services/catalogService";
import { ReviewCard } from "@/components/features/ReviewCard";
import { Entypo, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";

export default function Restaurant() {
  const [isMenu, setIsMenu] = useState(true);
  const [isReview, setIsReview] = useState(false);
  const [isInfo, setIsInfo] = useState(false);

  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    undefined,
  );
  const [hasImagesOnly, setHasImagesOnly] = useState<boolean>(false);

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: restaurantData = mock_merchant_new, isLoading } = useQuery({
    queryKey: ["merchant", id],
    queryFn: () => userService.getMerchantProfile(id || ""),
    enabled: !!id,
  });

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => homeService.getProducts(),
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => homeService.getMerchantReview(id || ""),
    enabled: !!id,
  });

  const restaurantProducts = products?.items.filter(
    (product) => product.merchantId === id && product.isAvailable !== false,
  );

  if (isLoading || isProductsLoading || isReviewsLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#EE4D2D" />
        <Text style={{ marginTop: 12, color: "#888" }}>
          Đang tải thông tin nhà hàng...
        </Text>
      </View>
    );
  }

  if (!restaurantData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const renderStars = (rating: number, size = 14) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <AntDesign key={star} name="star" size={size} color="#FFD700" />
        ))}
      </View>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch {
      return dateStr;
    }
  };

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={{ width: "100%", height: 320, position: "relative" }}>
        <Image
          source={{ uri: restaurantData.storeBannerUrl }}
          style={{ width: "100%", height: 320, backgroundColor: "lightgray" }}
        />
        <View style={{ position: "absolute", top: 50, left: 20 }}>
          <ReturnButton onpressfunction={router.back} />
        </View>
        <View style={styles.restaurantinfo_container}>
          <Image
            source={{ uri: restaurantData.storeLogoUrl }}
            style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }}
          />
          <View>
            <Text style={styles.restaurantname}>
              {restaurantData.storeName}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="field-time" size={15} color="black" />
              <Text> Vận chuyển: {restaurantData.avgPrepTime} phút</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <AntDesign
                name="disconnect"
                size={15}
                color={restaurantData.isOpen ? "green" : "red"}
              />
              <Text>{restaurantData.isOpen ? "Đang mở" : "Đã đóng cửa"}</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 20,
          paddingHorizontal: 20,
          paddingTop: 15,
        }}
      >
        <TouchableOpacity
          style={isMenu ? styles.active : styles.inactive}
          onPress={() => {
            setIsMenu(true);
            setIsReview(false);
            setIsInfo(false);
          }}
        >
          <Text style={isMenu ? styles.activeText : styles.inactiveText}>
            Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={isReview ? styles.active : styles.inactive}
          onPress={() => {
            setIsMenu(false);
            setIsReview(true);
            setIsInfo(false);
          }}
        >
          <Text style={isReview ? styles.activeText : styles.inactiveText}>
            Đánh giá
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={isInfo ? styles.active : styles.inactive}
          onPress={() => {
            setIsMenu(false);
            setIsReview(false);
            setIsInfo(true);
          }}
        >
          <Text style={isInfo ? styles.activeText : styles.inactiveText}>
            Thông tin
          </Text>
        </TouchableOpacity>
      </View>
      {/**main menu */}
      {isMenu && (
        <View style={styles.body}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 23 }}>
              Món bán chạy
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "lightgray",
                marginLeft: 10,
              }}
            />
          </View>
          <View>
            <FlatList
              data={restaurantProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
              renderItem={({ item }) => <ProductCard_Large {...item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 23 }}>Món chính</Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "lightgray",
                marginLeft: 10,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 20 }}>
            {restaurantProducts?.map((product, index) => (
              <ProductCard_Small key={index} {...product} />
            ))}
          </View>
        </View>
      )}
      {isReview && (
        <View style={styles.body}>
          {/* Filters Row */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Lọc theo</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollView}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedRating === undefined &&
                    !hasImagesOnly &&
                    styles.filterChipActive,
                ]}
                onPress={() => {
                  setSelectedRating(undefined);
                  setHasImagesOnly(false);
                }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedRating === undefined &&
                      !hasImagesOnly &&
                      styles.filterChipTextActive,
                  ]}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>

              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.filterChip,
                    selectedRating === rating && styles.filterChipActive,
                  ]}
                  onPress={() => {
                    setSelectedRating(rating);
                    setHasImagesOnly(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedRating === rating && styles.filterChipTextActive,
                    ]}
                  >
                    {rating} Sao
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  hasImagesOnly && styles.filterChipActive,
                ]}
                onPress={() => {
                  setSelectedRating(undefined);
                  setHasImagesOnly(true);
                }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    hasImagesOnly && styles.filterChipTextActive,
                  ]}
                >
                  Có hình ảnh
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Reviews List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EE4D2D" />
              <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
            </View>
          ) : reviews?.items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={64}
                color="#D1D5DB"
              />
              <Text style={styles.emptyText}>Chưa có đánh giá nào phù hợp</Text>
            </View>
          ) : (
            <View style={styles.reviewsListContainer}>
              {reviews?.items.map((review) => (
                <View key={review.id} style={styles.reviewItemCard}>
                  {/* Review Header */}
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {review.userId ? "U" : "K"}
                      </Text>
                    </View>
                    <View style={styles.reviewUserMeta}>
                      <Text style={styles.userNameText}>
                        {review.userId
                          ? `Khách hàng (ID: ${review.userId.substring(0, 8)})`
                          : "Khách hàng ẩn danh"}
                      </Text>
                      <View style={styles.starsAndDate}>
                        {renderStars(review.rating)}
                        <Text style={styles.dateText}>
                          {formatDate(review.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Review Comment */}
                  {review.comment && (
                    <Text style={styles.commentText}>{review.comment}</Text>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imageScrollContainer}
                    >
                      {review.images.map((imgUri, imgIdx) => (
                        <Image
                          key={imgIdx}
                          source={{ uri: imgUri }}
                          style={styles.reviewAttachedImage}
                        />
                      ))}
                    </ScrollView>
                  )}

                  {/* Merchant Reply */}
                  {review.merchantReply && (
                    <View style={styles.merchantReplyCard}>
                      <View style={styles.merchantReplyHeader}>
                        <MaterialIcons
                          name="storefront"
                          size={16}
                          color="#EE4D2D"
                        />
                        <Text style={styles.merchantReplyTitle}>
                          Phản hồi từ Cửa hàng
                        </Text>
                        {review.repliedAt && (
                          <Text style={styles.replyDateText}>
                            {formatDate(review.repliedAt)}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.merchantReplyText}>
                        {review.merchantReply}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      {isInfo && (
        <View style={styles.body}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              Thông tin nhà hàng
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "lightgray",
                marginLeft: 10,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 20 }}>
            <Text>{restaurantData.storeDescription}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              Thời gian mở cửa
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "lightgray",
                marginLeft: 10,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 20 }}>
            <Text>
              {restaurantData.openingTime} - {restaurantData.closingTime}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              Chứng nhận hoạt động
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "lightgray",
                marginLeft: 10,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 20 }}>
            <Text>
              {restaurantData.status == "Pending"
                ? "Đang chờ xử lý"
                : restaurantData.status == "Approved"
                  ? "Đã duyệt"
                  : restaurantData.status == "Rejected"
                    ? "Đã từ chối"
                    : "Nghi ngờ"}
            </Text>
          </View>
        </View>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  restaurantinfo_container: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "90%",
    height: 110,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  restaurantname: {
    fontWeight: "bold",
    fontSize: 22,
    width: 240,
  },
  body: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "rgba(240, 240, 240, 1)",
  },
  active: {
    borderBottomWidth: 2,
    height: 35,
    borderBottomColor: "#EE4D2D",
  },
  inactive: {
    borderBottomWidth: 0,
  },
  activeText: {
    color: "#EE4D2D",
    fontWeight: "bold",
    fontSize: 15,
  },
  inactiveText: {
    color: "#c2c2c2ff",
  },
  filterSection: {
    marginBottom: 16,
    paddingTop: 8,
  },
  filterScrollView: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    marginRight: 8,
  },
  filterChipActive: {
    borderColor: "#EE4D2D",
    backgroundColor: "#FFF2ED",
  },
  filterChipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#EE4D2D",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  reviewsListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  reviewItemCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  reviewUserMeta: {
    flex: 1,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  starsAndDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    lineHeight: 20,
  },
  imageScrollContainer: {
    paddingBottom: 12,
  },
  reviewAttachedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  merchantReplyCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  merchantReplyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  merchantReplyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EE4D2D",
    marginLeft: 6,
  },
  replyDateText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginLeft: "auto",
  },
  merchantReplyText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    marginLeft: 4,
  },
});
