# Shipper Assignment Offer Flow - FE Handoff

Generated: 2026-06-04

Update: the non-push frontend fixes have now been applied in `app/ohio-shipper`: SignalR assignment hub listeners, active-offer query guards, `Offering` status support, path-based accept/reject, backend-backed availability status, 5-second `ActiveIdle` location heartbeat, and lifecycle query invalidation. Push notification support is still intentionally skipped.

## Verdict

The current `app/ohio-shipper` frontend now matches the planned foreground assignment-offer flow, excluding push notifications.

When the shipper app is open and the shipper is online/available, it connects to `/hubs/assignments`, reacts to assignment offer lifecycle events, shows the active offer, supports accept/reject, and sends a 5-second location heartbeat while backend availability is `ActiveIdle`. The remaining intentional gap is background/offline push notification support.

## Expected Backend Flow

Backend flow found in the current BE code:

1. DeliveryService consumes:
   - `OrderReadyForPickupEvent`
   - `OrderCompletedEvent`
2. DeliveryService creates `ShipperAssignment` offers for available nearby shippers.
3. DeliveryService publishes `assignment.offered`.
4. NotificationService consumes `AssignmentOfferedEvent`.
5. NotificationService sends realtime event `AssignmentOffered` through SignalR hub:
   - `/hubs/assignments`
6. If no realtime connection exists, NotificationService can send push notifications to registered devices.

Important backend contracts:

```text
GET  /api/Deliveries/shippers/me/active-offer
GET  /api/Deliveries/shippers/{shipperId}/availability
PATCH /api/Deliveries/shippers/{shipperId}/location
GET  /api/Deliveries/assignments/{assignmentId}
POST /api/Deliveries/assignments/{assignmentId}/accept
POST /api/Deliveries/assignments/{assignmentId}/reject
POST /api/Notifications/devices
SignalR hub: /hubs/assignments
SignalR event: AssignmentOffered
SignalR lifecycle events: AssignmentExpired, AssignmentAccepted, AssignmentTaken, AssignmentRejected
```

`AssignmentOffered` realtime payload includes:

```ts
{
  type: "ASSIGNMENT_OFFERED",
  assignmentId: string,
  offerId: string,
  orderId: string,
  merchant: {
    id: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number
  },
  customer: {
    id: string,
    name: string,
    phone: string
  },
  dropoff: {
    address: string,
    latitude: number,
    longitude: number
  },
  estimatedDistanceToMerchantKm: number,
  estimatedDeliveryDistanceKm: number,
  estimatedFee: number,
  expiresAt: string
}
```

## Current FE State

Relevant shipper FE files:

```text
app/ohio-shipper/app/(shipper)/(tabs)/home.tsx
app/ohio-shipper/components/features/OrderCard.tsx
app/ohio-shipper/services/deliveryService.ts
app/ohio-shipper/types/assignment.ts
app/ohio-shipper/package.json
```

What already exists:

- `deliveryService.getOffer()` calls `GET /api/Deliveries/shippers/me/active-offer`.
- `deliveryService.getAssignmentById()` calls `GET /api/Deliveries/assignments/{assignmentId}`.
- `deliveryService.acceptAssignment()` and `deliveryService.rejectAssignment()` exist for path-based accept/reject.
- `deliveryService.acceptOffer()` calls legacy `POST /api/Deliveries/assignments/accept`.
- `home.tsx` tries to show a pending offer card.
- `OrderCard_ForDriver` has confirm/reject buttons.

## Historical Audit Items Fixed

The items below were the gaps found during the audit. Items 1 and 3-9 have been addressed in the current shipper app code, including the 5-second `ActiveIdle` location heartbeat. Item 2 is intentionally skipped for now: push notification registration/handling for backgrounded or disconnected apps.

1. No realtime assignment listener exists in the shipper app.

   `package.json` does not include `@microsoft/signalr`, and the app has no connection to `/hubs/assignments`. So a new backend `AssignmentOffered` event will not automatically appear on screen.

2. No push notification receiving/registering exists.

   `package.json` does not include `expo-notifications`, and the app does not call `POST /api/Notifications/devices`. If the shipper app is backgrounded or disconnected from SignalR, the backend cannot notify this device through push.

3. Active offer is fetched only as a normal query.

   `home.tsx` fetches `getOffer()` once through React Query. There is no realtime invalidation, no polling fallback, and pull-to-refresh only refetches `assigned-deliveries`, not `offers` or `offer-assignments`.

4. The assignment-by-id query can run with an empty assignment id.

   Current code uses:

   ```ts
   queryKey: ['offer-assignments'],
   queryFn: () => deliveryService.getAssignmentById(offerdata?.assignmentId || '')
   ```

   This can call `/api/Deliveries/assignments/` before `offerdata.assignmentId` exists. Because the query key is static, React Query may not automatically refetch when the real id arrives.

