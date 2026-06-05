// app/(auth)/otp.tsx
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 50;

// ─── API Types & Functions ────────────────────────────────────────────────────

interface OtpApiResponse {
  statusCode: string;
  success: boolean;
  data: { message: string };
  errors: string[];
}

interface VerifyResetOtpApiResponse {
  statusCode: string;
  success: boolean;
  data: { message: string; resetToken: string };
  errors: string[];
}

interface ResendOtpApiResponse {
  statusCode: string;
  success: boolean;
  data: { message: string; expiresInSeconds: string };
  errors: string[];
}

async function verifyOtpRequest(payload: {
  email: string;
  otp: string;
}): Promise<OtpApiResponse> {
  const response = await api.post<OtpApiResponse>("/api/Auth/verify-otp", {
    email: payload.email,
    otp: payload.otp,
  });
  const data = response.data;
  if (!data.success)
    throw new Error(data.errors?.[0] || "Xác thực OTP thất bại");
  return data;
}

async function verifyResetOtpRequest(payload: {
  email: string;
  otp: string;
}): Promise<VerifyResetOtpApiResponse> {
  const response = await api.post<VerifyResetOtpApiResponse>(
    "/api/Auth/verify-reset-otp",
    {
      email: payload.email,
      otp: payload.otp,
    },
  );
  const data = response.data;
  if (!data.success)
    throw new Error(data.errors?.[0] || "Xác thực OTP thất bại");
  return data;
}

async function resendOtpRequest(email: string): Promise<ResendOtpApiResponse> {
  const response = await api.post<ResendOtpApiResponse>(
    "/api/Auth/resend-otp",
    { email },
  );
  const data = response.data;
  if (!data.success)
    throw new Error(data.errors?.[0] || "Gửi lại mã OTP thất bại");
  return data;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface OtpInputProps {
  digits: string[];
  inputRefs: React.RefObject<TextInput | null>[];
  onChangeDigit: (value: string, index: number) => void;
  onKeyPress: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => void;
}

function OtpInput({
  digits,
  inputRefs,
  onChangeDigit,
  onKeyPress,
}: OtpInputProps) {
  return (
    <View style={styles.otpRow}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
          value={digit}
          onChangeText={(value) => onChangeDigit(value, index)}
          onKeyPress={(event) => onKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

interface ResendButtonProps {
  countdown: number;
  isPending: boolean;
  onResend: () => void;
}

function ResendButton({ countdown, isPending, onResend }: ResendButtonProps) {
  const canResend = countdown === 0 && !isPending;
  return (
    <TouchableOpacity
      onPress={onResend}
      disabled={!canResend}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.resendText, !canResend && styles.resendTextDisabled]}
      >
        {isPending
          ? "Đang gửi lại..."
          : `Gửi lại${countdown > 0 ? ` sau ${countdown}sec` : ""}`}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OtpScreen() {
  const { email, mode } = useLocalSearchParams<{
    email: string;
    mode?: string;
  }>();
  const isResetMode = mode === "reset";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const [serverError, setServerError] = useState("");

  const inputRef0 = useRef<TextInput>(null);
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRef4 = useRef<TextInput>(null);
  const inputRef5 = useRef<TextInput>(null);
  const inputRefs = [
    inputRef0,
    inputRef1,
    inputRef2,
    inputRef3,
    inputRef4,
    inputRef5,
  ];

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Verify OTP thường (register flow)
  const verifyMutation = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: () => {
      router.replace({ pathname: "/(auth)/login" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Mã OTP không đúng. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  // Verify Reset OTP (forgot password flow) — trả về resetToken
  const verifyResetMutation = useMutation({
    mutationFn: verifyResetOtpRequest,
    onSuccess: ({ data }) => {
      router.push({
        pathname: "/(auth)/create-password",
        params: { email: email ?? "", resetToken: data.resetToken },
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Mã OTP không đúng. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtpRequest(email ?? ""),
    onSuccess: () => {
      setCountdown(RESEND_COUNTDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      setServerError("");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Không thể gửi lại mã. Vui lòng thử lại.";
      setServerError(message);
    },
  });

  function handleChangeDigit(value: string, index: number) {
    const cleaned = value.replace(/[^0-9]/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    if (cleaned && index < OTP_LENGTH - 1)
      inputRefs[index + 1].current?.focus();
  }

  function handleKeyPress(
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handlePressVerify() {
    setServerError("");
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setServerError(`Vui lòng nhập đủ ${OTP_LENGTH} số mã OTP`);
      return;
    }

    if (isResetMode) {
      verifyResetMutation.mutate({ email: email ?? "", otp: code });
    } else {
      verifyMutation.mutate({ email: email ?? "", otp: code });
    }
  }

  const isPending = verifyMutation.isPending || verifyResetMutation.isPending;

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text style={styles.subtitle}>
        Chúng tôi đã gửi mã đến email{"\n"}
        <Text style={styles.emailText}>{email ?? "unknown@example.com"}</Text>
      </Text>

      <Text style={styles.codeLabel}>MÃ XÁC NHẬN</Text>

      <OtpInput
        digits={digits}
        inputRefs={inputRefs}
        onChangeDigit={handleChangeDigit}
        onKeyPress={handleKeyPress}
      />

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <ResendButton
        countdown={countdown}
        isPending={resendMutation.isPending}
        onResend={() => resendMutation.mutate()}
      />

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handlePressVerify}
        disabled={isPending}
        activeOpacity={0.85}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Xác nhận</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = "#EE4D2D";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logo: { width: 160, height: 60, marginBottom: 28 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emailText: { color: "#1a1a1a", fontWeight: "600" },
  codeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 1,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  otpBoxFilled: { borderColor: ORANGE },
  errorText: {
    fontSize: 13,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 12,
  },
  resendText: {
    fontSize: 14,
    color: ORANGE,
    fontWeight: "600",
    marginBottom: 32,
  },
  resendTextDisabled: { color: "#9ca3af" },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
