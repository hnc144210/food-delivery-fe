import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useProduct } from "@/hooks/useMenu";

const ORANGE = "#E8441A";

export default function MerchantProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id);

  if (isLoading)
    return <ActivityIndicator style={{ flex: 1 }} color={ORANGE} />;
  if (!product) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết món</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(merchant)/add-dish",
              params: { dishId: id },
            })
          }
        >
          <Text style={{ color: ORANGE, fontWeight: "700", fontSize: 15 }}>
            Sửa
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.image,
              {
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons name="image-outline" size={48} color="#ccc" />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            {product.basePrice.toLocaleString("vi-VN")}đ
          </Text>
          {product.description ? (
            <Text style={styles.desc}>{product.description}</Text>
          ) : null}
          <Text
            style={[
              styles.badge,
              { color: product.isAvailable ? "#10B981" : "#AAA" },
            ]}
          >
            {product.isAvailable ? "● AVAILABLE" : "● UNAVAILABLE"}
          </Text>
        </View>

        {product.options?.map((opt) => (
          <View key={opt.id ?? opt.name} style={styles.card}>
            <Text style={styles.optionTitle}>
              {opt.name} {opt.isRequired ? "(bắt buộc)" : "(tùy chọn)"}
            </Text>
            {opt.values.map((v, i) => (
              <View key={v.id ?? i} style={styles.optionRow}>
                <Text style={styles.optionName}>{v.name}</Text>
                {v.additionalPrice > 0 && (
                  <Text style={styles.optionPrice}>
                    +{v.additionalPrice.toLocaleString("vi-VN")}đ
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  image: { width: "100%", height: 220, borderRadius: 16, marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontSize: 22, fontWeight: "800", color: "#1a1a1a" },
  price: { fontSize: 18, fontWeight: "700", color: ORANGE, marginTop: 4 },
  desc: { fontSize: 14, color: "#888", marginTop: 8, lineHeight: 20 },
  badge: { fontSize: 12, fontWeight: "700", marginTop: 10 },
  optionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  optionName: { fontSize: 14, color: "#333" },
  optionPrice: { fontSize: 14, color: "#888" },
});
