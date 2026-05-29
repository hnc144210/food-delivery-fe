import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#E8441A';
const CREAM  = '#FEF3E8';

interface DaySchedule { day: string; short: string; isOpen: boolean; open: string; close: string }

const INIT: DaySchedule[] = [
  { day: 'Thứ Hai',  short: 'T2', isOpen: true,  open: '07:00', close: '22:00' },
  { day: 'Thứ Ba',   short: 'T3', isOpen: true,  open: '07:00', close: '22:00' },
  { day: 'Thứ Tư',   short: 'T4', isOpen: true,  open: '07:00', close: '22:00' },
  { day: 'Thứ Năm',  short: 'T5', isOpen: true,  open: '07:00', close: '22:00' },
  { day: 'Thứ Sáu',  short: 'T6', isOpen: true,  open: '07:00', close: '22:00' },
  { day: 'Thứ Bảy',  short: 'T7', isOpen: true,  open: '08:00', close: '23:00' },
  { day: 'Chủ Nhật', short: 'CN', isOpen: false, open: '08:00', close: '21:00' },
];

export default function OpeningHoursScreen() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<DaySchedule[]>(INIT);

  const toggle = (i: number) => setSchedule(s => s.map((d, idx) => idx === i ? { ...d, isOpen: !d.isOpen } : d));
  const updateTime = (i: number, field: 'open' | 'close', val: string) =>
    setSchedule(s => s.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  const applyAll = () => setSchedule(s => s.map(d => ({ ...d, open: s[0].open, close: s[0].close })));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1a1a1a" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Giờ mở cửa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Thiết lập giờ hoạt động cho từng ngày trong tuần</Text>

        {schedule.map((s, i) => (
          <View key={s.day} style={[styles.card, !s.isOpen && styles.cardClosed]}>
            <View style={styles.cardLeft}>
              <View style={[styles.badge, s.isOpen && styles.badgeActive]}>
                <Text style={[styles.badgeText, s.isOpen && styles.badgeTextActive]}>{s.short}</Text>
              </View>
              <Text style={[styles.dayName, !s.isOpen && { color: '#aaa' }]}>{s.day}</Text>
            </View>

            {s.isOpen ? (
              <View style={styles.timeRow}>
                <TextInput style={styles.timeInput} value={s.open}
                  onChangeText={v => updateTime(i, 'open', v)} maxLength={5} keyboardType="numbers-and-punctuation" />
                <Text style={styles.sep}>–</Text>
                <TextInput style={styles.timeInput} value={s.close}
                  onChangeText={v => updateTime(i, 'close', v)} maxLength={5} keyboardType="numbers-and-punctuation" />
              </View>
            ) : (
              <Text style={styles.closedText}>Đóng cửa</Text>
            )}

            <Switch value={s.isOpen} onValueChange={() => toggle(i)}
              trackColor={{ false: '#ddd', true: ORANGE }} thumbColor="#fff"
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }} />
          </View>
        ))}

        <TouchableOpacity style={styles.applyBtn} onPress={applyAll}>
          <Ionicons name="copy-outline" size={16} color={ORANGE} />
          <Text style={styles.applyText}>Áp dụng giờ Thứ Hai cho tất cả ngày</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Lưu giờ mở cửa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  content:       { padding: 16, paddingBottom: 110 },
  subtitle:      { fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 18 },
  card:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', borderRadius: 14, padding: 14, marginBottom: 10, gap: 10 },
  cardClosed:    { opacity: 0.55 },
  cardLeft:      { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  badge:         { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  badgeActive:   { backgroundColor: CREAM },
  badgeText:     { fontSize: 12, fontWeight: '700', color: '#aaa' },
  badgeTextActive: { color: ORANGE },
  dayName:       { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  timeRow:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeInput:     { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 13, color: '#1a1a1a', width: 52, textAlign: 'center' },
  sep:           { fontSize: 14, color: '#aaa' },
  closedText:    { fontSize: 13, color: '#aaa', fontStyle: 'italic' },
  applyBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, marginTop: 4 },
  applyText:     { color: ORANGE, fontWeight: '600', fontSize: 14 },
  footer:        { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  saveBtn:       { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
});