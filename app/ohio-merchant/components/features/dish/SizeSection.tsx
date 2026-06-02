//components/features/dish/SizeSection.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

type Props = { sizes: string[]; onChange: (v: string[]) => void };

export default function SizeSection({ sizes, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim().toUpperCase();
    if (!val || sizes.includes(val)) return;
    onChange([...sizes, val]);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Size</Text>
      {sizes.length > 0 && (
        <View style={styles.chips}>
          {sizes.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.chip}
              onPress={() => onChange(sizes.filter((x) => x !== s))}
            >
              <Text style={styles.chipText}>{s}</Text>
              <Ionicons name="close" size={13} color={ORANGE} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="VD: S, M, L, XL"
          returnKeyType="done"
          onSubmitEditing={add}
        />
        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: CREAM,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { color: ORANGE, fontWeight: "700", fontSize: 13 },
  row: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1a1a1a",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
});
