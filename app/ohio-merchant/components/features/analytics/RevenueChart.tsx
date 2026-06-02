//components/features/analytics/RevenueChart.tsx
import { View, Text, StyleSheet } from "react-native";

const ORANGE = "#E8441A";

type Props = { data: RevenueData[] };
export type RevenueData = { label: string; value: number };
export default function RevenueChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((d, i) => {
          const pct = d.value / max;
          return (
            <View key={i} style={styles.col}>
              <View style={styles.track}>
                <View
                  style={[styles.bar, { height: `${Math.max(pct * 100, 5)}%` }]}
                />
              </View>
              <Text style={styles.label}>{d.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FEF3E8", borderRadius: 14, padding: 16 },
  bars: { flexDirection: "row", alignItems: "flex-end", height: 120, gap: 6 },
  col: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 6,
  },
  track: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: {
    backgroundColor: ORANGE,
    borderRadius: 5,
    width: "100%",
    opacity: 0.9,
  },
  label: { fontSize: 10, color: "#888", fontWeight: "500" },
});
