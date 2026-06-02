import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Merchant } from '@/services/merchantService';

interface MerchantStore {
  merchant: Merchant | null;
  isOpen: boolean;
  setMerchant: (m: Merchant) => void;
  setIsOpen: (v: boolean) => void;
  clearMerchant: () => void;
}

export const useMerchantStore = create<MerchantStore>()(
  persist(
    (set) => ({
      merchant: null,
      isOpen: false,
      setMerchant: (merchant) => set({ merchant, isOpen: merchant.isOpen }),
      setIsOpen: (isOpen) => set({ isOpen }),
      clearMerchant: () => set({ merchant: null, isOpen: false }),
    }),
    {
      name: 'ohio_merchant_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);