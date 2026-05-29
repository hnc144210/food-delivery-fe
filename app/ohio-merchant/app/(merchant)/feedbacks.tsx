import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockReviews, mockDishSummaries, type Review } from '@/mock/feedbacks';
import FeedbackCard from '@/components/features/FeedbackCard';

const ORANGE = '#E8441A';
const CREAM  = '#FEF3E8';
type Filter = 'all' | 'unreplied';

export default function FeedbacksScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const displayed = filter === 'unreplied' ? reviews.filter(r => !r.replied) : reviews;

  const handleReply = (id: string) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r));

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
        keyExtractor={r => r.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <FeedbackCard review={item} onReply={handleReply} />}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Customer Feedback</Text>
            <Text style={styles.subtitle}>Real-time analytics and dish-level metrics curated from your diners.</Text>

            {/* Dish summaries */}
            {mockDishSummaries.map(d => (
              <View key={d.id} style={styles.dishRow}>
                <View style={styles.dishLeft}>
                  <View style={styles.dishIcon}>
                    <Ionicons name="fast-food-outline" size={18} color={ORANGE} />
                  </View>
                  <View>
                    <Text style={styles.dishName}>{d.name}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={11} color="#f59e0b" />
                      <Text style={styles.ratingText}>{d.rating}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.countBox}>
                  <Text style={styles.countNum}>{d.totalReviews.toLocaleString()}</Text>
                  <Text style={styles.countLabel}>reviews</Text>
                </View>
              </View>
            ))}

            {/* Filters */}
            <View style={styles.filterRow}>
              {(['all', 'unreplied'] as Filter[]).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterBtn, filter === f && styles.filterActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                    {f === 'all' ? 'Tất cả' : 'Chưa phản hồi'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f5f5f5' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 52, backgroundColor: '#fff' },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  content:         { padding: 16, paddingBottom: 32 },
  title:           { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  subtitle:        { fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 18 },
  dishRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  dishLeft:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dishIcon:        { width: 38, height: 38, borderRadius: 10, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  dishName:        { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  ratingRow:       { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  ratingText:      { fontSize: 12, color: '#666', fontWeight: '600' },
  countBox:        { alignItems: 'flex-end' },
  countNum:        { fontSize: 16, fontWeight: '800', color: ORANGE },
  countLabel:      { fontSize: 11, color: '#aaa' },
  filterRow:       { flexDirection: 'row', gap: 8, marginVertical: 14 },
  filterBtn:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  filterActive:    { backgroundColor: ORANGE, borderColor: ORANGE },
  filterText:      { fontSize: 13, color: '#666', fontWeight: '500' },
  filterTextActive:{ color: '#fff', fontWeight: '700' },
});