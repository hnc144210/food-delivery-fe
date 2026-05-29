import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#E8441A';
const CREAM  = '#FEF3E8';

interface Category {
  id: string; name: string; itemCount: number
  description: string; isDefault?: boolean; isPriority?: boolean
}

const INITIAL: Category[] = [
  { id: 'all',    name: 'All Dishes',  itemCount: 24, description: 'Default view',   isDefault: true },
  { id: 'best',   name: 'Best Sellers',itemCount: 5,  description: 'Top Priority',   isPriority: true },
  { id: 'main',   name: 'Món chính',   itemCount: 15, description: 'Dinner Menu' },
  { id: 'drinks', name: 'Nước uống',   itemCount: 12, description: 'Bar Selection' },
]

export default function CategoryLayoutScreen() {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>(INITIAL);

  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...cats];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setCats(next);
  };

  const moveDown = (i: number) => {
    if (i === cats.length - 1) return;
    const next = [...cats];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setCats(next);
  };

  const remove = (id: string) =>
    Alert.alert('Xóa danh mục', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => setCats(c => c.filter(x => x.id !== id)) },
    ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tùy chỉnh bố cục</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Sắp xếp danh mục hiển thị cho khách hàng bằng các mũi tên
        </Text>

        {cats.map((cat, i) => (
          <View key={cat.id} style={styles.card}>
            {/* Reorder arrows */}
            <View style={styles.arrows}>
              <TouchableOpacity onPress={() => moveUp(i)} disabled={i === 0}>
                <Ionicons name="chevron-up" size={22} color={i === 0 ? '#ddd' : '#555'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDown(i)} disabled={i === cats.length - 1}>
                <Ionicons name="chevron-down" size={22} color={i === cats.length - 1 ? '#ddd' : '#555'} />
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.catName}>{cat.name}</Text>
                {cat.isPriority && (
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>TOP PRIORITY</Text>
                  </View>
                )}
              </View>
              <Text style={styles.catMeta}>
                {cat.itemCount} items · {cat.description}
                {cat.isDefault ? ' · Default' : ''}
              </Text>
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="create-outline" size={18} color="#666" />
            </TouchableOpacity>
            {!cat.isDefault && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => remove(cat.id)}>
                <Ionicons name="trash-outline" size={18} color="#e53e3e" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Create new */}
        <TouchableOpacity style={styles.createBtn}>
          <Ionicons name="add-circle-outline" size={20} color={ORANGE} />
          <Text style={styles.createText}>Create New Category</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Lưu bố cục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#fff' },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 52 },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  content:       { padding: 16, paddingBottom: 110 },
  subtitle:      { fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 18 },
  card:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', borderRadius: 14, padding: 14, marginBottom: 10, gap: 10 },
  arrows:        { alignItems: 'center', gap: 0 },
  info:          { flex: 1, gap: 3 },
  nameRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catName:       { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  priorityBadge: { backgroundColor: CREAM, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  priorityText:  { fontSize: 9, fontWeight: '800', color: ORANGE, letterSpacing: 0.5 },
  catMeta:       { fontSize: 12, color: '#999' },
  actionBtn:     { width: 34, height: 34, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
  createBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderWidth: 1.5, borderColor: ORANGE, borderStyle: 'dashed', borderRadius: 14, marginTop: 4 },
  createText:    { color: ORANGE, fontWeight: '600', fontSize: 15 },
  footer:        { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  saveBtn:       { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
});