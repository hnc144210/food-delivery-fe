import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/services/menuService";
import type { CatalogListParams, ProductPayload } from "@/types/api";
import { useAuthStore } from "@/store/authStore";

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
  const userId = useAuthStore((state) => state.user?.id);
  console.log('useCreateProduct - userId:', userId);

  return useMutation({
    mutationFn: (body: Omit<ProductPayload, 'merchantId'>) =>
      menuService.createProduct({ ...body, merchantId: userId ?? '' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
    
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Omit<ProductPayload, 'merchantId'> }) =>
      menuService.updateProduct(id, { ...body, merchantId: userId ?? '' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductAvailability() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      menuService.updateProductAvailability(id, { isAvailable }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
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