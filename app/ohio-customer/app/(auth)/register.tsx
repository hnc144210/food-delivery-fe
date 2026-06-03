// app/(auth)/register.tsx
import { useState } from "react";
import { Image, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import api from "@/services/api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(9, "Số điện thoại không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── API Types & Function ─────────────────────────────────────────────────────

interface RegisterResponse {
  statusCode: string;
  success: boolean;
  data: {
    userId: string;
    email: string;
    message: string;
    requiresOtpVerification: boolean;
  };
  errors: string[];
}

async function registerRequest(
  payload: RegisterFormData,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/api/Auth/register", {
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
  });
  const data = response.data;
  if (!data.success) {
    throw new Error(data.errors?.[0] || "Đăng ký thất bại");
  }
  return data;
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

export default function RegisterScreen() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phoneNumber: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      router.push({
        pathname: "/(auth)/otp",
        params: { email: getValues("email") },
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Đăng ký thất bại. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  function handlePressRegister(formData: RegisterFormData) {
    setServerError("");
    registerMutation.mutate(formData);
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

        <Text style={styles.title}>Getting Started</Text>
        <Text style={styles.subtitle}>Create an account to continue!</Text>

        {/* Full Name */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>FULL NAME</Text>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Michael Jordan"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>EMAIL</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="alex.j@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                placeholder="0901234567"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
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

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to{" "}
          <Text style={styles.termsLink}>Terms of Use</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>

        {/* Server error */}
        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        {/* Sign Up button */}
        <TouchableOpacity
          style={[
            styles.button,
            registerMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(handlePressRegister)}
          disabled={registerMutation.isPending}
          activeOpacity={0.85}
        >
          {registerMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.replace({ pathname: "/(auth)/login" })}
          >
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Social */}
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
    marginBottom: 28,
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
  termsText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  termsLink: { color: ORANGE, fontWeight: "600" },
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginHint: { color: "#6b7280", fontSize: 14 },
  loginLink: { color: ORANGE, fontSize: 14, fontWeight: "700" },
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
