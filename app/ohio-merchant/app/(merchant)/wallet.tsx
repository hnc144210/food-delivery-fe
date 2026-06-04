import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { WalletTransaction } from "@/services/walletService";
import { useState } from "react";
import { Linking, Modal, TextInput } from "react-native";
import {
  useMyWallet,
  useMyTransactions,
  useCreateTopup,
} from "@/hooks/useWallet";
const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function TransactionItem({ item }: { item: WalletTransaction }) {
  const isCredit = item.amount > 0;
  return (
    <View style={styles.txItem}>
      <View
        style={[
          styles.txIcon,
          { backgroundColor: isCredit ? "#f0fdf4" : "#fff5f5" },
        ]}
      >
        <Ionicons
          name={isCredit ? "arrow-down" : "arrow-up"}
          size={18}
          color={isCredit ? "#22c55e" : "#ef4444"}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc} numberOfLines={1}>
          {item.description ?? item.referenceType ?? "Giao dịch"}
        </Text>
        <Text style={styles.txDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text
        style={[styles.txAmount, { color: isCredit ? "#22c55e" : "#ef4444" }]}
      >
        {isCredit ? "+" : ""}
        {formatVND(item.amount)}
      </Text>
    </View>
  );
}

export default function WalletScreen() {
  const router = useRouter();
  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
  } = useMyWallet();
  const { data: txData, isLoading: txLoading } = useMyTransactions();
  const [topupModal, setTopupModal] = useState(false);
  const [amount, setAmount] = useState("");
  const createTopup = useCreateTopup();

  function handleTopup() {
    const parsed = parseInt(amount.replace(/\D/g, ""), 10);
    if (!parsed || parsed < 10000) return;
    createTopup.mutate(
      { amount: parsed },
      {
        onSuccess: (data) => {
          setTopupModal(false);
          setAmount("");
          Linking.openURL(data.paymentUrl);
        },
      },
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={txData?.items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
              {walletLoading ? (
                <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
              ) : walletError ? (
                <Text style={styles.balanceError}>Không tải được số dư</Text>
              ) : (
                <Text style={styles.balanceAmount}>
                  {formatVND(wallet?.balance ?? 0)}
                </Text>
              )}
              <TouchableOpacity
                style={styles.topupBtn}
                onPress={() => setTopupModal(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={styles.topupBtnText}>Nạp tiền</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Lịch sử giao dịch</Text>
            {txLoading && (
              <ActivityIndicator color={ORANGE} style={{ marginTop: 20 }} />
            )}
          </>
        }
        ListEmptyComponent={
          !txLoading ? (
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        style={{ flex: 1 }}
      />
      <Modal
        visible={topupModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTopupModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTopupModal(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Nạp tiền vào ví</Text>
          <Text style={styles.modalLabel}>Số tiền (tối thiểu 10,000đ)</Text>
          <TextInput
            style={styles.modalInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="VD: 100000"
            keyboardType="numeric"
            autoFocus
          />
          <View style={styles.quickAmounts}>
            {[50000, 100000, 200000, 500000].map((v) => (
              <TouchableOpacity
                key={v}
                style={styles.quickBtn}
                onPress={() => setAmount(v.toString())}
              >
                <Text style={styles.quickBtnText}>
                  {(v / 1000).toFixed(0)}K
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              createTopup.isPending && { opacity: 0.7 },
            ]}
            onPress={handleTopup}
            disabled={createTopup.isPending}
          >
            {createTopup.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Tiếp tục thanh toán</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
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
  listContent: { padding: 16, paddingBottom: 40 },
  balanceCard: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginTop: 6,
  },
  balanceError: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  txItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  txDate: { fontSize: 12, color: "#aaa", marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: "700" },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 14,
  },
  topupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topupBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  modalLabel: { fontSize: 13, color: "#666" },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  quickAmounts: { flexDirection: "row", gap: 8 },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  quickBtnText: { fontSize: 13, fontWeight: "600", color: "#444" },
  confirmBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
