// app/(merchant)/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";

export default function MerchantLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  useMerchantProfile();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/(auth)/login");
    }
  }, [accessToken]);

  if (!accessToken) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-dish" />
      <Stack.Screen name="category-layout" />
      <Stack.Screen name="feedbacks" />
      <Stack.Screen name="store-info" />
      <Stack.Screen name="opening-hours" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="store-addresses" />
      <Stack.Screen name="wallet" />
    </Stack>
  );
}
