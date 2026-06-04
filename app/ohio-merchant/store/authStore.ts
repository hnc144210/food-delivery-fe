// store/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserProfile } from '@/types/api';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (payload: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: ({ user, accessToken, refreshToken }) => {
        console.log("AUTH STORE SET", user.id);
        set({ user, accessToken, refreshToken });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        console.log("AUTH STORE CLEAR CALLED");
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'ohio_merchant_auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);