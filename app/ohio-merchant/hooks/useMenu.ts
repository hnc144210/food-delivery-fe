//hooks/useMenu.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/services/menuService";
import type { CatalogListParams, ProductPayload, Product, Review, PaginatedResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";
import { useMerchantStore } from "@/store/merchantStore";
import { catalogApi, extractData } from "@/lib/api";

const LIST_STALE_TIME = 30 * 1000;

export function useCategories(params?: CatalogListParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => menuService.getCategories(params),
    staleTime: LIST_STALE_TIME,
  });
}

export function useMyProducts() {
  return useQuery({
    queryKey: ["products", "merchant", "me"],
    queryFn: menuService.getMyProducts,
    staleTime: LIST_STALE_TIME,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => menuService.getProduct(id),
    enabled: Boolean(id),
    staleTime: LIST_STALE_TIME,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useMutation({
    mutationFn: (body: Omit<ProductPayload, 'merchantId'>) =>
      menuService.createProduct({ ...body, merchantId: merchantId ?? '' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Omit<ProductPayload, 'merchantId'> }) =>
      menuService.updateProduct(id, { ...body, merchantId: merchantId ?? '' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductAvailability() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      menuService.updateProductAvailability(id, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      await qc.cancelQueries({ queryKey: ['products', 'merchant', 'me'] });
      const previous = qc.getQueryData<Product[]>(['products', 'merchant', 'me']);
      qc.setQueryData<Product[]>(['products', 'merchant', 'me'], (old) =>
        old?.map((p) => p.id === id ? { ...p, isAvailable } : p) ?? []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['products', 'merchant', 'me'], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['products', 'merchant', 'me'] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: menuService.deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; isActive: boolean }) =>
      menuService.createCategory(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string; isActive: boolean } }) =>
      menuService.updateCategory(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useMerchantReviews(merchantId?: string) {
  return useQuery({
    queryKey: ['merchant-reviews', merchantId],
    queryFn: async () => {
      const res = await catalogApi.get(`/api/catalog/reviews/merchant/${merchantId}`);
      return extractData<PaginatedResponse<Review>>(res);
    },
    enabled: Boolean(merchantId),
    staleTime: 60 * 1000,
  });
}

export function useReplyReview() {
  const queryClient = useQueryClient();
  const merchantId = useMerchantStore((s) => s.merchant?.id);
  
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      catalogApi.patch(`/api/catalog/reviews/${id}/reply`, { merchantReply: content }).then(extractData),
    onSuccess: (_, { id, content }) => {
      // cập nhật cache ngay, không cần chờ refetch
      queryClient.setQueryData<PaginatedResponse<Review>>(
        ["merchant-reviews", merchantId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((r) =>
              r.id === id
                ? { ...r, merchantReply: content, repliedAt: new Date().toISOString() }
                : r
            ),
          };
        }
      );
    },
  });
}