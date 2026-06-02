import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { merchantService } from '@/services/merchantService';
import { useMerchantStore } from '@/store/merchantStore';
import type {
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
} from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setMerchant = useMerchantStore((state) => state.setMerchant);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (auth) => {
      await AsyncStorage.multiSet([
    ['access_token', auth.accessToken],
    ['refresh_token', auth.refreshToken],
  ]);
      console.log("LOGIN SUCCESS", auth);

      const user = await userService.getUser(auth.userId);
      console.log("USER SUCCESS", user);

      setAuth({
        user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
      });

      console.log("AUTH STORED");

      try {
        console.log("FETCH MERCHANT START");

        const merchant = await merchantService.getMerchantByUser(auth.userId);

        console.log("FETCH MERCHANT SUCCESS", merchant);

        setMerchant(merchant);
      } catch (e) {
        console.log("FETCH MERCHANT ERROR", e);
      }

      console.log("ROUTING...");
      router.replace('/(merchant)/(tabs)/orders');
      console.log("ROUTED");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: authService.verifyOtp,
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: authService.resendOtp,
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      router.replace('/(auth)/login');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authService.changePassword,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => authService.forgotPassword(body),
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: (body: VerifyResetOtpRequest) => authService.verifyResetOtp(body),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => authService.resetPassword(body),
  });
}