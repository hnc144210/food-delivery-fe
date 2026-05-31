import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { OrderCard_ForDriver } from "../../../components/features/OrderCard";
import { router } from "expo-router";
import { mock_odercard, mock_shipper_new } from "../../../mock/shipper";
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/services/deliveryService";
import { userService } from "@/services/userService";

export default function ShipperHomePage() {
    const [status, setStatus] = useState(true);
    const user = useAuthStore((s) => s.user);

    const { data: shipperdata } = useQuery({
        queryKey: ['shipper'],
        queryFn: () => userService.getShipperProfileByUserId(user?.id || '')
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

    const { data: assignedDeliveries } = useQuery({
        queryKey: ['assigned-deliveries'],
        queryFn: () => deliveryService.getAssignedDeliveries(shipperdata?.id || '')
    })

    const setOnlineStatus = () => {
        toggleOnlineMutation.mutate();
    }

    const myAssignments = assignedDeliveries?.items || mock_odercard

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={{ uri: user?.avatar_url ? user.avatar_url : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                    <View>
                        <Text style={{ color: 'white' }}>Hello!</Text>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{user?.name || 'NullUser'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.statusbutton} onPress={setOnlineStatus}>
                    {status && <Octicons name="dot-fill" size={20} color="green" />}
                    {!status && <Octicons name="dot" size={20} color="red" />}
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{status ? 'Online' : 'Offline'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
                {myAssignments.some(item => item.status === 'PENDING') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Đang chờ xử lý</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {myAssignments.filter(item => item.status === 'PENDING').map((item, index) => <OrderCard_ForDriver key={index} {...item} />)}
                        </View>
                    </View>}

                {myAssignments.some(item => item.status === 'READY') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Sẵn sàng giao hàng</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {myAssignments.filter(item => item.status === 'READY').map((item, index) => <OrderCard_ForDriver key={index} {...item} />)}
                        </View>
                    </View>}
                {myAssignments.some(item => item.status === 'DELIVERING') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Đang giao hàng</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {myAssignments.filter(item => item.status === 'DELIVERING').map((item, index) => <OrderCard_ForDriver key={index} {...item} />)}
                        </View>
                    </View>}
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