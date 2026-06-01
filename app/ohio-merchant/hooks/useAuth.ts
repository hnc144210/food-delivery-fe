import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (auth) => {
      const user = await userService.getUser(auth.userId);

      setAuth({
        user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
      });

      router.replace('/(merchant)/(tabs)/orders');
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