// app/(auth)/change-password.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Nhập lại mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

// ─── API Types & Function ─────────────────────────────────────────────────────

interface ChangePasswordApiResponse {
  statusCode: string;
  success: boolean;
  data: { message: string };
  errors: string[];
}

async function changePasswordRequest(
  payload: FormData,
): Promise<ChangePasswordApiResponse> {
  const response = await api.post<ChangePasswordApiResponse>(
    "/api/Auth/change-password",
    {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    },
  );
  const data = response.data;
  if (!data.success)
    throw new Error(data.errors?.[0] || "Đổi mật khẩu thất bại");
  return data;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PasswordField({ label, control, name, errors }: any) {
  const [show, setShow] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!show}
              placeholder="••••••••"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              onPress={() => setShow((prev) => !prev)}
              style={styles.eye}
            >
              <Ionicons
                name={show ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>
          {errors[name] && (
            <Text style={styles.errorText}>{errors[name].message}</Text>
          )}
        </View>
      )}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      reset();
      router.back();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  function onSubmit(data: FormData) {
    setServerError("");
    changePasswordMutation.mutate(data);
  }

  return (
    <SafeAreaView style={styles.flex} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.content}>
        <PasswordField
          label="Mật khẩu hiện tại"
          control={control}
          name="currentPassword"
          errors={errors}
        />
        <PasswordField
          label="Mật khẩu mới"
          control={control}
          name="newPassword"
          errors={errors}
        />
        <PasswordField
          label="Xác nhận mật khẩu mới"
          control={control}
          name="confirmPassword"
          errors={errors}
        />

        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.btn,
            changePasswordMutation.isPending && styles.btnDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = "#EE4D2D";

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { padding: 16, gap: 4 },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1a1a1a",
  },
  eye: { paddingHorizontal: 12 },
  errorText: { color: "#e53e3e", fontSize: 12, marginTop: 4 },
  serverError: {
    color: "#e53e3e",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  btn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
