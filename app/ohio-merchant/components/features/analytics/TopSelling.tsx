//components/features/analytics/TopSelling.tsx
import { View, Text, Image, StyleSheet } from "react-native";

const ORANGE = "#E8441A";

type Props = { items: TopItem[] };

export type TopItem = {
  id: string;
  name: string;
  category: string;
  orders: number;
  imageUrl: string;
};

export default function TopSelling({ items }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rank}>#{i + 1}</Text>
          <Image source={{ uri: item.imageUrl }} style={styles.img} />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.count}>{item.orders}</Text>
            <Text style={styles.countLabel}>orders</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 10,
  },
  rank: { fontSize: 12, fontWeight: "700", color: "#ccc", width: 22 },
  img: { width: 44, height: 44, borderRadius: 10 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  category: { fontSize: 12, color: "#888", marginTop: 2 },
  badge: {
    alignItems: "center",
    backgroundColor: "#FEF3E8",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  count: { fontSize: 15, fontWeight: "800", color: ORANGE },
  countLabel: { fontSize: 10, color: "#888" },
});
