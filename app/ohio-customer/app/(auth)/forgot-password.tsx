// app/(auth)/forgot-password.tsx
import { useState } from 'react';
import { mockForgotPasswordResponse } from '@/mock/auth';
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
import { AxiosError } from 'axios';
import api from '@/services/api';

// ─── Schema ───────────────────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── API ──────────────────────────────────────────────────────────────────────

interface ForgotPasswordResponse {
  success: true;
  message: string;
}

async function forgotPasswordRequest(
  payload: ForgotPasswordFormData
): Promise<ForgotPasswordResponse> {
  // TODO: đổi lại khi BE xong
  return mockForgotPasswordResponse;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPasswordScreen() {
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      router.push({
        pathname: '/(auth)/otp',
        params: { email: getValues('email') },
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setServerError(message);
    },
  });

  function handlePressSendCode(formData: ForgotPasswordFormData) {
    setServerError('');
    forgotPasswordMutation.mutate(formData);
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

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Please sign in to your existing account</Text>

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

        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, forgotPasswordMutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(handlePressSendCode)}
          disabled={forgotPasswordMutation.isPending}
          activeOpacity={0.85}
        >
          {forgotPasswordMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Code</Text>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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