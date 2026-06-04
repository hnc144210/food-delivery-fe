// app/ohio-merchant/app/(merchant)/category-layout.tsx
import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories, useMyProducts } from "@/hooks/useMenu";

const ORANGE = "#E8441A";

export default function CategoryLayoutScreen() {
  const router = useRouter();
  const categoriesQuery = useCategories({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const productsQuery = useMyProducts();
  const cats = categoriesQuery.data ?? [];

  const itemCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of productsQuery.data ?? []) {
      if (p.categoryId) {
        map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
      }
    }
    return map;
  }, [productsQuery.data]);

  if (categoriesQuery.isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={ORANGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {cats.length === 0 && (
          <Text style={styles.empty}>Chưa có danh mục nào</Text>
        )}
        {cats.map((cat) => (
          <View key={cat.id} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catMeta}>
                {itemCountByCategory.get(cat.id) ?? 0} sản phẩm
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  info: { flex: 1 },
  catName: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  catMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  empty: { textAlign: "center", color: "#bbb", marginTop: 40, fontSize: 15 },
});
