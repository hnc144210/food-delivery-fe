//components/features/DishCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dish } from "../../mock/menu";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

interface DishCardProps {
  dish: Dish;
  onToggleAvailable: (id: string, value: boolean) => void;
  onEdit: (id: string) => void;
  onManageOptions: (id: string) => void;
}

export default function DishCard({
  dish,
  onToggleAvailable,
  onEdit,
  onManageOptions,
}: DishCardProps) {
  const hasOptions = dish.sizes.length > 0 || dish.toppings.length > 0;

  return (
    <View style={styles.card}>
      {/* Image + Info row */}
      <View style={styles.topRow}>
        <Image source={{ uri: dish.imageUrl }} style={styles.image} />
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

      {/* Manage options section */}
      {hasOptions && (
        <>
          <View style={styles.divider} />
          <View style={styles.optionsSection}>
            <View style={styles.optionsHeader}>
              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => onManageOptions(dish.id)}
              >
                <Ionicons name="settings-outline" size={12} color={ORANGE} />
                <Text style={styles.manageBtnText}>MANAGE OPTIONS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEdit(dish.id)}>
                <Text style={styles.editAllText}>Edit All</Text>
              </TouchableOpacity>
            </View>

            {dish.sizes.length > 0 && (
              <View style={styles.chipsRow}>
                {dish.sizes.map((size) => (
                  <View key={size.id} style={styles.chip}>
                    <Text style={styles.chipText}>{size.name} ×</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.addChip}>
                  <Text style={styles.addChipText}>+ Thêm</Text>
                </TouchableOpacity>
              </View>
            )}

            {dish.toppings.length > 0 && (
              <View style={styles.toppingsList}>
                {dish.toppings.map((topping) => (
                  <View key={topping.id} style={styles.toppingRow}>
                    <Text style={styles.toppingName}>{topping.name}</Text>
                    <Text style={styles.toppingPrice}>
                      +{topping.price.toLocaleString("vi-VN")}đ
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
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
  divider: { height: 1, backgroundColor: "#F2F2F2" },
  optionsSection: { padding: 12, gap: 10 },
  optionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  manageBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  manageBtnText: { fontSize: 11, fontWeight: "700", color: ORANGE },
  editAllText: { fontSize: 12, color: "#888", fontWeight: "600" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    backgroundColor: "#FEF3E8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { fontSize: 12, color: ORANGE, fontWeight: "600" },
  addChip: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderStyle: "dashed",
  },
  addChipText: { fontSize: 12, color: "#AAA" },
  toppingsList: { gap: 4 },
  toppingRow: { flexDirection: "row", justifyContent: "space-between" },
  toppingName: { fontSize: 12, color: "#555" },
  toppingPrice: { fontSize: 12, color: "#888" },
});
