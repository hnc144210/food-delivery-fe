import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/services/deliveryService";
import { orderService } from "@/services/orderService";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "PICKED_UP", "DELIVERING"];

export function useOrderTracking(orderId: string) {
  const orderQuery = useQuery({
    queryKey: ["order-tracking-detail", orderId],
    queryFn: () => orderService.getOrderDetail(orderId),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ACTIVE_STATUSES.includes(status) ? 15_000 : false;
    },
  });

  const isActive = orderQuery.data?.status
    ? ACTIVE_STATUSES.includes(orderQuery.data.status)
    : false;

  const locationQuery = useQuery({
    queryKey: ["order-location", orderId],
    queryFn: () => deliveryService.getLocationHistory(orderId),
    enabled: !!orderId,
    refetchInterval: isActive ? 10_000 : false,
    // không throw khi 403
    retry: false,
  });

  const latestLocation =
    locationQuery.data && locationQuery.data.length > 0
      ? locationQuery.data[0]
      : null;

  return {
    order: orderQuery.data,
    shipperLocation: latestLocation
      ? {
          latitude: parseFloat(latestLocation.latitude),
          longitude: parseFloat(latestLocation.longitude),
        }
      : null,
    isLoading: orderQuery.isLoading,
    isActive,
  };
}