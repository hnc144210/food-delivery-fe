// app/(auth)/otp.tsx
import { useRef, useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useResendOtp, useVerifyOtp, useVerifyResetOtp } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
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

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 50;

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
        Resend{countdown > 0 ? ` in ${countdown}sec` : ""}
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

  const verifyMutation = useVerifyOtp();
  const verifyResetMutation = useVerifyResetOtp();
  const resendMutation = useResendOtp();

  const isPending = verifyMutation.isPending || verifyResetMutation.isPending;

  function handleChangeDigit(value: string, index: number) {
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < OTP_LENGTH - 1) inputRefs[index + 1].current?.focus();
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
      setServerError("Vui lòng nhập đủ mã OTP");
      return;
    }

    if (isResetMode) {
      verifyResetMutation.mutate(
        { email, otp: code },
        {
          onSuccess: (data) =>
            router.push({
              pathname: "/(auth)/create-password",
              params: { email, resetToken: data.resetToken },
            }),
          onError: (error) => setServerError(getApiErrorMessage(error)),
        },
      );
    } else {
      verifyMutation.mutate(
        { email, otp: code },
        {
          onSuccess: () => router.replace({ pathname: "/(auth)/login" }),
          onError: (error) => setServerError(getApiErrorMessage(error)),
        },
      );
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>
        We have sent a code to your email{"\n"}
        <Text style={styles.emailText}>{email}</Text>
      </Text>
      <Text style={styles.codeLabel}>CODE</Text>
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
        onResend={() =>
          resendMutation.mutate(
            { email },
            {
              onSuccess: () => {
                setCountdown(RESEND_COUNTDOWN_SECONDS);
                setDigits(Array(OTP_LENGTH).fill(""));
                setServerError("");
              },
              onError: (error) => setServerError(getApiErrorMessage(error)),
            },
          )
        }
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
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = "#E8441A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logo: {
    width: 160,
    height: 60,
    marginBottom: 28,
  },
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
  emailText: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
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
    gap: 12,
    marginBottom: 20,
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  otpBoxFilled: {
    borderColor: ORANGE,
  },
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
  resendTextDisabled: {
    color: "#9ca3af",
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
