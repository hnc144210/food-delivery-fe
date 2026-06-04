import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  type AppNotification,
} from "@/services/notificationService";

const ORANGE = "#EE4D2D";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function NotificationItem({
  item,
  onRead,
}: {
  item: AppNotification;
  onRead: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.item, !item.isRead && styles.itemUnread]}
      onPress={() => !item.isRead && onRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.dot, item.isRead && styles.dotRead]} />
      <View style={styles.itemContent}>
        <Text
          style={[styles.itemTitle, !item.isRead && styles.itemTitleUnread]}
        >
          {item.title}
        </Text>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationScreen() {
  const qc = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      notificationService.getNotifications({ PageSize: 50, PageIndex: 0 }),
    staleTime: 30 * 1000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            {unreadCount} thông báo chưa đọc
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onRead={(id) => markRead.mutate(id)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[ORANGE]}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={ORANGE} style={{ marginTop: 60 }} />
          ) : (
            <View style={styles.empty}>
              <Ionicons
                name="notifications-off-outline"
                size={56}
                color="#ddd"
              />
              <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: ORANGE,
    width: "100%",
    gap: 8,
  },
  headerTitle: { fontSize: 23, fontWeight: "bold", color: "white" },
  badge: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: ORANGE },
  unreadBanner: {
    backgroundColor: "#FEF3E8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fde8d0",
  },
  unreadText: { fontSize: 13, color: ORANGE, fontWeight: "600" },
  list: { padding: 12, gap: 8 },
  item: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemUnread: { backgroundColor: "#fff7f5" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginTop: 5,
    flexShrink: 0,
  },
  dotRead: { backgroundColor: "#e0e0e0" },
  itemContent: { flex: 1, gap: 3 },
  itemTitle: { fontSize: 14, fontWeight: "600", color: "#555" },
  itemTitleUnread: { color: "#1a1a1a" },
  itemBody: { fontSize: 13, color: "#888", lineHeight: 18 },
  itemTime: { fontSize: 11, color: "#bbb", marginTop: 2 },
  empty: { alignItems: "center", marginTop: 100, gap: 12 },
  emptyText: { fontSize: 15, color: "#bbb" },
});
