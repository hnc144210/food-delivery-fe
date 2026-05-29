import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Review } from '@/mock/feedbacks';

const ORANGE = '#E8441A';

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={13} color="#f59e0b" />
      ))}
    </View>
  );
}

type Props = { review: Review; onReply: (id: string) => void };

export default function FeedbackCard({ review, onReply }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.customerName[0]}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{review.customerName}</Text>
          {review.isVerified && (
            <View style={styles.verified}>
              <Ionicons name="checkmark-circle" size={11} color="#22c55e" />
              <Text style={styles.verifiedText}>Verified Purchase</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{review.date}</Text>
      </View>

      <Stars rating={review.rating} />
      <Text style={styles.comment}>{review.comment}</Text>

      {review.images && review.images.length > 0 && (
        <View style={styles.images}>
          {review.images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.img} />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.replyBtn, review.replied && styles.replyBtnDone]}
          onPress={() => onReply(review.id)}
        >
          <Ionicons name="return-down-forward-outline" size={14} color={review.replied ? '#22c55e' : ORANGE} />
          <Text style={[styles.replyText, review.replied && { color: '#22c55e' }]}>
            {review.replied ? 'Đã phản hồi' : 'Phản hồi'}
          </Text>
        </TouchableOpacity>
        <View style={styles.likes}>
          <Ionicons name="thumbs-up-outline" size={14} color="#aaa" />
          <Text style={styles.likeCount}>{review.likes}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, gap: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  header:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  avatar:       { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8441A22', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontWeight: '800', color: ORANGE, fontSize: 16 },
  customerInfo: { flex: 1, gap: 3 },
  customerName: { fontWeight: '700', fontSize: 14, color: '#1a1a1a' },
  verified:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { fontSize: 11, color: '#22c55e', fontWeight: '500' },
  date:         { fontSize: 11, color: '#aaa' },
  comment:      { fontSize: 14, color: '#444', lineHeight: 20 },
  images:       { flexDirection: 'row', gap: 8 },
  img:          { width: 80, height: 80, borderRadius: 10 },
  footer:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  replyBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF3E8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  replyBtnDone: { backgroundColor: '#f0fdf4' },
  replyText:    { color: ORANGE, fontWeight: '600', fontSize: 13 },
  likes:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likeCount:    { fontSize: 13, color: '#aaa' },
});