import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { merchantService, type UpdateMerchantRequest } from '@/services/merchantService';
import { useMerchantStore } from '@/store/merchantStore';
import { useAuthStore } from '@/store/authStore';

const STALE_TIME = 5 * 60 * 1000;

export function useMerchantProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const setMerchant = useMerchantStore((s) => s.setMerchant);

  return useQuery({
    queryKey: ['merchant', 'me', userId],
    queryFn: async () => {
      const merchant = await merchantService.getMerchantByUser(userId!);
      setMerchant(merchant);
      return merchant;
    },
    enabled: Boolean(userId),
    staleTime: STALE_TIME,
  });
}

export function useUpdateMerchant() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);
  const setMerchant = useMerchantStore((s) => s.setMerchant);

  return useMutation({
    mutationFn: (body: UpdateMerchantRequest) =>
      merchantService.updateMerchant(merchantId!, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['merchant'] });
    },
  });
}

export function useToggleStoreOpen() {
  const merchant = useMerchantStore((s) => s.merchant);
  const setIsOpen = useMerchantStore((s) => s.setIsOpen);
  const updateMerchant = useUpdateMerchant();

  return {
    isOpen: useMerchantStore((s) => s.isOpen),
    toggle: (value: boolean) => {
      setIsOpen(value); // optimistic
      updateMerchant.mutate(
        { isOpen: value },
        {
          onError: () => setIsOpen(!value), // rollback nếu lỗi
        }
      );
    },
    isPending: updateMerchant.isPending,
  };
}