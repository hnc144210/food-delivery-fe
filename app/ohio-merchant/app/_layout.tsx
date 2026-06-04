// app/_layout.tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("hasHydrated:", useAuthStore.persist.hasHydrated());

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      console.log("onFinishHydration fired");
      console.log(
        "token after hydration:",
        useAuthStore.getState().accessToken,
      );
      setHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      console.log(
        "already hydrated, token:",
        useAuthStore.getState().accessToken,
      );
      setHydrated(true);
    }

    return unsub;
  }, []);

  console.log("RootLayout render, hydrated:", hydrated);

  if (!hydrated) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(merchant)" />
      </Stack>
    </QueryClientProvider>
  );
}
