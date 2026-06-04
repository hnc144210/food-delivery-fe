//hooks/useMerchantProfile.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMerchantStore } from '@/store/merchantStore';
import { useAuthStore } from '@/store/authStore';
import { merchantService, type UpdateMerchantRequest} from '@/services/merchantService';
import type { CreateMerchantAddressRequest } from '@/types/api';
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
  const userId = useAuthStore((s) => s.user?.id);  // thêm dòng này

  return useMutation({
    mutationFn: (body: UpdateMerchantRequest) =>
      merchantService.updateMerchant(merchantId!, body),
    onSuccess: async () => {
      if (userId) {
        const updated = await merchantService.getMerchantByUser(userId);  // truyền userId
        setMerchant(updated);
      }
      qc.invalidateQueries({ queryKey: ['merchant'] });
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
export function useMerchantAddresses() {
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useQuery({
    queryKey: ['merchant-addresses', merchantId],
    queryFn: () => merchantService.getMerchantAddresses(merchantId!),
    enabled: Boolean(merchantId),
    staleTime: STALE_TIME,
  });
}

export function useCreateMerchantAddress() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useMutation({
    mutationFn: (body: CreateMerchantAddressRequest) =>
      merchantService.createMerchantAddress(merchantId!, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merchant-addresses', merchantId] }),
  });
}

export function useUpdateMerchantAddress() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useMutation({
    mutationFn: ({ addressId, body }: { addressId: string; body: CreateMerchantAddressRequest }) =>
      merchantService.updateMerchantAddress(merchantId!, addressId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merchant-addresses', merchantId] }),
  });
}

export function useDeleteMerchantAddress() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useMutation({
    mutationFn: (addressId: string) =>
      merchantService.deleteMerchantAddress(merchantId!, addressId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merchant-addresses', merchantId] }),
  });
}