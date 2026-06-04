import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FeedbackCard from "@/components/features/FeedbackCard";
import type { Review } from "@/types/api";
import { useMerchantStore } from "@/store/merchantStore";
import { useMerchantReviews, useReplyReview } from "@/hooks/useMenu";
import { catalogApi } from "@/lib/api";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";
type Filter = "all" | "unreplied";

export default function FeedbacksScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const merchantId = useMerchantStore((s) => s.merchant?.id);
  const reviewsQuery = useMerchantReviews(merchantId);
  const replyReview = useReplyReview();

  const reviews: Review[] = reviewsQuery.data?.items ?? [];
  const displayed =
    filter === "unreplied"
      ? reviews.filter((r: Review) => !r.merchantReply)
      : reviews;

  const handleReply = (id: string, content: string) => {
    replyReview.mutate({ id, content });
  };
  useEffect(() => {
    if (merchantId) {
      catalogApi
        .get(`/api/catalog/reviews/merchant/${merchantId}`)
        .then((r) => console.log("REVIEWS", JSON.stringify(r.data)));
    }
  }, [merchantId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedbacks</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        refreshing={reviewsQuery.isFetching}
        onRefresh={() => reviewsQuery.refetch()}
        renderItem={({ item }) => (
          <FeedbackCard
            review={item}
            onReply={handleReply}
            replying={replyReview.isPending}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.filterRow}>
              {(["all", "unreplied"] as Filter[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterBtn,
                    filter === f && styles.filterActive,
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === f && styles.filterTextActive,
                    ]}
                  >
                    {f === "all" ? "Tất cả" : "Chưa phản hồi"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          reviewsQuery.isLoading ? (
            <ActivityIndicator color={ORANGE} style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.empty}>Chưa có đánh giá nào</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 52,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 18 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  filterText: { fontSize: 13, color: "#666", fontWeight: "500" },
  filterTextActive: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", color: "#bbb", marginTop: 40, fontSize: 15 },
});
