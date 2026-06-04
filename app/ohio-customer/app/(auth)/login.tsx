// app/(auth)/login.tsx
import { useEffect, useState } from "react";
import { Image } from "react-native";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService } from "@/services/userService";

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  identifier: z.string().min(1, "Email hoặc số điện thoại không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── API ──────────────────────────────────────────────────────────────────────

interface LoginResponse {
  success: boolean;
  statusCode: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: string;
  };
  message: string;
  errors: string[];
}

async function loginRequest(payload: LoginFormData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/api/Auth/login",
    { email: payload.identifier, password: payload.password },
    {
      headers: {
        "X-Device-Id": "1234567890", // Có thể thay bằng device id thực tế nếu có
        "X-Device-Name": Platform.OS === "ios" ? "iOS" : "Android",
      },
    },
  );

  const data = response.data;
  if (!data.success) {
    throw new Error(data.message || "Đăng nhập không thành công");
  }
  return data;
}

// ─── Role redirect ────────────────────────────────────────────────────────────

function redirectByRole() {
  router.replace("/(customer)/home" as any);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OhioLogo() {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: 160, height: 60, marginBottom: 28 }}
      resizeMode="contain"
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    AsyncStorage.getItem("remembered_email").then((email) => {
      if (email) {
        setValue("identifier", email);
        setRememberMe(true);
      }
    });
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async ({ data }) => {
      try {
        if (rememberMe) {
          await AsyncStorage.setItem(
            "remembered_email",
            getValues("identifier"),
          );
        } else {
          await AsyncStorage.removeItem("remembered_email");
        }

        await AsyncStorage.setItem("access_token", data.accessToken);
        await AsyncStorage.setItem("refresh_token", data.refreshToken);
        await AsyncStorage.setItem("device_id", "1234567890");
        console.log("Login Success:", data);
        // Gọi API lấy thông tin Profile sau khi đăng nhập thành công
        const profile = await userService.getProfile(data.userId);

        // Cập nhật State quản lý User
        setUser({
          avatarFileKey: profile.avatarFileKey,
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          id: data.userId,
          status: profile.status,
          roles: profile.roles
        });

        redirectByRole();
      } catch (error: any) {
        console.error("Fetch profile error:", error);
        setServerError("Không thể tải thông tin cá nhân. Vui lòng thử lại.");
      }
    },
    onError: (error: any) => {
      console.log("Status:", error.response?.status);
      console.log("Data:", JSON.stringify(error.response?.data, null, 2));
      console.log("Message:", error.response?.data?.message);
      console.log("Errors:", error.response?.data?.errors);
      const message =
        error.response?.data?.message ??
        error.message ??
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  function handlePressLogin(formData: LoginFormData) {
    setServerError("");
    loginMutation.mutate(formData);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OhioLogo />

        <Text style={styles.title}>Let's Sign You In</Text>
        <Text style={styles.subtitle}>Welcome back, you've been missed</Text>

        {/* Email / Phone */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>EMAIL OR PHONE NUMBER</Text>
          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.identifier && styles.inputError]}
                placeholder="alex.j@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.identifier && (
            <Text style={styles.errorText}>{errors.identifier.message}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>PASSWORD</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  styles.input,
                  styles.passwordRow,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* Remember me + Forget password */}
        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.rememberLeft}
            onPress={() => setRememberMe((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/(auth)/forgot-password" })}
          >
            <Text style={styles.forgotText}>Forget Password</Text>
          </TouchableOpacity>
        </View>

        {/* Server error */}
        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        {/* Sign in button */}
        <TouchableOpacity
          style={[
            styles.button,
            loginMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(handlePressLogin)}
          disabled={loginMutation.isPending}
          activeOpacity={0.85}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerHint}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/(auth)/register" })}
          >
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Social login */}
        <Text style={styles.orText}>or sign up with</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={22} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={22} color="#1877F2" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ORANGE = "#EE4D2D";
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#F5F5F5" },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 32,
    textAlign: "center",
  },
  fieldWrapper: { width: "100%", marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputError: { borderColor: "#ef4444" },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 14,
  },
  errorText: { marginTop: 4, fontSize: 12, color: "#ef4444" },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  rememberLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  rememberText: { fontSize: 13, color: "#6b7280" },
  forgotText: { fontSize: 13, color: ORANGE, fontWeight: "600" },
  serverError: {
    fontSize: 13,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerHint: { color: "#6b7280", fontSize: 14 },
  registerLink: { color: ORANGE, fontSize: 14, fontWeight: "700" },
  orText: { color: "#9ca3af", fontSize: 13, marginTop: 24, marginBottom: 16 },
  socialRow: { flexDirection: "row", gap: 16 },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
});
