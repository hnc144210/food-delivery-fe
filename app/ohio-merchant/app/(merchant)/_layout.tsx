// app/(merchant)/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function MerchantLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

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
    </Stack>
  );
}
