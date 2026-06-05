import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMerchantStore } from "@/store/merchantStore";
import { useToggleStoreOpen } from "@/hooks/useMerchantProfile";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import type { AppNotification } from "@/services/notificationService";

const ORANGE = "#E8441A";

export default function MerchantHeader() {
  const router = useRouter();
  const { isOpen, toggle } = useToggleStoreOpen();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      notificationService.getNotifications({ PageSize: 20, PageIndex: 1 }),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const unreadCount = (
    (data?.items ?? []) as unknown as AppNotification[]
  ).filter((n) => !n.isRead).length;

  return (
    <View style={styles.header}>
      {/* Toggle bên trái */}
      <View style={styles.toggleWrapper}>
        <Switch
          value={isOpen}
          onValueChange={toggle}
          trackColor={{ false: "#DDD", true: ORANGE }}
          thumbColor="#fff"
          style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
        />
        <Text style={[styles.toggleLabel, { color: isOpen ? ORANGE : "#AAA" }]}>
          {isOpen ? "MỞ CỬA" : "ĐÓNG CỬA"}
        </Text>
      </View>

      {/* Logo ở giữa */}
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Chuông bên phải */}
      <TouchableOpacity
        style={styles.bellBtn}
        onPress={() => router.push("/(merchant)/notifications")}
      >
        <Ionicons name="notifications-outline" size={24} color="#1a1a1a" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  toggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 80,
  },
  toggleLabel: { fontSize: 11, fontWeight: "700" },
  logo: { height: 32, width: 120 },
  bellBtn: { width: 80, alignItems: "flex-end" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: ORANGE,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
