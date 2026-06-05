import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { RestaurantCardData } from "@/types";
import { ProductCard_Medium } from "./ProductCard";
import { useRouter } from "expo-router";
import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/catalogService";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export function RestaurantCard({
  id,
  searchQuery,
}: {
  id: string;
  searchQuery: string;
}) {
  const router = useRouter();

  const { data: merchant, isLoading } = useQuery({
    queryKey: ["merchant", id],
    queryFn: () => userService.getMerchantProfile(id),
  });

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id, searchQuery],
    queryFn: () => homeService.getProductsWithSearch(),
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => homeService.getMerchantReview(id),
  });

  if (isProductLoading || isLoading || isReviewsLoading) {
    return <ActivityIndicator size="large" color="#EE4D2D" />;
  }

  const filteredProduct =
    product?.items.filter(
      (item) =>
        item.merchantId === id &&
        item.isAvailable !== false &&
        normalizeText(item.name ?? "").includes(normalizeText(searchQuery)),
    ) || [];

  const averageRating = reviews?.items
    ? reviews?.items?.reduce((acc, review) => acc + review.rating, 0) /
      (reviews?.items?.length ?? 1)
    : 0;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.name}>{merchant?.storeName}</Text>
        <TouchableOpacity
          onPress={() => {
            router.push({ pathname: "/(customer)/restaurant", params: { id } });
          }}
        >
          <Text style={styles.menu_button}>Menu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.restaurantinfo}>
        <Text>
          <AntDesign name="star" size={10} color="#B22203" /> {averageRating} (
          {reviews?.items?.length})
        </Text>
        <Text>
          <AntDesign name="clock-circle" size={10} color="black" />{" "}
          {merchant?.avgPrepTime} mins
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <FlatList
          data={filteredProduct}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item }) => <ProductCard_Medium {...item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menu_button: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B22203",
  },
  restaurantinfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 8,
  },
});
