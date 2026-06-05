import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "../../components/ui/SearchBar";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { RestaurantCard } from "../../components/features/RestaurantCard";
import { mock_nearbyrestaurant } from "../../mock/home";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/catalogService";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function SearchResult() {
  const { searchQuery: search } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFinalQuery, setSearchFinalQuery] = useState(
    (search as string) || "",
  );
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(search as string);
    setSearchFinalQuery(search as string);
  }, [search]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: homeService.getProducts,
  });

  const filteredProducts =
    products?.items?.filter(
      (product) =>
        product.isAvailable !== false &&
        product.name?.toLowerCase().includes(searchFinalQuery.toLowerCase()),
    ) || [];

  const filteredMerchants = [
    ...new Set(
      filteredProducts.map((product) => {
        return product.merchantId;
      }),
    ),
  ];

  const searchHandle = () => {
    setSearchFinalQuery(searchQuery);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={searchHandle}
        />
      </View>
      <ScrollView style={styles.body}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#EE4D2D" />
        ) : filteredMerchants.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              paddingTop: 160,
            }}
          >
            <Feather name="shopping-cart" size={60} color="#9ca3af" />
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#9ca3af" }}
            >
              Không có sản phẩm phù hợp
            </Text>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            {filteredMerchants.map((item, index) => (
              <RestaurantCard
                key={index}
                id={item}
                searchQuery={searchFinalQuery}
              />
            ))}
          </View>
        )}
        <View style={{ height: 80, width: "100%" }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  body: {
    paddingHorizontal: 20,
    flex: 1,
    width: "100%",
  },
});
