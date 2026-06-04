import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/authStore";
import { userApi, extractData } from "@/lib/api";
import { fileService } from "@/services/fileService";
import { useFileUrl } from "@/hooks/useFileUrl";
import { useMutation } from "@tanstack/react-query";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const schema = z.object({
  fullName: z.string().min(1, "Họ tên không được trống"),
  phoneNumber: z.string().min(1, "Số điện thoại không được trống"),
});
type FormData = z.infer<typeof schema>;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [uploading, setUploading] = useState(false);
  const { data: avatarUrl } = useFileUrl(user?.avatarUrl ?? null);

  const updateProfile = useMutation({
    mutationFn: (body: {
      fullName: string;
      phoneNumber: string;
      avatarUrl?: string;
    }) => userApi.put(`/api/Users/${user?.id}`, body).then(extractData),
    onSuccess: (_, variables) => {
      setUser({ ...user!, ...variables });
      router.back();
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  useEffect(() => {
    if (user)
      reset({
        fullName: user.fullName ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
  }, [user]);

  async function handlePickAvatar() {
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
        `avatar.${ext}`,
        contentType,
      );
      await fileService.uploadFile(uploadUrl, asset.uri, contentType);
      updateProfile.mutate({
        fullName: user?.fullName ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        avatarUrl: fileKey,
      });
    } finally {
      setUploading(false);
    }
  }

  const onSubmit = (data: FormData) =>
    updateProfile.mutate({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      avatarUrl: user?.avatarUrl ?? "",
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
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
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickAvatar}
            disabled={uploading}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color={ORANGE} />
              </View>
            )}
            <View style={styles.avatarEdit}>
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
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <Text style={styles.label}>Họ và tên</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <Text style={styles.error}>{errors.fullName.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.field, { marginBottom: 0 }]}>
                  <Text style={styles.label}>Số điện thoại</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="0900000000"
                    keyboardType="phone-pad"
                  />
                  {errors.phoneNumber && (
                    <Text style={styles.error}>
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveBtn,
              updateProfile.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
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
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  avatarWrapper: { alignSelf: "center", marginVertical: 8 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
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
  error: { color: "#e53e3e", fontSize: 12, marginTop: 4 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  infoLabel: { fontSize: 14, color: "#888" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  divider: { height: 1, backgroundColor: "#f5f5f5" },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
