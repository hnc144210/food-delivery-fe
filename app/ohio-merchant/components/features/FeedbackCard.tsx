import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Review } from "@/types/api";

const ORANGE = "#E8441A";

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={13}
          color="#f59e0b"
        />
      ))}
    </View>
  );
}

type Props = {
  review: Review;
  onReply: (id: string, content: string) => void;
  replying?: boolean;
};

export default function FeedbackCard({ review, onReply, replying }: Props) {
  const replied = Boolean(review.merchantReply);
  const initial = review.userId?.[0]?.toUpperCase() ?? "U";
  const date = review.repliedAt
    ? new Date(review.repliedAt).toLocaleDateString("vi-VN")
    : "";
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Khách hàng</Text>
        </View>
        {date ? <Text style={styles.date}>{date}</Text> : null}
      </View>

      <Stars rating={review.rating} />
      <Text style={styles.comment}>{review.comment}</Text>

      {review.images && review.images.length > 0 && (
        <View style={styles.images}>
          {review.images.map((uri: string, i: number) => (
            <Image key={i} source={{ uri }} style={styles.img} />
          ))}
        </View>
      )}

      {replied && (
        <View style={styles.replyBox}>
          <Text style={styles.replyLabel}>Phản hồi của cửa hàng:</Text>
          <Text style={styles.replyContent}>{review.merchantReply}</Text>
        </View>
      )}

      {showInput && !replied && (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Nhập phản hồi của bạn..."
            multiline
            autoFocus
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              onPress={() => {
                setShowInput(false);
                setText("");
              }}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!text.trim() || replying) && { opacity: 0.5 },
              ]}
              disabled={!text.trim() || replying}
              onPress={() => {
                onReply(review.id, text.trim());
                setShowInput(false);
                setText("");
              }}
            >
              {replying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.sendText}>Gửi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.replyBtn, replied && styles.replyBtnDone]}
          onPress={() => !replied && setShowInput(true)}
        >
          <Ionicons
            name="return-down-forward-outline"
            size={14}
            color={replied ? "#22c55e" : ORANGE}
          />
          <Text style={[styles.replyText, replied && { color: "#22c55e" }]}>
            {replied ? "Đã phản hồi" : "Phản hồi"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8441A22",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "800", color: ORANGE, fontSize: 16 },
  customerInfo: { flex: 1, gap: 3 },
  customerName: { fontWeight: "700", fontSize: 14, color: "#1a1a1a" },
  date: { fontSize: 11, color: "#aaa" },
  comment: { fontSize: 14, color: "#444", lineHeight: 20 },
  images: { flexDirection: "row", gap: 8 },
  img: { width: 80, height: 80, borderRadius: 10 },
  replyBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  replyLabel: { fontSize: 12, fontWeight: "700", color: "#888" },
  replyContent: { fontSize: 13, color: "#444", lineHeight: 18 },
  inputBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  input: {
    fontSize: 14,
    color: "#1a1a1a",
    minHeight: 60,
    textAlignVertical: "top",
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  cancelText: { fontSize: 14, color: "#888" },
  sendBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  replyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  replyBtnDone: { backgroundColor: "#f0fdf4" },
  replyText: { color: ORANGE, fontWeight: "600", fontSize: 13 },
});
