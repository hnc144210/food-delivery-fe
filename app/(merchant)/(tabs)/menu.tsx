import React, { useState } from 'react'
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ScrollView, Switch, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import DishCard from '../../../components/features/DishCard'
import { useMerchantStore } from '@/store/merchantStore'
import { mockDishes, mockCategories, Dish } from '../../../mock/menu'

const ORANGE = '#E8441A'

export default function MenuScreen() {
  const router = useRouter()
  const { isOpen, setIsOpen } = useMerchantStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [dishes, setDishes] = useState<Dish[]>(mockDishes)

  const filteredDishes = dishes.filter((d) => {
    const matchCategory = activeCategory === 'all' || d.category === activeCategory
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  function handleToggleAvailable(id: string, value: boolean) {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, isAvailable: value } : d)))
  }

  function handleEdit(id: string) {
    router.push({ pathname: '/(merchant)/add-dish', params: { dishId: id } })
  }

  function handleManageOptions(id: string) {
    router.push({ pathname: '/(merchant)/add-dish', params: { dishId: id, section: 'options' } })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.shopName}>Kinetic Kitchen</Text>
          <Text style={styles.shopSub}>Menu Management</Text>
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

      {/* Search + Layout button */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#AAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Find dishes..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.layoutBtn}
          onPress={() => router.push('/(merchant)/category-layout')}
        >
          <Ionicons name="grid-outline" size={16} color={ORANGE} />
          <Text style={styles.layoutBtnText}>Tùy chỉnh bố cục</Text>
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
        >
          {mockCategories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Dish list */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onToggleAvailable={handleToggleAvailable}
            onEdit={handleEdit}
            onManageOptions={handleManageOptions}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>No dishes found</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(merchant)/add-dish')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  shopName: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  shopSub: { fontSize: 12, color: '#AAA', marginTop: 2 },
  toggleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontSize: 13, fontWeight: '700' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 12, height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  layoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: ORANGE, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  layoutBtnText: { fontSize: 12, color: ORANGE, fontWeight: '600' },
tabWrapper: {
  height: 52,
  backgroundColor: '#fff',
},
tabList: {
  paddingHorizontal: 16,
  paddingVertical: 10,
},
tab: {
  paddingHorizontal: 16,
  paddingVertical: 7,
  borderRadius: 20,
  backgroundColor: '#F2F2F2',
  marginRight: 8,
},
  tabActive: { backgroundColor: '#FEF3E8' },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#AAA',
    textAlign: 'center',
  },
  tabLabelActive: { color: ORANGE },
  listContent: { paddingTop: 12, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#BBB', fontWeight: '500' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center',
    shadowColor: ORANGE, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, elevation: 6,
  },
})