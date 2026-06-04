// app/ohio-merchant/app/(merchant)/store-info.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMerchantStore } from "@/store/merchantStore";
import {
  useUpdateMerchant,
  useMerchantAddresses,
  useDeleteMerchantAddress,
  useCreateMerchantAddress,
  useUpdateMerchantAddress,
} from "@/hooks/useMerchantProfile";
import type {
  MerchantAddress,
  CreateMerchantAddressRequest,
} from "@/types/api";
import * as ImagePicker from "expo-image-picker";
import { fileService } from "@/services/fileService";
import { Image } from "react-native";
import { useFileUrl } from "@/hooks/useFileUrl";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const addressSchema = z.object({
  addressLine: z.string().min(1, "Địa chỉ không được trống"),
  ward: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

const schema = z.object({
  storeName: z.string().min(1, "Tên cửa hàng không được trống"),
  storeDescription: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  minOrderAmount: z.string().optional(),
  avgPrepTime: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function AddressItem({
  item,
  onEdit,
  onDelete,
}: {
  item: MerchantAddress;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const parts = [item.addressLine, item.ward, item.district, item.city].filter(
    Boolean,
  );
  return (
    <View style={styles.addressCard}>
      <View style={styles.addressIcon}>
        <Ionicons name="location" size={16} color={ORANGE} />
      </View>
      <Text style={styles.addressText}>{parts.join(", ")}</Text>
      <View style={styles.addressActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={18} color="#e53e3e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddressFormModal({
  visible,
  onClose,
  editing,
}: {
  visible: boolean;
  onClose: () => void;
  editing: MerchantAddress | null;
}) {
  const createAddress = useCreateMerchantAddress();
  const updateAddress = useUpdateMerchantAddress();
  const isPending = createAddress.isPending || updateAddress.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { addressLine: "", ward: "", district: "", city: "" },
  });

  useEffect(() => {
    if (visible) {
      reset({
        addressLine: editing?.addressLine ?? "",
        ward: editing?.ward ?? "",
        district: editing?.district ?? "",
        city: editing?.city ?? "",
      });
    }
  }, [visible, editing]);

  const onSubmit = (data: AddressFormData) => {
    const body: CreateMerchantAddressRequest = {
      addressLine: data.addressLine,
      ward: data.ward || null,
      district: data.district || null,
      city: data.city || null,
      lat: "0",
      lng: "0",
    };

    if (editing) {
      updateAddress.mutate(
        { addressId: editing.id, body },
        { onSuccess: onClose },
      );
    } else {
      createAddress.mutate(body, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalSheet}
      >
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>
          {editing ? "Sửa địa chỉ" : "Thêm địa chỉ"}
        </Text>

        {(["addressLine", "ward", "district", "city"] as const).map((field) => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>
                  {field === "addressLine"
                    ? "Số nhà, tên đường *"
                    : field === "ward"
                      ? "Phường/Xã"
                      : field === "district"
                        ? "Quận/Huyện"
                        : "Tỉnh/Thành phố"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={
                    field === "addressLine"
                      ? "VD: 123 Nguyễn Huệ"
                      : field === "ward"
                        ? "VD: Phường Bến Nghé"
                        : field === "district"
                          ? "VD: Quận 1"
                          : "VD: TP. Hồ Chí Minh"
                  }
                />
                {errors[field] && (
                  <Text style={styles.error}>{errors[field]?.message}</Text>
                )}
              </View>
            )}
          />
        ))}

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { flex: 1 }, isPending && { opacity: 0.7 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function StoreInfoScreen() {
  const router = useRouter();
  const { merchant } = useMerchantStore();
  const updateMerchant = useUpdateMerchant();
  const addressesQuery = useMerchantAddresses();
  const deleteAddress = useDeleteMerchantAddress();
  const createAddress = useCreateMerchantAddress();
  const updateAddress = useUpdateMerchantAddress();
  const { data: logoUrl } = useFileUrl(merchant?.storeLogoFileKey ?? null);
  const [uploading, setUploading] = useState(false);

  const [addressModal, setAddressModal] = useState<{
    visible: boolean;
    editing: MerchantAddress | null;
  }>({ visible: false, editing: null });

  function SectionTitle({ title }: { title: string }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
  }
  async function handlePickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    const contentType = `image/${ext}`;
    setUploading(true);
    try {
      const { uploadUrl, fileKey } = await fileService.getUploadUrl(
        `logo.${ext}`,
        contentType,
      );
      await fileService.uploadFile(uploadUrl, asset.uri, contentType);
      updateMerchant.mutate({ storeLogoUrl: fileKey });
    } finally {
      setUploading(false);
    }
  }
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
      openingTime: merchant?.openingTime?.slice(0, 5) ?? "",
      closingTime: merchant?.closingTime?.slice(0, 5) ?? "",
      minOrderAmount: merchant?.minOrderAmount?.toString() ?? "",
      avgPrepTime: merchant?.avgPrepTime?.toString() ?? "",
    },
  });

  useEffect(() => {
    if (merchant) {
      reset({
        storeName: merchant.storeName ?? "",
        storeDescription: merchant.storeDescription ?? "",
        openingTime: merchant.openingTime?.slice(0, 5) ?? "",
        closingTime: merchant.closingTime?.slice(0, 5) ?? "",
        minOrderAmount: merchant.minOrderAmount?.toString() ?? "",
        avgPrepTime: merchant.avgPrepTime?.toString() ?? "",
      });
    }
  }, [merchant]);

  const onSubmit = (data: FormData) => {
    updateMerchant.mutate(
      {
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        openingTime: data.openingTime ? `${data.openingTime}:00` : undefined,
        closingTime: data.closingTime ? `${data.closingTime}:00` : undefined,
        minOrderAmount: data.minOrderAmount,
        avgPrepTime: data.avgPrepTime,
      },
      { onSuccess: () => router.back() },
    );
  };

  function handleDeleteAddress(id: string) {
    Alert.alert("Xóa địa chỉ", "Bạn có chắc muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => deleteAddress.mutate(id),
      },
    ]);
  }

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
          <SectionTitle title="Thông tin cơ bản" />
          <TouchableOpacity
            style={styles.logoWrapper}
            onPress={handlePickLogo}
            disabled={uploading}
          >
            {logoUrl ? (
              <Image source={{ uri: logoUrl }} style={styles.logoImg} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="storefront" size={32} color={ORANGE} />
              </View>
            )}
            <View style={styles.logoEdit}>
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={14} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.card}>
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
                <View style={[styles.field, { marginBottom: 0 }]}>
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
          </View>

          <SectionTitle title="Giờ & Cài đặt đơn hàng" />
          <View style={styles.card}>
            <View style={styles.row}>
              <Controller
                control={control}
                name="openingTime"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.field, { flex: 1, marginBottom: 0 }]}>
                    <Text style={styles.label}>Giờ mở cửa</Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="08:00"
                    />
                  </View>
                )}
              />
              <View style={{ width: 12 }} />
              <Controller
                control={control}
                name="closingTime"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.field, { flex: 1, marginBottom: 0 }]}>
                    <Text style={styles.label}>Giờ đóng cửa</Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="22:00"
                    />
                  </View>
                )}
              />
            </View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="minOrderAmount"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.field, { flex: 1, marginBottom: 0 }]}>
                    <Text style={styles.label}>Đơn tối thiểu (đ)</Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="30000"
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
              <View style={{ width: 12 }} />
              <Controller
                control={control}
                name="avgPrepTime"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.field, { flex: 1, marginBottom: 0 }]}>
                    <Text style={styles.label}>T/g chuẩn bị (phút)</Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="20"
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <SectionTitle title="Thông tin pháp lý" />
          <View style={styles.card}>
            <InfoRow label="Mã số thuế" value={merchant?.taxId ?? "—"} />
            <View style={styles.divider} />
            <InfoRow
              label="Giấy phép KD"
              value={merchant?.businessLicense ?? "—"}
            />
          </View>

          <View style={styles.addressHeader}>
            <SectionTitle title="Địa chỉ cửa hàng" />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setAddressModal({ visible: true, editing: null })}
            >
              <Ionicons name="add" size={16} color={ORANGE} />
              <Text style={styles.addBtnText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {addressesQuery.isLoading && <ActivityIndicator color={ORANGE} />}
            {(addressesQuery.data?.items ?? []).length === 0 &&
              !addressesQuery.isLoading && (
                <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
              )}
            {(addressesQuery.data?.items ?? []).map((addr, index) => (
              <View key={addr.id}>
                {index > 0 && <View style={styles.divider} />}
                <AddressItem
                  item={addr}
                  onEdit={() =>
                    setAddressModal({ visible: true, editing: addr })
                  }
                  onDelete={() => handleDeleteAddress(addr.id)}
                />
              </View>
            ))}
          </View>

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
      <AddressFormModal
        visible={addressModal.visible}
        onClose={() => setAddressModal({ visible: false, editing: null })}
        editing={addressModal.editing}
      />
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
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 12,
  },
  field: { marginBottom: 0 },
  label: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1a1a1a",
  },
  textarea: { height: 72 },
  error: { color: "#e53e3e", fontSize: 12, marginTop: 4 },
  row: { flexDirection: "row" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 14, color: "#888" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  divider: { height: 1, backgroundColor: "#f5f5f5", marginVertical: 4 },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: CREAM,
  },
  addBtnText: { fontSize: 13, color: ORANGE, fontWeight: "600" },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  addressIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  addressText: { flex: 1, fontSize: 14, color: "#333", lineHeight: 20 },
  addressActions: { flexDirection: "row", gap: 4 },
  actionBtn: { padding: 6 },
  emptyText: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 14,
    paddingVertical: 8,
  },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 15, color: "#666", fontWeight: "600" },
  logoWrapper: { alignSelf: "center", marginBottom: 8 },
  logoImg: { width: 80, height: 80, borderRadius: 16 },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
});
