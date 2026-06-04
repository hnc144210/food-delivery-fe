import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { useState } from "react";
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

export default function ShipperHomePage() {
    const [status, setStatus] = useState(true);
    const user = useAuthStore((s) => s.user);

    // Setup realtime listeners only (no push notifications)
    useAssignmentRealtime(status);

    const { data: readUrlResponse } = useQuery({
        queryKey: ['read-url'],
        queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ''),
        enabled: !!user?.avatarFileKey
    })

    // Fix: Use stable query key 'active-offer' and add refetchInterval for polling
    const offerQuery = useQuery({
        queryKey: ['active-offer'],
        queryFn: () => deliveryService.getOffer(),
        refetchInterval: status ? 10000 : false, // Polling fallback: 10s when online
    })

    const { data: shipperdata } = useQuery({
        queryKey: ['shipper'],
        queryFn: () => userService.getShipperByUserId(user?.id || '')
    })

    // Fix: Use 'offer-assignment' query key with activeAssignmentId
    const activeAssignmentId = offerQuery.data?.assignmentId;
    const activeOfferId = offerQuery.data?.offerId ?? offerQuery.data?.assignmentId ?? null;

    const offerAssignmentQuery = useQuery({
        queryKey: ['offer-assignment', activeAssignmentId],
        queryFn: () => deliveryService.getAssignmentById(activeAssignmentId!),
        enabled: !!activeAssignmentId, // Fix: Don't run query with empty ID
    })

    const toggleOnlineMutation = useMutation({
        mutationFn: async () => {
            // Get real location
            const location = await locationService.getCurrentLocation();
            const lat = location?.latitude ?? 12;
            const lng = location?.longitude ?? 12;

            return deliveryService.toggleOnline(shipperdata?.id || '', {
                isGoOnline: !status,
                lat,
                lng
            });
        },
        onSuccess: () => {
            setStatus(!status);
        },
        onError: (error) => {
            console.log(error);
            Alert.alert('Error', 'Failed to toggle online status');
        }
    })

    const { data: assignedDeliveries, refetch: assignedDeliveriesRefetch, isFetching: isRefreshing } = useQuery({
        queryKey: ['assigned-deliveries'],
        queryFn: () => deliveryService.getAssignedDeliveries(shipperdata?.id || '')
    })

    const setOnlineStatus = () => {
        toggleOnlineMutation.mutate();
    }

    // Fix: Include all queries in pull-to-refresh
    const handleRefresh = async () => {
        await Promise.all([
            offerQuery.refetch(),
            offerAssignmentQuery.refetch(),
            assignedDeliveriesRefetch(),
        ]);
    };

    const myAssignments = assignedDeliveries?.items
    const myOffer = offerAssignmentQuery.data

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
                        {myAssignments?.filter(item => item.status !== 'Completed' && item.status !== 'Failed' && item.status !== 'Pending' && item.status !== 'Offering').length || 0 > 0 ? (
                            myAssignments?.filter(item => item.status !== 'Completed' && item.status !== 'Failed' && item.status !== 'Pending' && item.status !== 'Offering').map((item, index) => <OrderCard_ForDriver key={index} data={item} offerId={""} />)
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