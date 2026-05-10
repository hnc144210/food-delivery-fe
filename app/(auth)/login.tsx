// app/(auth)/login.tsx
import { useState } from 'react';
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
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

// ─── Schema ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email hoặc số điện thoại không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── API ─────────────────────────────────────────────────────────────────────

interface LoginResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message: string;
}

async function loginRequest(payload: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    identifier: payload.identifier,
    password: payload.password,
  });
  return data;
}

// ─── Role redirect ────────────────────────────────────────────────────────────

function redirectByRole(role: User['role']) {
  const routes: Record<User['role'], string> = {
    CUSTOMER: '/(customer)/home',
    MERCHANT: '/(merchant)/dashboard',
    SHIPPER: '/(shipper)/home',
    ADMIN: '/(admin)/users',
  };
  router.replace(routes[role] as any);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async ({ data }) => {
      await AsyncStorage.setItem('access_token', data.accessToken);
await AsyncStorage.setItem('refresh_token', data.refreshToken);
      setUser(data.user);
      redirectByRole(data.user.role);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.';
      setServerError(message);
    },
  });

  function handlePressLogin(formData: LoginFormData) {
    setServerError('');
    loginMutation.mutate(formData);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào mừng bạn trở lại 👋</Text>

        {/* Identifier */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Email hoặc số điện thoại</Text>
          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.identifier && styles.inputError]}
                placeholder="example@email.com"
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
          <Text style={styles.label}>Mật khẩu</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* Server error */}
        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(handlePressLogin)}
          disabled={loginMutation.isPending}
          activeOpacity={0.8}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerHint}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 32,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#ef4444',
  },
  serverError: {
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerHint: {
    color: '#6b7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
});