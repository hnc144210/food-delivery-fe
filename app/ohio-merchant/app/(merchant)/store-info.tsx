// app/ohio-merchant/app/(merchant)/store-info.tsx
import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMerchantStore } from "@/store/merchantStore";
import { useUpdateMerchant } from "@/hooks/useMerchantProfile";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const schema = z.object({
  storeName: z.string().min(1, "Tên cửa hàng không được trống"),
  storeDescription: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function StoreInfoScreen() {
  const router = useRouter();
  const { merchant } = useMerchantStore();
  const updateMerchant = useUpdateMerchant();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      storeName: merchant?.storeName ?? "",
      storeDescription: merchant?.storeDescription ?? "",
    },
  });

  useEffect(() => {
    if (merchant) {
      reset({
        storeName: merchant.storeName ?? "",
        storeDescription: merchant.storeDescription ?? "",
      });
    }
  }, [merchant]);

  const onSubmit = (data: FormData) => {
    updateMerchant.mutate(
      { storeName: data.storeName, storeDescription: data.storeDescription },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cửa hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Controller
            control={control}
            name="storeName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Tên cửa hàng *</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tên cửa hàng"
                />
                {errors.storeName && (
                  <Text style={styles.error}>{errors.storeName.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="storeDescription"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Giới thiệu về cửa hàng..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            )}
          />

          <TouchableOpacity
            style={[
              styles.saveBtn,
              updateMerchant.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={updateMerchant.isPending}
          >
            {updateMerchant.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Lưu thông tin</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, paddingBottom: 40 },
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
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
