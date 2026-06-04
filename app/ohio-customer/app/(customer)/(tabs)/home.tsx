// app/(customer)/(tabs)/home.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Image,
} from "react-native";
import { SearchBar } from "@/components/ui/SearchBar";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ReturnButton } from "@/components/ui/ReturnButton";
import { DealsOfTheDay } from "@/components/features/DealsofthedayCard";
import { NearbyRestaurant } from "@/components/features/NearbyrestaurantCard";
import { CategoriesList } from "@/components/features/CategoriesList";
import { VoucherList } from "@/components/features/VoucherList";
import { useRouter } from "expo-router";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  mock_addresses_new,
  mock_vouchers_new,
  mock_categories_new,
  mock_productdata_new,
} from "@/mock/home";
import { homeService } from "@/services/catalogService";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { CategoryTreeNodeDto } from "@/types/category";

// ─── Recursive Helpers for Category Tree ───────────────────────────────────

function findCategoryNode(
  nodes: CategoryTreeNodeDto[],
  id: string,
): CategoryTreeNodeDto | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findCategoryNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findCategoryPath(
  nodes: CategoryTreeNodeDto[],
  targetId: string,
  currentPath: CategoryTreeNodeDto[] = [],
): CategoryTreeNodeDto[] | null {
  for (const node of nodes) {
    const newPath = [...currentPath, node];
    if (node.id === targetId) {
      return newPath;
    }
    if (node.children && node.children.length > 0) {
      const path = findCategoryPath(node.children, targetId, newPath);
      if (path) return path;
    }
  }
  return null;
}

