// app/ohio-merchant/app/(merchant)/(tabs)/menu.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DishCard from "@/components/features/DishCard";
import { useMerchantStore } from "@/store/merchantStore";
import {
  useCategories,
  useMyProducts,
  useUpdateProductAvailability,
} from "@/hooks/useMenu";
import type { Product } from "@/types/api";
import type { Dish } from "@/mock/menu";
import MerchantHeader from "@/components/common/MerchantHeader";

const ORANGE = "#E8441A";

type CategoryTab = {
  id: string;
  name: string;
};

function mapProductToDish(product: Product, categoryName?: string): Dish {
  const sizeOption = product.options?.find((option) =>
    option.name.toLowerCase().includes("size"),
  );

  const toppingOption = product.options?.find((option) =>
    option.name.toLowerCase().includes("topping"),
  );

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.discountPrice || product.basePrice,
    category: product.categoryId ?? "uncategorized",
    isAvailable: product.isAvailable,
    allowCustomerNotes: true,
    sizes:
      sizeOption?.values.map((value, index) => ({
        id: value.id ?? `${product.id}-size-${index}`,
        name: value.name,
      })) ?? [],
    toppings:
      toppingOption?.values.map((value, index) => ({
        id: value.id ?? `${product.id}-topping-${index}`,
        name: value.name,
        price: value.additionalPrice,
      })) ?? [],
  };
}

export default function MenuScreen() {
  const { merchant } = useMerchantStore();
  const router = useRouter();
  const { isOpen, setIsOpen } = useMerchantStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categoriesQuery = useCategories({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const productsQuery = useMyProducts();
  const updateAvailability = useUpdateProductAvailability();

  const categories: CategoryTab[] = useMemo(
    () => [
      { id: "all", name: "Tất cả" },
      ...(categoriesQuery.data?.map((cat) => ({
        id: cat.id,
        name: cat.name,
      })) ?? []),
    ],
    [categoriesQuery.data],
  );

  const dishes = useMemo(() => {
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    return (
      productsQuery.data?.map((product) =>
        mapProductToDish(
          product,
          product.categoryId ? categoryMap.get(product.categoryId) : undefined,
        ),
      ) ?? []
    );
  }, [categories, productsQuery.data]);

  const filteredDishes = dishes.filter((dish) => {
    const matchCategory =
      activeCategory === "all" || dish.category === activeCategory;
    const matchSearch = dish.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  function handleToggleAvailable(id: string, value: boolean) {
    updateAvailability.mutate({ id, isAvailable: value });
  }

  function handlePressCard(id: string) {
    router.push({ pathname: "/(merchant)/product-detail", params: { id } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MerchantHeader />

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#AAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm món ăn..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onToggleAvailable={handleToggleAvailable}
            onPress={handlePressCard}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={productsQuery.isFetching || categoriesQuery.isFetching}
        onRefresh={() => {
          productsQuery.refetch();
          categoriesQuery.refetch();
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không tìm thấy món ăn</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(merchant)/add-dish")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1A1A1A" },
  layoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  layoutBtnText: { fontSize: 12, color: ORANGE, fontWeight: "600" },
  tabWrapper: {
    height: 52,
    backgroundColor: "#fff",
  },
  tabList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
  },
  tabActive: { backgroundColor: "#FEF3E8" },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#AAA",
    textAlign: "center",
  },
  tabLabelActive: { color: ORANGE },
  listContent: { paddingTop: 12, paddingBottom: 100 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 15, color: "#BBB", fontWeight: "500" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
});
