// app/(shipper)/wallethistory.tsx
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ReturnButton } from "../../components/ui/ReturnButton";
import {
  useMyWallet,
  useMyTransactions,
  useCreateTopup,
} from "@/hooks/useWallet";
import type { WalletTransaction } from "@/services/walletService";

const RED = "#EE4D2D";

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function TransactionItem({ item }: { item: WalletTransaction }) {
  const router = useRouter();
  const isCredit = item.amount > 0;
  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    if (item.referenceType === "DELIVERY") return "bicycle";
    if (isCredit) return "arrow-down-circle";
    return "arrow-up-circle";
  };
  return (
    <TouchableOpacity
      style={styles.txItem}
      onPress={() =>
        router.push({
          pathname: "/(shipper)/transactiondetail",
          params: {
            id: item.id,
            amount: item.amount,
            balanceBefore: item.balanceBefore,
            balanceAfter: item.balanceAfter,
            referenceType: item.referenceType ?? "",
            description: item.description ?? "",
            createdAt: item.createdAt,
          },
        })
      }
    >
      <View
        style={[
          styles.txIcon,
          { backgroundColor: isCredit ? "#f0fdf4" : "#fff5f5" },
        ]}
      >
        <Ionicons
          name={getIcon()}
          size={24}
          color={isCredit ? "#20c74b" : RED}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txTitle} numberOfLines={1}>
          {item.description ?? item.referenceType ?? "Giao dịch"}
        </Text>
        <Text style={styles.txTime}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[styles.txAmount, { color: isCredit ? "#20c74b" : "#333" }]}
        >
          {isCredit ? "+" : ""}
          {formatVND(item.amount)}
        </Text>
        <Text style={styles.txBalance}>
          Số dư: {formatVND(item.balanceAfter)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function WalletHistory() {
  const router = useRouter();
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txData, isLoading: txLoading } = useMyTransactions();
  const createTopup = useCreateTopup();
  const [topupModal, setTopupModal] = useState(false);
  const [amount, setAmount] = useState("");

  const transactions = txData?.items ?? [];
  const [activeTab, setActiveTab] = useState<"ALL" | "TOPUP" | "EARNING">(
    "ALL",
  );

  const filtered = transactions.filter((t: WalletTransaction) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "TOPUP")
      return (
        t.referenceType === "TOPUP" ||
        (t.amount > 0 && t.referenceType !== "DELIVERY")
      );
    if (activeTab === "EARNING") return t.referenceType === "DELIVERY";
    return true;
  });

  function handleTopup() {
    const parsed = parseInt(amount.replace(/\D/g, ""), 10);
    if (!parsed || parsed < 10000) return;
    createTopup.mutate(
      { amount: parsed },
      {
        onSuccess: (data: { paymentUrl: string }) => {
          setTopupModal(false);
          setAmount("");
          Linking.openURL(data.paymentUrl);
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ReturnButton onpressfunction={router.back} />
        <Text style={styles.headerTitle}>Ví tài xế</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
          {walletLoading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
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

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(["ALL", "EARNING", "TOPUP"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "ALL"
                  ? "Tất cả"
                  : tab === "EARNING"
                    ? "Thu nhập"
                    : "Nạp tiền"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction List */}
        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Danh sách giao dịch</Text>
          {txLoading && (
            <ActivityIndicator color={RED} style={{ marginTop: 20 }} />
          )}
          {!txLoading && filtered.length === 0 && (
            <Text style={styles.emptyText}>Không có giao dịch nào</Text>
          )}
          {filtered.map((tx: WalletTransaction) => (
            <TransactionItem key={tx.id} item={tx} />
          ))}
        </View>
      </ScrollView>

      {/* Topup Modal */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: RED },
  balanceCard: {
    backgroundColor: RED,
    borderRadius: 20,
    padding: 24,
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
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: { backgroundColor: "#fef0ed" },
  tabText: { fontSize: 14, color: "#666", fontWeight: "500" },
  tabTextActive: { color: RED, fontWeight: "bold" },
  listCard: { backgroundColor: "white", borderRadius: 14, padding: 16, gap: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  txTime: { fontSize: 12, color: "gray", marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "bold" },
  txBalance: { fontSize: 11, color: "gray", marginTop: 2 },
  emptyText: { textAlign: "center", color: "gray", paddingVertical: 30 },
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
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