5. Status mismatch: backend creates modern offers with `Offering`, but `home.tsx` only renders `Pending`.

   Backend `AssignmentStatus` includes `Offering`, and `TryCreateAssignmentOfferAsync` sets new offers to `Offering`. Current home screen checks:

   ```ts
   myOffer?.status === 'Pending'
   ```

   So a valid new offer with status `Offering` may not be displayed.

6. Button logic only acts on `Pending`.

   `OrderCard_ForDriver` shows buttons for `Offering` or `Pending`, but `handleAccept()` and `handleReject()` only mutate when status is `Pending`. For `Offering`, buttons render but do nothing.

7. Reject body name mismatch on the legacy endpoint.

   FE type uses `rejectionReason`, but backend legacy `AcceptAssignmentRequest` expects `rejectReason`. This matters if the FE keeps using `POST /api/Deliveries/assignments/accept` for both accept and reject.

8. The card receives `offerId={myOffer.id}` instead of the active offer response's `offerId`.

   Today backend `offerId` equals `assignmentId`, but FE should still pass the explicit `offerdata.offerId` so the contract stays clear.

9. Availability/location is fragile.

   `home.tsx` starts local status as `true`, but does not fetch actual backend availability. `toggleOnline()` sends hard-coded `{ lat: 12, lng: 12 }`. The backend assignment finder depends on online availability and nearby/fresh location data, so real device location should be sent.

## Recommended FE Implementation

### 1. Add realtime dependency

```bash
npm install @microsoft/signalr
```

If push notifications are required for background/offline delivery:

```bash
npm install expo-notifications
```

### 2. Add an assignment realtime service

Create something like:

```text
app/ohio-shipper/services/assignmentRealtimeService.ts
```

Suggested shape:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '@/constants/config';

const gatewayBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

export function createAssignmentConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${gatewayBaseUrl}/hubs/assignments`, {
      accessTokenFactory: async () => (await AsyncStorage.getItem('access_token')) ?? '',
    })
    .withAutomaticReconnect()
    .build();
}
```

Note: the current production `API_BASE_URL` is `https://placeholder.railway.app/api`, while all services also prefix paths with `/api/...`. FE team should confirm whether production base URL should be the gateway root, not `/api`, to avoid `/api/api/...`.

### 3. Add a hook to listen for assignment events

Example:

```ts
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { createAssignmentConnection } from '@/services/assignmentRealtimeService';
import { deliveryService } from '@/services/deliveryService';

export function useAssignmentRealtime(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const connection = createAssignmentConnection();

    connection.on('AssignmentOffered', async (payload) => {
      const assignmentId = String(payload.assignmentId);

      queryClient.setQueryData(['active-offer'], {
        hasActiveOffer: true,
        assignmentId,
        offerId: String(payload.offerId ?? payload.assignmentId),
        orderId: String(payload.orderId),
        expiresAt: payload.expiresAt,
      });

      queryClient.invalidateQueries({ queryKey: ['active-offer'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });

      queryClient.prefetchQuery({
        queryKey: ['offer-assignment', assignmentId],
        queryFn: () => deliveryService.getAssignmentById(assignmentId),
      });

      Alert.alert('New delivery assignment', 'You have a new offer waiting.');
    });

    connection.on('AssignmentExpired', () => {
      queryClient.invalidateQueries({ queryKey: ['active-offer'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
    });

    connection.on('AssignmentAccepted', () => {
      queryClient.invalidateQueries({ queryKey: ['active-offer'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
    });

    connection.on('AssignmentTaken', () => {
      queryClient.invalidateQueries({ queryKey: ['active-offer'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
    });

    connection.start().catch(console.error);

    return () => {
      connection.stop().catch(console.error);
    };
  }, [enabled, queryClient]);
}
```

### 4. Fix active-offer queries in `home.tsx`

Use stable query keys and `enabled` guards:

```ts
const offerQuery = useQuery({
  queryKey: ['active-offer'],
  queryFn: () => deliveryService.getOffer(),
  refetchInterval: status ? 10000 : false,
});

const activeAssignmentId = offerQuery.data?.assignmentId;
const activeOfferId = offerQuery.data?.offerId ?? offerQuery.data?.assignmentId ?? null;

const offerAssignmentQuery = useQuery({
  queryKey: ['offer-assignment', activeAssignmentId],
  queryFn: () => deliveryService.getAssignmentById(activeAssignmentId!),
  enabled: !!activeAssignmentId,
});

const refetchHome = async () => {
  await Promise.all([
    offerQuery.refetch(),
    offerAssignmentQuery.refetch(),
    assignedDeliveriesRefetch(),
  ]);
};
```

