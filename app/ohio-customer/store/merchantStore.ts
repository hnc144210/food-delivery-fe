// store/merchantStore.ts
import { create } from 'zustand';

interface MerchantStore {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export const useMerchantStore = create<MerchantStore>()((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
}));