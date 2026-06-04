import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { OrderCard_ForDriver } from "../../../components/features/OrderCard";
import { router } from "expo-router";
import { mock_assignment, mock_odercard, mock_offer } from "../../../mock/shipper";
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/services/deliveryService";
import { userService } from "@/services/userService";
import { fileService } from "@/services/fileService";
import { MaterialIcons } from "@expo/vector-icons";

export default function ShipperHomePage() {
    const [status, setStatus] = useState(true);
    const user = useAuthStore((s) => s.user);

    const { data: readUrlResponse } = useQuery({
        queryKey: ['read-url'],
        queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ''),
        enabled: !!user?.avatarFileKey
    })

    const { data: offerdata } = useQuery({
        queryKey: ['offers'],
        queryFn: () => deliveryService.getOffer()
    })

    const { data: offerAssignmentById } = useQuery({
        queryKey: ['offer-assignments'],
        queryFn: () => deliveryService.getAssignmentById(offerdata?.assignmentId || '')
    })

    const { data: shipperdata } = useQuery({
        queryKey: ['shipper'],
        queryFn: () => userService.getShipperByUserId(user?.id || '')
    })

    const toggleOnlineMutation = useMutation({
        mutationFn: () => deliveryService.toggleOnline(shipperdata?.id || '', { isGoOnline: !status, lat: 12, lng: 12 }),
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

    const myAssignments = assignedDeliveries?.items
    const myOffer = offerAssignmentById


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
            <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ gap: 20, padding: 20 }} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={assignedDeliveriesRefetch} colors={["#EE4D2D"]} />}>
                {myOffer?.status === 'Pending' && <View style={{ flexDirection: 'column', gap: 10, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bạn có đơn hàng đang chờ duyệt!</Text>
                    <OrderCard_ForDriver data={myOffer} offerId={myOffer.id} />
                </View>}
                <View style={{ flexDirection: 'column', gap: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đơn hàng đang hoạt động</Text>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                        {myAssignments?.filter(item => item.status !== 'Completed' && item.status !== 'Failed' && item.status !== 'Pending').length || 0 > 0 ? (
                            myAssignments?.filter(item => item.status !== 'Completed' && item.status !== 'Failed' && item.status !== 'Pending').map((item, index) => <OrderCard_ForDriver key={index} data={item} offerId={""} />)
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