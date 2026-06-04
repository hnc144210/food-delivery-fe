import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { userApi, extractData } from "@/lib/api";
import { fileService } from "@/services/fileService";
import { useFileUrl } from "@/hooks/useFileUrl";
import type {
  UpdateUserProfileRequest,
  MessageResponse,
  UserProfile,
} from "@/types/api";
import { useState } from "react";

const ORANGE = "#E8441A";
const CREAM = "#FEF3E8";

const schema = z.object({
  fullName: z.string().min(1, "Họ tên không được trống"),
  phoneNumber: z.string().min(9, "Số điện thoại không hợp lệ"),
});
type FormData = z.infer<typeof schema>;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const [pendingAvatarUri, setPendingAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: currentAvatarUrl } = useFileUrl(
    pendingAvatarUri
      ? null
      : ((user as UserProfile & { avatarFileKey?: string })?.avatarFileKey ??
          null),
  );
  const displayAvatar = pendingAvatarUri ?? currentAvatarUrl ?? null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setPendingAvatarUri(result.assets[0].uri);
  };

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      let avatarUrl = user?.avatarUrl ?? "";

      if (pendingAvatarUri) {
        setUploadingAvatar(true);
        const ext = pendingAvatarUri.split(".").pop() ?? "jpg";
        const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;
        const { uploadUrl, fileKey } = await fileService.getUploadUrl(
          `avatar.${ext}`,
          contentType,
        );
        await fileService.uploadFile(uploadUrl, pendingAvatarUri, contentType);
        avatarUrl = fileKey;
        setUploadingAvatar(false);
      }

      const res = await userApi.put(`/api/Users/${user!.id}`, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatarUrl,
      } satisfies UpdateUserProfileRequest);
      return extractData<MessageResponse>(res);
    },
    onSuccess: (_, data) => {
      if (user && accessToken && refreshToken) {
        setAuth({
          user: {
            ...user,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            avatarFileKey: avatarUrl,
          },
          accessToken,
          refreshToken,
        });
      }
      qc.invalidateQueries({ queryKey: ["merchant", "me"] });
      router.back();
    },
    onError: () => setUploadingAvatar(false),
  });

  const isPending = mutation.isPending || uploadingAvatar;

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
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color={ORANGE} />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          {(["fullName", "phoneNumber"] as const).map((field) => (
            <Controller
              key={field}
              control={control}
              name={field}
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <Text style={styles.label}>
                    {field === "fullName" ? "Họ và tên" : "Số điện thoại"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={
                      field === "phoneNumber" ? "phone-pad" : "default"
                    }
                  />
                  {errors[field] && (
                    <Text style={styles.error}>{errors[field]?.message}</Text>
                  )}
                </View>
              )}
            />
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.input, styles.readOnly]}>
              <Text style={styles.readOnlyText}>
                {(user as UserProfile & { email?: string })?.email ?? "—"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isPending && { opacity: 0.7 }]}
            onPress={handleSubmit((d) => mutation.mutate(d))}
            disabled={isPending}
          >
            {isPending ? (
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
  content: { padding: 16, paddingBottom: 40, alignItems: "stretch" },
  avatarWrapper: { alignSelf: "center", marginBottom: 24, marginTop: 8 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
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
  readOnly: { backgroundColor: "#fafafa", justifyContent: "center" },
  readOnlyText: { fontSize: 15, color: "#aaa" },
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
