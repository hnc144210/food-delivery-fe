import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  mockMerchantOrders,
  mockShopStats,
  MerchantOrder,
  MerchantOrderStatus,
} from '../../../mock/merchant'
import { useMerchantStore } from '@/store/merchantStore'
import MerchantOrderCard from '../../../components/features/MerchantOrderCard'

const ORANGE = '#E8441A'
const CREAM = '#FEF3E8'

const TABS: { key: MerchantOrderStatus; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'delivering', label: 'Delivering' },
]

export default function MerchantOrdersScreen() {
  const { isOpen, setIsOpen } = useMerchantStore()
  const [activeTab, setActiveTab] = useState<MerchantOrderStatus>('new')
  const [orders, setOrders] = useState<MerchantOrder[]>(mockMerchantOrders)

  const filteredOrders = orders.filter((o) => o.status === activeTab)
  const countByTab = (key: MerchantOrderStatus) => orders.filter((o) => o.status === key).length

  function handleAccept(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'preparing' } : o)))
  }

  function handleReject(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  function handleReady(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'delivering' } : o)))
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.shopName}>Kinetic Kitchen</Text>
          <Text style={styles.shopSub}>Orders Dashboard</Text>
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

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBlock label="Active" value={mockShopStats.active} />
        <View style={styles.statDivider} />
        <StatBlock label="Today" value={mockShopStats.today} />
        <View style={styles.statDivider} />
        <StatBlock label="Feedbacks" value={mockShopStats.feedbacks} />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const count = countByTab(tab.key)
          const isActive = activeTab === tab.key
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Order list */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MerchantOrderCard
            order={item}
            onAccept={handleAccept}
            onReject={handleReject}
            onReady={handleReady}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState tab={activeTab} />}
      />
    </SafeAreaView>
  )
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function EmptyState({ tab }: { tab: MerchantOrderStatus }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🍽️</Text>
      <Text style={styles.emptyText}>No {tab} orders right now</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  shopName: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  shopSub: { fontSize: 12, color: '#AAA', marginTop: 2 },
  toggleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontSize: 13, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 1,
    alignItems: 'center',
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: ORANGE },
  statLabel: { fontSize: 12, color: '#AAA', marginTop: 3 },
  statDivider: { width: 1, height: 36, backgroundColor: '#EEE' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 1,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: ORANGE },
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#BBB' },
  tabLabelActive: { color: ORANGE },
  badge: {
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: { backgroundColor: CREAM },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#999' },
  badgeTextActive: { color: ORANGE },
  listContent: { paddingTop: 12, paddingBottom: 32 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#BBB', fontWeight: '500' },
})