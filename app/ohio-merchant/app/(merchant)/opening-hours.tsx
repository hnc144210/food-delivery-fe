// app/ohio-merchant/app/(merchant)/opening-hours.tsx
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMerchantStore } from "@/store/merchantStore";
import { useUpdateMerchant } from "@/hooks/useMerchantProfile";

const ORANGE = "#E8441A";

export default function OpeningHoursScreen() {
  const router = useRouter();
  const { merchant } = useMerchantStore();
  const updateMerchant = useUpdateMerchant();

  const [openTime, setOpenTime] = useState(
    merchant?.openingTime?.slice(0, 5) ?? "07:00",
  );
  const [closeTime, setCloseTime] = useState(
    merchant?.closingTime?.slice(0, 5) ?? "22:00",
  );

  const handleSave = () => {
    updateMerchant.mutate(
      {
        openingTime: `${openTime}:00`,
        closingTime: `${closeTime}:00`,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giờ mở cửa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Thiết lập giờ hoạt động chung cho cửa hàng
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Giờ mở cửa</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={styles.timeInput}
              value={openTime}
              onChangeText={setOpenTime}
              maxLength={5}
              keyboardType="numbers-and-punctuation"
              placeholder="07:00"
            />
            <Text style={styles.sep}>–</Text>
            <TextInput
              style={styles.timeInput}
              value={closeTime}
              onChangeText={setCloseTime}
              maxLength={5}
              keyboardType="numbers-and-punctuation"
              placeholder="22:00"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, updateMerchant.isPending && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={updateMerchant.isPending}
        >
          {updateMerchant.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Lưu giờ mở cửa</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, paddingBottom: 110 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 18 },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  cardLabel: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1a1a1a",
    width: 80,
    textAlign: "center",
  },
  sep: { fontSize: 18, color: "#aaa" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
