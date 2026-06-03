// app/ohio-merchant/app/(merchant)/add-dish.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SizeSection from "@/components/features/dish/SizeSection";
import ToppingSection from "@/components/features/dish/ToppingSection";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useCategories, useCreateProduct } from "@/hooks/useMenu";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const schema = z.object({
  name: z.string().min(1, "Tên món không được trống"),
  description: z.string().optional(),
  price: z.string().min(1, "Nhập giá"),
  categoryId: z.string().min(1, "Chọn danh mục"),
});
type FormData = z.infer<typeof schema>;

export default function AddDishScreen() {
  const router = useRouter();
  const { dishId } = useLocalSearchParams<{ dishId?: string }>();
  const isEdit = !!dishId;

  const [image, setImage] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [toppings, setToppings] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [allowNote, setAllowNote] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const categoriesQuery = useCategories({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const dishCategories = categoriesQuery.data ?? [];
  console.log(
    "categories:",
    JSON.stringify(dishCategories),
    "loading:",
    categoriesQuery.isLoading,
    "error:",
    categoriesQuery.error,
  );
  const createProduct = useCreateProduct();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", price: "", categoryId: "" },
  });
  const selectedCatId = watch("categoryId");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const onSubmit = async (data: FormData) => {
    console.log("onSubmit called", JSON.stringify(data));
    try {
      await createProduct.mutateAsync({
        categoryId: data.categoryId,
        name: data.name,
        description: data.description ?? "",
        imageUrl: image ?? "",
        basePrice: Number(data.price),
        discountPrice: Number(data.price),
        isAvailable: true,
        isFeatured: false,
        prepTime: 0,
        options: [
          ...(sizes.length > 0
            ? [
                {
                  name: "Size",
                  isRequired: true,
                  maxSelections: 1,
                  values: sizes.map((s) => ({
                    name: s,
                    additionalPrice: 0,
                    isAvailable: true,
                  })),
                },
              ]
            : []),
          ...(toppings.length > 0
            ? [
                {
                  name: "Topping",
                  isRequired: false,
                  maxSelections: toppings.length,
                  values: toppings.map((t) => ({
                    name: t.name,
                    additionalPrice: Number(t.price),
                    isAvailable: true,
                  })),
                },
              ]
            : []),
        ],
      });
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      console.log("create error:", msg);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEdit ? "Chỉnh sửa món" : "Thêm món ăn mới"}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Image */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={ORANGE} />
                <Text style={styles.imageText}>Thêm ảnh món</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Tên món *</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Nhập tên món ăn"
                />
                {errors.name && (
                  <Text style={styles.error}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Mô tả món ăn..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            )}
          />

          {/* Price */}
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Giá (VNĐ) *</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="0"
                  keyboardType="numeric"
                />
                {errors.price && (
                  <Text style={styles.error}>{errors.price.message}</Text>
                )}
              </View>
            )}
          />

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Danh mục *</Text>
            {categoriesQuery.isLoading ? (
              <ActivityIndicator color={ORANGE} />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dropdownTrigger}
                  onPress={() => setShowCatPicker((v) => !v)}
                >
                  <Text
                    style={{
                      color: selectedCatId ? "#1a1a1a" : "#aaa",
                      fontSize: 15,
                    }}
                  >
                    {dishCategories.find((c) => c.id === selectedCatId)?.name ??
                      "Chọn danh mục"}
                  </Text>
                  <Ionicons
                    name={showCatPicker ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#666"
                  />
                </TouchableOpacity>
                {showCatPicker && (
                  <View style={styles.dropdown}>
                    {dishCategories.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setValue("categoryId", c.id, {
                            shouldValidate: true,
                          });
                          setShowCatPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownText,
                            selectedCatId === c.id && styles.dropdownActive,
                          ]}
                        >
                          {c.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
            {errors.categoryId && (
              <Text style={styles.error}>{errors.categoryId.message}</Text>
            )}
          </View>

          {/* Options */}
          <Text style={styles.sectionTitle}>Cài đặt tùy chọn</Text>
          <SizeSection sizes={sizes} onChange={setSizes} />
          <ToppingSection toppings={toppings} onChange={setToppings} />

          {/* Note toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Ghi chú từ khách hàng</Text>
              <Text style={styles.toggleSub}>
                Cho phép khách thêm yêu cầu đặc biệt
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, allowNote && styles.toggleOn]}
              onPress={() => setAllowNote((v) => !v)}
            >
              <View style={[styles.thumb, allowNote && styles.thumbOn]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.saveBtn,
              createProduct.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={createProduct.isPending}
          >
            {createProduct.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Lưu món ăn</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 48 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  imagePicker: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  image: { width: "100%", height: 180 },
  imagePlaceholder: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CREAM,
    gap: 8,
  },
  imageText: { color: ORANGE, fontWeight: "600", fontSize: 14 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1a1a1a",
  },
  textarea: { height: 80 },
  error: { color: "#e53e3e", fontSize: 12, marginTop: 4 },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownText: { fontSize: 15, color: "#333" },
  dropdownActive: { color: ORANGE, fontWeight: "700" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 4,
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginBottom: 28,
  },
  toggleSub: { fontSize: 12, color: "#888", marginTop: 2 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ddd",
    padding: 2,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: ORANGE },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: { alignSelf: "flex-end" },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
