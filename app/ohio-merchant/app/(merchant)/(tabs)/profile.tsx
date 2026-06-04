//app/ohio-merchant/app/(merchant)/(tabs)/profile.tsx
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMerchantStore } from "@/store/merchantStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToggleStoreOpen } from "@/hooks/useMerchantProfile";
import { useLogout } from "@/hooks/useAuth";
import { useFileUrl } from "@/hooks/useFileUrl";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function MenuItem({ icon, label, value, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? "#e53e3e" : ORANGE} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: "#e53e3e" }]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {!danger && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { merchant } = useMerchantStore();
  const { data: logoUrl } = useFileUrl(merchant?.storeLogoFileKey ?? null);
  const { isOpen, toggle } = useToggleStoreOpen();
  const logout = useLogout();
  const [notifications, setNotifications] = useState(true);

  const openingTime = merchant?.openingTime?.slice(0, 5) ?? "07:00";
  const closingTime = merchant?.closingTime?.slice(0, 5) ?? "22:00";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={["top"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.storeCard}>
          <View style={styles.avatar}>
            {logoUrl ? (
              <Image source={{ uri: logoUrl }} style={styles.storeLogo} />
            ) : (
              <Ionicons name="storefront" size={32} color={ORANGE} />
            )}
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>
              {merchant?.storeName ?? "Cửa hàng"}
            </Text>
            <Text style={styles.storeAddress}>
              {merchant?.storeDescription ?? ""}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>4.8 · 1,248 đơn</Text>
            </View>
          </View>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isOpen ? "#22c55e" : "#ccc" },
              ]}
            />
            <View>
              <Text style={styles.toggleLabel}>Trạng thái cửa hàng</Text>
              <Text style={styles.toggleSub}>
                {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
              </Text>
            </View>
          </View>
          <Switch
            value={isOpen}
            onValueChange={toggle}
            trackColor={{ false: "#e0e0e0", true: ORANGE }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionLabel}>Cửa hàng</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="create-outline"
            label="Thông tin cửa hàng"
            onPress={() => router.push("/(merchant)/store-info")}
          />
          <MenuItem
            icon="location-outline"
            label="Địa chỉ cửa hàng"
            onPress={() => router.push("/(merchant)/store-addresses")}
          />
          <MenuItem
            icon="time-outline"
            label="Giờ mở cửa"
            value={`${openingTime} – ${closingTime}`}
            onPress={() => router.push("/(merchant)/opening-hours")}
          />
          <MenuItem
            icon="chatbubble-ellipses-outline"
            label="Phản hồi khách hàng"
            onPress={() => router.push("/(merchant)/feedbacks")}
          />
          <MenuItem
            icon="grid-outline"
            label="Sắp xếp danh mục"
            onPress={() => router.push("/(merchant)/category-layout")}
          />
        </View>

        <Text style={styles.sectionLabel}>Tài khoản</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="wallet-outline"
            label="Ví của tôi"
            onPress={() => router.push("/(merchant)/wallet")}
          />
          <MenuItem
            icon="person-outline"
            label="Thông tin cá nhân"
            onPress={() => router.push("/(merchant)/personal-info")}
          />
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={18} color={ORANGE} />
            </View>
            <Text style={styles.menuLabel}>Thông báo</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e0e0e0", true: ORANGE }}
              thumbColor="#fff"
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </View>
          <MenuItem
            icon="lock-closed-outline"
            label="Đổi mật khẩu"
            onPress={() => router.push("/(auth)/change-password")}
          />
        </View>

        <Text style={styles.sectionLabel}>Hỗ trợ</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="help-circle-outline"
            label="Trung tâm hỗ trợ"
            onPress={() => {}}
          />
          <MenuItem
            icon="document-text-outline"
            label="Điều khoản & Chính sách"
            onPress={() => {}}
          />
          <MenuItem
            icon="information-circle-outline"
            label="Phiên bản"
            value="1.0.0"
          />
        </View>

        <View style={styles.menuGroup}>
          <MenuItem
            icon="log-out-outline"
            label="Đăng xuất"
            danger
            onPress={() => logout.mutate()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  storeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  storeInfo: { flex: 1, gap: 3 },
  storeName: { fontSize: 18, fontWeight: "800", color: "#1a1a1a" },
  storeAddress: { fontSize: 13, color: "#888" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontSize: 13, color: "#666", fontWeight: "600" },
  toggleCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  toggleSub: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  menuGroup: { backgroundColor: "#fff", borderRadius: 14, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: "#fff0f0" },
  menuLabel: { flex: 1, fontSize: 15, color: "#1a1a1a", fontWeight: "500" },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { fontSize: 13, color: "#aaa" },
  avatarImage: { width: 64, height: 64, borderRadius: 16 },
  storeLogo: { width: 64, height: 64, borderRadius: 16 },
});
