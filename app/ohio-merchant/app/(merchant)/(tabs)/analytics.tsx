import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockSummary, mockChartData, mockTopItems, type Period } from '@/mock/analytics';
import RevenueChart from '@/components/features/analytics/RevenueChart';
import TopSelling from '@/components/features/analytics/TopSelling';
import { useMerchantStore } from '@/store/merchantStore';

const ORANGE = '#E8441A';
const CREAM  = '#FEF3E8';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const fmtRevenue = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`;

export default function AnalyticsScreen() {
  const { isOpen, setIsOpen } = useMerchantStore();
  const [period, setPeriod] = useState<Period>('month');
  const s = mockSummary[period];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.shopName}>Kinetic Kitchen</Text>
          <Text style={styles.shopSub}>Analytics</Text>
        </View>
        <View style={styles.toggleWrapper}>
          <Text style={[styles.toggleLabel, { color: isOpen ? ORANGE : '#AAA' }]}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </Text>
          <Switch
            value={isOpen}
            onValueChange={setIsOpen}
            trackColor={{ false: '#DDD', true: ORANGE }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Performance Hub</Text>
        <Text style={styles.subtitle}>Real-time revenue & efficiency tracking</Text>

        {/* Period tabs */}
        <View style={styles.tabBar}>
          {PERIODS.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[styles.tab, period === p.key && styles.tabActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.tabText, period === p.key && styles.tabTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={18} color={ORANGE} />
            <Text style={styles.change}>+{s.revenueChange}%</Text>
            <Text style={styles.statLabel}>TOTAL REVENUE</Text>
            <Text style={styles.statValue}>{fmtRevenue(s.totalRevenue)}đ</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={18} color={ORANGE} />
            <Text style={[styles.change, s.ordersChange < 0 && { color: '#e53e3e' }]}>
              {s.ordersChange > 0 ? '+' : ''}{s.ordersChange}%
            </Text>
            <Text style={styles.statLabel}>TOTAL ORDERS</Text>
            <Text style={styles.statValue}>{s.totalOrders.toLocaleString()}</Text>
          </View>
        </View>

        {/* Retention */}
        <View style={styles.retentionCard}>
          <View>
            <Text style={styles.retentionLabel}>CUSTOMER RETENTION</Text>
            <Text style={styles.retentionValue}>{s.customerRetention}%</Text>
          </View>
          <Ionicons name="people" size={36} color="rgba(255,255,255,0.4)" />
        </View>

        {/* Chart */}
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        <RevenueChart data={mockChartData[period]} />

        {/* Top selling */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        <TopSelling items={mockTopItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#fff' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  shopName:      { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  shopSub:       { fontSize: 12, color: '#AAA', marginTop: 2 },
  toggleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel:   { fontSize: 13, fontWeight: '700' },
  container:     { flex: 1, backgroundColor: '#fff' },
  content:       { padding: 16, paddingBottom: 36 },
  title:         { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  subtitle:      { fontSize: 13, color: '#888', marginBottom: 16 },
  tabBar:        { flexDirection: 'row', backgroundColor: CREAM, borderRadius: 10, padding: 3, marginBottom: 16 },
  tab:           { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive:     { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  tabText:       { fontSize: 12, color: '#999', fontWeight: '500' },
  tabTextActive: { color: '#1a1a1a', fontWeight: '700' },
  statsRow:      { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard:      { flex: 1, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 14, padding: 14, gap: 2 },
  change:        { fontSize: 12, color: '#22c55e', fontWeight: '600', marginTop: 4 },
  statLabel:     { fontSize: 10, color: '#aaa', fontWeight: '600', letterSpacing: 0.5, marginTop: 6 },
  statValue:     { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginTop: 2 },
  retentionCard: { backgroundColor: ORANGE, borderRadius: 14, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  retentionLabel:{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.5 },
  retentionValue:{ fontSize: 30, fontWeight: '800', color: '#fff', marginTop: 4 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  viewAll:       { color: ORANGE, fontWeight: '600', fontSize: 13 },
});