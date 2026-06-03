// app/ohio-merchant/app/(merchant)/change-password.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useChangePassword } from "@/hooks/useAuth";

const ORANGE = "#E8441A";

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
            <TouchableOpacity onPress={() => setShow(!show)} style={styles.eye}>
              <Ionicons
                name={show ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>
          {errors[name] && (
            <Text style={styles.error}>{errors[name].message}</Text>
          )}
        </View>
      )}
    />
  );
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

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

        {changePassword.isError && (
          <Text style={styles.error}>Mật khẩu hiện tại không đúng</Text>
        )}

        <TouchableOpacity
          style={[styles.btn, changePassword.isPending && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={changePassword.isPending}
        >
          {changePassword.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
      </View>
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
  error: { color: "#e53e3e", fontSize: 12, marginTop: 4 },
  btn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
