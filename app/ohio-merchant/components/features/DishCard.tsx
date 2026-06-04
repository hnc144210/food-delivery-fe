// components/features/DishCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Dish } from "../../mock/menu";

const ORANGE = "#E8441A";

interface DishCardProps {
  dish: Dish;
  onToggleAvailable: (id: string, value: boolean) => void;
  onPress: (id: string) => void;
}

export default function DishCard({
  dish,
  onToggleAvailable,
  onPress,
}: DishCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(dish.id)}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        {dish.imageUrl ? (
          <Image source={{ uri: dish.imageUrl }} style={styles.image} />
        ) : null}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={2}>
              {dish.name}
            </Text>
            <Switch
              value={dish.isAvailable}
              onValueChange={(val) => onToggleAvailable(dish.id, val)}
              trackColor={{ false: "#DDD", true: ORANGE }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.price}>
            {dish.price.toLocaleString("vi-VN")}đ
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {dish.description}
          </Text>
          <Text
            style={[
              styles.availableLabel,
              { color: dish.isAvailable ? "#10B981" : "#AAA" },
            ]}
          >
            {dish.isAvailable ? "● AVAILABLE" : "● UNAVAILABLE"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: "row", padding: 14, gap: 12 },
  image: { width: 90, height: 90, borderRadius: 12 },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  price: { fontSize: 16, fontWeight: "800", color: ORANGE, marginTop: 2 },
  description: { fontSize: 12, color: "#AAA", marginTop: 3, lineHeight: 17 },
  availableLabel: { fontSize: 11, fontWeight: "700", marginTop: 6 },
});
