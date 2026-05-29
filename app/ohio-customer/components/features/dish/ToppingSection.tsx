import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#E8441A';

type Topping = { name: string; price: string };
type Props = { toppings: Topping[]; onChange: (v: Topping[]) => void };

export default function ToppingSection({ toppings, onChange }: Props) {
  const add = () => onChange([...toppings, { name: '', price: '' }]);

  const remove = (i: number) => onChange(toppings.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof Topping, value: string) => {
    const next = [...toppings];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Topping</Text>
        <TouchableOpacity style={styles.addRow} onPress={add}>
          <Ionicons name="add-circle-outline" size={18} color={ORANGE} />
          <Text style={styles.addText}>Thêm topping</Text>
        </TouchableOpacity>
      </View>

      {toppings.length === 0 && (
        <Text style={styles.empty}>Chưa có topping — nhấn "Thêm" để bắt đầu</Text>
      )}

      {toppings.map((t, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={t.name}
            onChangeText={v => update(i, 'name', v)}
            placeholder="Tên topping"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={t.price}
            onChangeText={v => update(i, 'price', v)}
            placeholder="+Giá"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.removeBtn} onPress={() => remove(i)}>
            <Ionicons name="trash-outline" size={18} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { color: ORANGE, fontWeight: '600', fontSize: 14 },
  empty: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingVertical: 10, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9, fontSize: 14, color: '#1a1a1a' },
  removeBtn: { padding: 4 },
});