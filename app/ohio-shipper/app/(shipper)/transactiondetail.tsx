import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TransactionDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const amount = Number(params.amount ?? 0);
  const isCredit = amount > 0;

  const formatCurrency = (value: number) => value.toLocaleString("vi-VN") + "đ";

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#EE4D2D" }}>
          Chi tiết giao dịch
        </Text>
      </View>

      <ScrollView
        style={{ width: "100%", padding: 20 }}
        contentContainerStyle={{ rowGap: 20 }}
      >
        <View
          style={[
            styles.smallcontainer,
            { alignItems: "center", paddingVertical: 30 },
          ]}
        >
          <Ionicons
            name={isCredit ? "checkmark-circle" : "arrow-up-circle"}
            size={48}
            color={isCredit ? "#20c74b" : "#EE4D2D"}
          />
          <Text
            style={[
              styles.statusText,
              { color: isCredit ? "#20c74b" : "#EE4D2D" },
            ]}
          >
            {isCredit ? "Tiền vào" : "Tiền ra"}
          </Text>
          <Text style={styles.amountLabel}>SỐ TIỀN GIAO DỊCH</Text>
          <Text
            style={[
              styles.amountDisplay,
              { color: isCredit ? "#20c74b" : "#333" },
            ]}
          >
            {isCredit ? "+" : ""}
            {formatCurrency(amount)}
          </Text>
        </View>

        <View style={styles.smallcontainer}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Thông tin chi tiết
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loại giao dịch</Text>
            <Text style={styles.detailValue}>
              {params.referenceType ?? "—"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số dư trước</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(Number(params.balanceBefore ?? 0))}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số dư sau</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(Number(params.balanceAfter ?? 0))}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã giao dịch</Text>
            <Text style={[styles.detailValue, { fontFamily: "monospace" }]}>
              {params.id}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian</Text>
            <Text style={styles.detailValue}>
              {formatDate(params.createdAt as string)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View
            style={[
              styles.detailRow,
              { flexDirection: "column", alignItems: "flex-start", gap: 6 },
            ]}
          >
            <Text style={styles.detailLabel}>Nội dung</Text>
            <Text
              style={[
                styles.detailValue,
                { fontWeight: "normal", color: "#555" },
              ]}
            >
              {params.description ?? params.referenceType ?? "—"}
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
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
    backgroundColor: "white",
    width: "100%",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  smallcontainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 14,
    padding: 20,
    gap: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 11,
    color: "gray",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  amountDisplay: { fontSize: 32, fontWeight: "bold", marginTop: 5 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: { fontSize: 14, color: "gray" },
  detailValue: { fontSize: 15, fontWeight: "bold", color: "#333" },
  divider: { height: 1, backgroundColor: "#f5f5f5", marginVertical: 4 },
});
