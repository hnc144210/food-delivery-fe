// app/ohio-merchant/app/(merchant)/category-layout.tsx
import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useMyProducts,
} from "@/hooks/useMenu";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

export default function CategoryLayoutScreen() {
  const router = useRouter();
  const categoriesQuery = useCategories({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const cats = categoriesQuery.data ?? [];

  const productsQuery = useMyProducts();

  const itemCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of productsQuery.data ?? []) {
      if (p.categoryId) {
        map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
      }
    }
    return map;
  }, [productsQuery.data]);

  function handleEditStart(id: string, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function handleEditSave(id: string) {
    if (!editingName.trim()) return;
    updateCategory.mutate(
      { id, body: { name: editingName.trim(), isActive: true } },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleDelete(id: string) {
    Alert.alert("Xóa danh mục", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => deleteCategory.mutate(id),
      },
    ]);
  }

  function handleCreate() {
    if (!newName.trim()) return;
    createCategory.mutate(
      { name: newName.trim(), isActive: true },
      {
        onSuccess: () => {
          setNewName("");
          setShowCreate(false);
        },
      },
    );
  }

  if (categoriesQuery.isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={ORANGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            <View style={styles.arrows}>
              <TouchableOpacity disabled={i === 0}>
                <Ionicons
                  name="chevron-up"
                  size={22}
                  color={i === 0 ? "#ddd" : "#555"}
                />
              </TouchableOpacity>
              <TouchableOpacity disabled={i === cats.length - 1}>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={i === cats.length - 1 ? "#ddd" : "#555"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.info}>
              {editingId === cat.id ? (
                <TextInput
                  style={styles.inlineInput}
                  value={editingName}
                  onChangeText={setEditingName}
                  autoFocus
                  onSubmitEditing={() => handleEditSave(cat.id)}
                />
              ) : (
                <Text style={styles.catName}>{cat.name}</Text>
              )}
              {editingId !== cat.id && (
                <Text style={styles.catMeta}>
                  {itemCountByCategory.get(cat.id) ?? 0} items
                </Text>
              )}
            </View>

            {editingId === cat.id ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleEditSave(cat.id)}
                disabled={updateCategory.isPending}
              >
                {updateCategory.isPending ? (
                  <ActivityIndicator size="small" color={ORANGE} />
                ) : (
                  <Ionicons name="checkmark" size={18} color={ORANGE} />
                )}
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleEditStart(cat.id, cat.name)}
                >
                  <Ionicons name="create-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(cat.id)}
                  disabled={deleteCategory.isPending}
                >
                  <Ionicons name="trash-outline" size={18} color="#e53e3e" />
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}

        {showCreate ? (
          <View style={styles.createForm}>
            <TextInput
              style={styles.createInput}
              placeholder="Tên danh mục..."
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TouchableOpacity
              style={styles.createConfirmBtn}
              onPress={handleCreate}
              disabled={createCategory.isPending}
            >
              {createCategory.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createConfirmText}>Tạo</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowCreate(false);
                setNewName("");
              }}
            >
              <Ionicons name="close" size={22} color="#999" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => setShowCreate(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color={ORANGE} />
            <Text style={styles.createText}>Create New Category</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Lưu bố cục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 52,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, paddingBottom: 110 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 18 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  arrows: { alignItems: "center", gap: 0 },
  info: { flex: 1 },
  catName: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  inlineInput: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    borderBottomWidth: 1.5,
    borderBottomColor: ORANGE,
    paddingVertical: 2,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderStyle: "dashed",
    borderRadius: 14,
    marginTop: 4,
  },
  createText: { color: ORANGE, fontWeight: "600", fontSize: 15 },
  createForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  createInput: { flex: 1, fontSize: 15, color: "#1a1a1a" },
  createConfirmBtn: {
    backgroundColor: ORANGE,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  createConfirmText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  catMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
