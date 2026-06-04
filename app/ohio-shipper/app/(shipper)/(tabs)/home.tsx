import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { OrderCard_ForDriver } from "../../../components/features/OrderCard";
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/services/deliveryService";
import { userService } from "@/services/userService";
import { fileService } from "@/services/fileService";
import { MaterialIcons } from "@expo/vector-icons";
import { useAssignmentRealtime } from "@/hooks/useAssignmentRealtime";
import { locationService } from "@/services/locationService";

// Helper to check if status is an offer
const isOfferStatus = (status?: string) => status === 'Offering' || status === 'Pending';
const isOnlineAvailability = (status?: string) => !!status && status !== 'Offline';
const isActiveAssignmentStatus = (status?: string) =>
    !!status && !['Completed', 'Failed', 'Rejected', 'Expired', 'Cancelled', 'Pending', 'Offering'].includes(status);
const SHIPPER_LOCATION_HEARTBEAT_MS = 5000;
const ACTIVE_OFFER_REFETCH_MS = 5000;

export default function ShipperHomePage() {
    const [status, setStatus] = useState(false);
    const user = useAuthStore((s) => s.user);

    // Setup realtime listeners only (no push notifications)
    useAssignmentRealtime(status && !!user?.id);

    const { data: readUrlResponse } = useQuery({
        queryKey: ['read-url'],
        queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ''),
        enabled: !!user?.avatarFileKey
    })

    // Fix: Use stable query key 'active-offer' and add refetchInterval for polling
    const offerQuery = useQuery({
        queryKey: ['active-offer'],
        queryFn: () => deliveryService.getOffer(),
        enabled: !!user?.id && status,
        refetchInterval: status ? ACTIVE_OFFER_REFETCH_MS : false,
        refetchIntervalInBackground: true,
        refetchOnMount: 'always',
        refetchOnReconnect: true,
    })

    const { data: shipperdata } = useQuery({
        queryKey: ['shipper'],
        queryFn: () => userService.getShipperByUserId(user!.id),
        enabled: !!user?.id,
    })

    const availabilityQuery = useQuery({
        queryKey: ['shipper-availability', shipperdata?.id],
        queryFn: () => deliveryService.getAvailability(shipperdata!.id),
        enabled: !!shipperdata?.id,
    })

    useEffect(() => {
        if (!availabilityQuery.data?.status) return;
        setStatus(isOnlineAvailability(availabilityQuery.data.status));
    }, [availabilityQuery.data?.status]);

    const shouldSendLocationHeartbeat =
        status &&
        !!shipperdata?.id &&
        availabilityQuery.data?.status === 'ActiveIdle';

    useEffect(() => {
        if (!shouldSendLocationHeartbeat || !shipperdata?.id) return;

        let isCancelled = false;
        let isUpdating = false;

        const sendLocationHeartbeat = async () => {
            if (isUpdating) return;
            isUpdating = true;

            try {
                const location = await locationService.getCurrentLocation();
                if (!location || isCancelled) return;

                await deliveryService.updateShipperLocation(shipperdata.id, {
                    orderId: null,
                    latitude: location.latitude,
                    longitude: location.longitude,
                });
            } catch (error) {
                console.log('[Location] Shipper heartbeat failed:', error);
                if (!isCancelled) {
                    availabilityQuery.refetch();
                }
            } finally {
                isUpdating = false;
            }
        };

        sendLocationHeartbeat();
        const intervalId = setInterval(sendLocationHeartbeat, SHIPPER_LOCATION_HEARTBEAT_MS);

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, [shouldSendLocationHeartbeat, shipperdata?.id, availabilityQuery.refetch]);

    // Fix: Use 'offer-assignment' query key with activeAssignmentId
    const activeAssignmentId = offerQuery.data?.assignmentId;
    const activeOfferId = offerQuery.data?.offerId ?? offerQuery.data?.assignmentId ?? null;

    const offerAssignmentQuery = useQuery({
        queryKey: ['offer-assignment', activeAssignmentId],
        queryFn: () => deliveryService.getAssignmentById(activeAssignmentId!),
        enabled: !!activeAssignmentId, // Fix: Don't run query with empty ID
    })

    const currentAssignmentId = availabilityQuery.data?.currentAssignmentId;
    const currentAssignmentQuery = useQuery({
        queryKey: ['current-assignment', currentAssignmentId],
        queryFn: () => deliveryService.getAssignmentById(currentAssignmentId!),
        enabled: !!currentAssignmentId,
        refetchOnMount: 'always',
        refetchOnReconnect: true,
    })

    const toggleOnlineMutation = useMutation({
        mutationFn: async () => {
            if (!shipperdata?.id) {
                throw new Error('Shipper profile is not loaded yet');
            }

            const nextOnlineStatus = !status;
            let lat: number | null = null;
            let lng: number | null = null;

            if (nextOnlineStatus) {
                const location = await locationService.getCurrentLocation();
                if (!location) {
                    throw new Error('Location permission is required to go online');
                }

                lat = location.latitude;
                lng = location.longitude;
            }

            return deliveryService.toggleOnline(shipperdata.id, {
                isGoOnline: nextOnlineStatus,
                lat,
                lng
            });
        },
        onSuccess: async () => {
            setStatus(!status);
            await availabilityQuery.refetch();
        },
        onError: (error) => {
            console.log(error);
            Alert.alert('Error', 'Failed to toggle online status');
        }
    })

    const { data: assignedDeliveries, refetch: assignedDeliveriesRefetch, isFetching: isAssignedDeliveriesFetching } = useQuery({
        queryKey: ['assigned-deliveries', shipperdata?.id],
        queryFn: () => deliveryService.getAssignedDeliveries(shipperdata!.id),
        enabled: !!shipperdata?.id,
        refetchOnMount: 'always',
        refetchOnReconnect: true,
    })

    const setOnlineStatus = () => {
        toggleOnlineMutation.mutate();
    }

    // Fix: Include all queries in pull-to-refresh
    const handleRefresh = async () => {
        const refreshes: Promise<unknown>[] = [
            offerQuery.refetch(),
            availabilityQuery.refetch(),
            assignedDeliveriesRefetch(),
        ];

        if (activeAssignmentId) {
            refreshes.push(offerAssignmentQuery.refetch());
        }

        if (currentAssignmentId) {
            refreshes.push(currentAssignmentQuery.refetch());
        }

        await Promise.all(refreshes);
    };

    const myAssignments = assignedDeliveries?.items
    const myOffer = offerAssignmentQuery.data
    const assignmentItems = [...(myAssignments ?? [])];
    if (currentAssignmentQuery.data && !assignmentItems.some(item => item.id === currentAssignmentQuery.data?.id)) {
        assignmentItems.unshift(currentAssignmentQuery.data);
    }
    const activeAssignments = assignmentItems.filter(item => isActiveAssignmentStatus(item.status));
    const isRefreshing = isAssignedDeliveriesFetching || offerQuery.isFetching || offerAssignmentQuery.isFetching || currentAssignmentQuery.isFetching;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={{ uri: readUrlResponse?.readUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                    <View>
                        <Text style={{ color: 'white' }}>Hello!</Text>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{user?.fullName || 'NullUser'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.statusbutton} onPress={setOnlineStatus}>
                    {status && <Octicons name="dot-fill" size={20} color="green" />}
                    {!status && <Octicons name="dot" size={20} color="red" />}
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{status ? 'Online' : 'Offline'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ gap: 20, padding: 20 }} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={["#EE4D2D"]} />}>
                {/* Fix: Render both 'Offering' and 'Pending' statuses */}
                {isOfferStatus(myOffer?.status) && <View style={{ flexDirection: 'column', gap: 10, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bạn có đơn hàng đang chờ duyệt!</Text>
                    <OrderCard_ForDriver data={myOffer} offerId={activeOfferId || ''} />
                </View>}
                <View style={{ flexDirection: 'column', gap: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đơn hàng đang hoạt động</Text>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                        {activeAssignments.length > 0 ? (
                            activeAssignments.map((item, index) => <OrderCard_ForDriver key={item.id || index} data={item} offerId={""} />)
                        ) : (
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                                <MaterialIcons name="delivery-dining" size={40} color="#8c8c8c" />
                                <Text style={{ fontSize: 16, textAlign: 'center', color: '#8c8c8c' }}>Không có đơn hàng</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F6F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EE4D2D',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 8,
    },
    statusbutton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 35,
        backgroundColor: 'white',
        borderRadius: 90
    },
    ordercard_container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden'
    }
});
