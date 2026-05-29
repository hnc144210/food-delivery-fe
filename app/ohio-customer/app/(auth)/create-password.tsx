// app/(auth)/create-password.tsx
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
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import api from '@/services/api';

// ─── Schema ───────────────────────────────────────────────────────────────────

const createPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

// ─── API ──────────────────────────────────────────────────────────────────────

interface CreatePasswordResponse {
  success: true;
  message: string;
}

async function createPasswordRequest(
  payload: CreatePasswordFormData
): Promise<CreatePasswordResponse> {
  const { data } = await api.post<CreatePasswordResponse>('/auth/create-password', payload);
  return data;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreatePasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const createPasswordMutation = useMutation({
    mutationFn: createPasswordRequest,
    onSuccess: () => {
      router.replace({ pathname: '/(auth)/login' });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setServerError(message);
    },
  });

  function handlePressCreate(formData: CreatePasswordFormData) {
    setServerError('');
    createPasswordMutation.mutate(formData);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Getting Started</Text>
        <Text style={styles.subtitle}>Set your password</Text>

        {/* Password */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>PASSWORD</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.inputText}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
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

        {/* Confirm Password */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>CONFIRM PASSWORD</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.inputText}
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}
        </View>

        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, createPasswordMutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(handlePressCreate)}
          disabled={createPasswordMutation.isPending}
          activeOpacity={0.85}
        >
          {createPasswordMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create New Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = '#E8441A';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 160,
    height: 60,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 32,
    textAlign: 'center',
  },
  fieldWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 14,
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
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});