function getAllDescendantIds(node: CategoryTreeNodeDto): string[] {
  let ids = [node.id];
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      ids = ids.concat(getAllDescendantIds(child));
    }
  }
  return ids;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesFilter, setCategoriesFilter] = useState("");

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  // ─── React Query Hooks ────────────────────────────────────────────────────

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: homeService.getCategories,
  });

  const { data: categoryTree } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: homeService.getCategoryTree,
  });

  const { data: vouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: orderService.getVouchers,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: homeService.getProducts,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => userService.getAddresses(userId!),
    enabled: !!userId,
  });

  // Find default or first address to display in header
  const addressList = addresses?.items || [];
  const addressLabel =
    addressList?.find((addr) => addr.isDefault)?.label ||
    addressList[0]?.label ||
    "Chưa có địa chỉ";

  const categoryList = categories?.items || [];

  const handlePressSearch = () => {
    router.push({
      pathname: "/(customer)/searchresult",
      params: { searchQuery },
    });
  };

  // ─── Tree-based Product Filtering and Tree Rendering ─────────────────────

  const activeNode =
    categoryTree && categoriesFilter
      ? findCategoryNode(categoryTree, categoriesFilter)
      : null;

  const categoryPath =
    categoryTree && categoriesFilter
      ? findCategoryPath(categoryTree, categoriesFilter)
      : null;

  // Get all descendant category IDs (including the selected category itself)
  const allowedCategoryIds = activeNode
    ? getAllDescendantIds(activeNode)
    : categoriesFilter
      ? [categoriesFilter]
      : [];

  // Filter products recursively based on the category subtree
  const allProducts = (products?.items || []).filter(
    (p) => p.isAvailable !== false,
  );
  const filteredProducts =
    categoriesFilter !== ""
      ? allProducts.filter(
          (p) => p.categoryId && allowedCategoryIds.includes(p.categoryId),
        )
      : allProducts;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/**header */}
        <View style={styles.header}>
          {!isSearching && (
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => router.push("/(customer)/addresses")}
              >
                <EvilIcons name="location" size={20} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  Nơi giao hàng: {addressLabel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign
                  name="shopping-cart"
                  size={20}
                  color="white"
                  onPress={() => router.navigate("/(customer)/(tabs)/cart")}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 10,
            }}
          >
            {isSearching && (
              <ReturnButton
                onpressfunction={() => {
                  setIsSearching(false);
                }}
              />
            )}
            <SearchBar
              value={searchQuery}
              onChangeText={(e) => setSearchQuery(e)}
              onPressfunction={() => {
                setIsSearching(true);
              }}
              onSubmit={handlePressSearch}
            />
          </View>
        </View>

        {/**body */}
        {!isSearching && (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {categoriesFilter === "" ? (
              <View style={{ flexDirection: "column", gap: 10 }}>
                {/**vouchers */}
                <VoucherList vouchers={vouchers?.items || mock_vouchers_new} />

                {/**categories */}
                <CategoriesList
                  categories={categoryList}
                  onCategorySelected={(categoryId) =>
                    setCategoriesFilter(categoryId)
                  }
                />

                {/**products */}
                <DealsOfTheDay
                  dealoftheday={allProducts}
                  title="Món ăn đặc biệt hôm nay"
                  categoryfilter={categoriesFilter}
                />
                <NearbyRestaurant
                  nearbyrestaurants={allProducts}
                  title="Nhà hàng lân cận"
                  categoryfilter={categoriesFilter}
                />
              </View>
            ) : (
              <View style={{ flexDirection: "column", gap: 16 }}>
                {/* Category Header with Back Button */}
                <View style={styles.categoryTitleRow}>
                  <TouchableOpacity
                    style={styles.backButtonCircle}
                    onPress={() => setCategoriesFilter("")}
                  >
                    <AntDesign name="arrow-left" size={20} color="#1F2937" />
                  </TouchableOpacity>
                  <Text style={styles.categoryTitleText}>
                    {activeNode?.name ||
                      categoryList.find((ca) => ca.id === categoriesFilter)
                        ?.name}
                  </Text>
                  <View style={{ width: 40 }} />
                </View>

                {/* Breadcrumbs Path */}
                {categoryPath && categoryPath.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.breadcrumbsContainer}
                  >
                    <TouchableOpacity onPress={() => setCategoriesFilter("")}>
                      <Text style={styles.breadcrumbItemText}>Tất cả</Text>
                    </TouchableOpacity>
                    {categoryPath.map((pathNode, idx) => (
                      <View
                        key={pathNode.id}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <AntDesign
                          name="right"
                          size={10}
                          color="#9CA3AF"
                          style={{ marginHorizontal: 6 }}
                        />
                        <TouchableOpacity
                          onPress={() => setCategoriesFilter(pathNode.id)}
                          disabled={idx === categoryPath.length - 1}
                        >
                          <Text
                            style={[
                              styles.breadcrumbItemText,
                              idx === categoryPath.length - 1 &&
                                styles.breadcrumbItemActiveText,
                            ]}
                          >
                            {pathNode.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {/* Children Tree rendering (tree của nó) */}
                {activeNode &&
                  activeNode.children &&
                  activeNode.children.length > 0 && (
                    <View style={styles.subtreeCard}>
                      <Text style={styles.subtreeHeader}>Danh mục phụ</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.subtreeScrollView}
                      >
                        {activeNode.children.map((childNode) => (
                          <TouchableOpacity
                            key={childNode.id}
                            style={styles.subtreeChip}
                            onPress={() => setCategoriesFilter(childNode.id)}
                          >
                            <View style={styles.subtreeChipIconPlaceholder}>
                              {childNode.iconUrl ? (
                                <Image
                                  source={{ uri: childNode.iconUrl }}
                                  style={styles.subtreeChipIcon}
                                />
                              ) : (
                                <AntDesign
                                  name="appstore"
                                  size={16}
                                  color="#EE4D2D"
                                />
                              )}
                            </View>
                            <Text style={styles.subtreeChipText}>
                              {childNode.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                {/* Filtered Products List */}
                <View style={{ flexDirection: "column", gap: 10 }}>
                  {filteredProducts.length === 0 ? (
                    <View style={styles.emptyProductsContainer}>
                      <AntDesign name="inbox" size={48} color="#D1D5DB" />
                      <Text style={styles.emptyProductsText}>
                        Chưa có sản phẩm nào trong danh mục này
                      </Text>
                    </View>
                  ) : (
                    <>
                      <DealsOfTheDay
                        dealoftheday={filteredProducts}
                        title="Sản phẩm nổi bật"
                        categoryfilter=""
                      />
                      <NearbyRestaurant
                        nearbyrestaurants={filteredProducts}
                        title="Nhà hàng lân cận"
                        categoryfilter=""
                      />
                    </>
                  )}
                </View>
              </View>
            )}
            <View style={{ height: 80, width: "100%" }} />
          </ScrollView>
        )}
        {isSearching && (
          <View style={styles.body}>
            <CategoriesList
              categories={categoryList}
              onCategorySelected={(categoryId) => {
                setIsSearching(false);
                setCategoriesFilter(categoryId);
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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

  //header
  header: {
    flexDirection: "column",
    backgroundColor: "#EE4D2D",
    width: "100%",
    height: "auto",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 8,
  },

  //body
  body: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    padding: 20,
  },

  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EE4D2D",
    textAlign: "center",
  },

  breadcrumbsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  breadcrumbItemText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  breadcrumbItemActiveText: {
    color: "#EE4D2D",
    fontWeight: "700",
  },

  subtreeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  subtreeHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  subtreeScrollView: {
    gap: 12,
    paddingBottom: 4,
  },
  subtreeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0ED",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFEBE7",
    gap: 8,
  },
  subtreeChipIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  subtreeChipIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  subtreeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EE4D2D",
  },

  emptyProductsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "white",
    borderRadius: 16,
  },
  emptyProductsText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
