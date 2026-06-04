import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  merchantService,
  type MerchantAddress,
} from "@/services/merchantService";
import { useMerchantStore } from "@/store/merchantStore";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

function AddressCard({ item }: { item: MerchantAddress }) {
  const parts = [item.addressLine, item.ward, item.district, item.city].filter(
    Boolean,
  );
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Ionicons name="location" size={18} color={ORANGE} />
      </View>
      <Text style={styles.cardText}>{parts.join(", ")}</Text>
    </View>
  );
}

export default function StoreAddressesScreen() {
  const router = useRouter();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-addresses", merchantId],
    queryFn: () => merchantService.getMerchantAddresses(merchantId!),
    enabled: Boolean(merchantId),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ cửa hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading && (
        <ActivityIndicator color={ORANGE} style={{ marginTop: 40 }} />
      )}
      {isError && <Text style={styles.errorText}>Không tải được địa chỉ</Text>}

      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AddressCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1, fontSize: 14, color: "#333", lineHeight: 20 },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 14,
  },
  errorText: {
    textAlign: "center",
    color: "#e53e3e",
    marginTop: 40,
    fontSize: 14,
  },
});