Then use `refetchHome` for pull-to-refresh instead of only `assignedDeliveriesRefetch`.

### 5. Render both `Offering` and `Pending`

Use one helper:

```ts
const isOfferStatus = (status?: string) => status === 'Offering' || status === 'Pending';
```

In `home.tsx`:

```tsx
{isOfferStatus(myOffer?.status) && (
  <View style={{ flexDirection: 'column', gap: 10 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      Ban co don hang dang cho xac nhan!
    </Text>
    <OrderCard_ForDriver data={myOffer} offerId={activeOfferId} />
  </View>
)}
```

In `OrderCard_ForDriver`, make accept/reject work for both statuses:

```ts
const isOffer = data.status === 'Offering' || data.status === 'Pending';

const handleAccept = () => {
  if (!isOffer) return;
  acceptAssignmentMutation.mutate(data.id);
};

const handleReject = () => {
  if (!isOffer) return;
  rejectAssignmentMutation.mutate({
    assignmentId: data.id,
    offerId: offerId ?? data.id,
    reason: 'Shipper cannot deliver right now',
  });
};
```

### 6. Prefer path-based accept/reject endpoints

The path-based endpoints are clearer and avoid the legacy `rejectReason` vs `rejectionReason` mismatch.

Suggested service shape:

```ts
acceptAssignment: async (assignmentId: string) => {
  const response = await api.post<ApiConfirmationResponse>(
    `/api/Deliveries/assignments/${assignmentId}/accept`
  );
  return response.data.data;
},

rejectAssignment: async (
  assignmentId: string,
  request: { offerId: string | null; reason: string }
) => {
  const response = await api.post<ApiConfirmationResponse>(
    `/api/Deliveries/assignments/${assignmentId}/reject`,
    request
  );
  return response.data.data;
},
```

If FE keeps the legacy endpoint, rename the request property to `rejectReason`:

```ts
{
  assignmentId,
  offerId,
  isAccepted: false,
  rejectReason: 'Shipper cannot deliver right now'
}
```

### 7. Optional push notification support

If assignment offers must appear when the app is backgrounded:

1. Register Expo push token after login.
2. Call:

   ```text
   POST /api/Notifications/devices
   ```

   Body:

   ```json
   {
     "deviceToken": "<expoPushToken>",
     "deviceType": "Expo"
   }
   ```

3. On notification tap, read `AssignmentId` from notification data and navigate to the offer/home screen.
4. Refetch:
   - `active-offer`
   - `offer-assignment`
   - `assigned-deliveries`

FE team should confirm the exact `DeviceType` enum values accepted by NotificationService before wiring this.

### 8. Fix availability and location

For the backend to create offers, the shipper must be `ActiveIdle` with a fresh nearby location.

Recommended:

- Fetch actual shipper availability on app start/home screen.
- Use real GPS from `expo-location`.
- Send real coordinates to:

  ```text
  POST /api/Deliveries/availability/toggle?shipperId={shipperId}
  ```

- Consider periodically updating location while online if the backend expects fresh Redis location.

## Acceptance Checklist

Use this checklist after FE changes:

- Shipper logs in and goes online with a real/current location.
- While backend availability is `ActiveIdle`, the shipper app calls `PATCH /api/Deliveries/shippers/{shipperId}/location` about every 5 seconds.
- After 30+ seconds online and idle, the backend `LastSeenAt` remains fresh enough for assignment discovery.
- Trigger an order ready event (`order.ready_for_pickup`) or completed event (`order.completed`) from backend flow.
- Shipper receives `AssignmentOffered` from `/hubs/assignments` without reopening the app.
- Offer card appears on the shipper home screen with status `Offering` or `Pending`.
- Pull-to-refresh also loads the active offer if realtime was missed.
- Confirm calls `POST /api/Deliveries/assignments/{assignmentId}/accept`.
- Reject calls `POST /api/Deliveries/assignments/{assignmentId}/reject` with a non-empty reason.
- After accept, the offer disappears and the assignment appears in active deliveries.
- After reject/expired/taken, the offer card disappears.
- If push is implemented, backgrounded app receives a notification and opens/refetches the offer correctly.

## Minimal Version If Time Is Short

If FE cannot implement full realtime/push immediately, do this minimum:

1. Fix query keys and `enabled` guards.
2. Add `refetchInterval` for `active-offer` while shipper is online.
3. Include `offers` and `offer-assignment` in pull-to-refresh.
4. Render and handle both `Offering` and `Pending`.
5. Use path-based accept/reject endpoints.

This polling version is not as good as the planned realtime flow, but it will make backend-created offers appear without requiring the user to restart the app.
