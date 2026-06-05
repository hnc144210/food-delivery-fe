//hooks/useMerchantOrders.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  orderService,
  type MerchantOrderListParams,
  type UpdateMerchantOrderStatusRequest,
} from "@/services/orderService";

const LIST_STALE_TIME = 30 * 1000;

export function useMerchantOrders(params?: MerchantOrderListParams) {
  return useQuery({
    queryKey: ["merchant-orders", params],
    queryFn: async () => {
      const data = await orderService.getMerchantOrders(params);
      console.log("ORDER SAMPLE:", JSON.stringify(data?.[0], null, 2));
      return data;
    },
    staleTime: LIST_STALE_TIME,
    refetchInterval: 10 * 1000,
  });
}

export function useMerchantOrder(id: string) {
  return useQuery({
    queryKey: ["merchant-orders", id],
    queryFn: () => orderService.getMerchantOrder(id),
    enabled: Boolean(id),
    staleTime: LIST_STALE_TIME,
  });
}

export function useUpdateMerchantOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateMerchantOrderStatusRequest;
    }) => orderService.updateMerchantOrderStatus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-orders"] });
    },
  });
}