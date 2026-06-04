import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { createAssignmentConnection, realtimeEvents, AssignmentOfferedPayload } from '@/services/assignmentRealtimeService';
import { deliveryService } from '@/services/deliveryService';

export function useAssignmentRealtime(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const connection = createAssignmentConnection();

    const invalidateAssignmentState = () => {
      queryClient.invalidateQueries({ queryKey: ['active-offer'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['shipper-availability'] });
    };

    const handleAssignmentOffered = async (payload: AssignmentOfferedPayload) => {
      const assignmentId = String(payload.assignmentId);
      const offerId = String(payload.offerId ?? payload.assignmentId);

      // Update cache with active offer
      queryClient.setQueryData(['active-offer'], {
        hasActiveOffer: true,
        assignmentId,
        offerId,
        orderId: String(payload.orderId),
        expiresAt: payload.expiresAt,
      });

      // Invalidate related queries
      invalidateAssignmentState();

      // Prefetch assignment details
      queryClient.prefetchQuery({
        queryKey: ['offer-assignment', assignmentId],
        queryFn: () => deliveryService.getAssignmentById(assignmentId),
      });

      Alert.alert(
        'Có đơn hàng mới!',
        `${payload.merchant.name} - Phí: ${payload.estimatedFee}đ`,
        [{ text: 'OK' }]
      );
    };

    const handleAssignmentExpired = () => {
      invalidateAssignmentState();
      Alert.alert('Thông báo', 'Đơn hàng đã hết hạn');
    };

    const handleAssignmentAccepted = () => {
      invalidateAssignmentState();
    };

    const handleAssignmentTaken = () => {
      invalidateAssignmentState();
    };

    const handleAssignmentRejected = () => {
      invalidateAssignmentState();
    };

    connection.on(realtimeEvents.ASSIGNMENT_OFFERED, handleAssignmentOffered);
    connection.on(realtimeEvents.ASSIGNMENT_EXPIRED, handleAssignmentExpired);
    connection.on(realtimeEvents.ASSIGNMENT_ACCEPTED, handleAssignmentAccepted);
    connection.on(realtimeEvents.ASSIGNMENT_TAKEN, handleAssignmentTaken);
    connection.on(realtimeEvents.ASSIGNMENT_REJECTED, handleAssignmentRejected);

    connection
      .start()
      .catch((err: unknown) => console.error('[SignalR] Connection failed:', err));

    return () => {
      connection.off(realtimeEvents.ASSIGNMENT_OFFERED);
      connection.off(realtimeEvents.ASSIGNMENT_EXPIRED);
      connection.off(realtimeEvents.ASSIGNMENT_ACCEPTED);
      connection.off(realtimeEvents.ASSIGNMENT_TAKEN);
      connection.off(realtimeEvents.ASSIGNMENT_REJECTED);
      connection.stop().catch(console.error);
    };
  }, [enabled, queryClient]);
}
