import { Text, View, StyleSheet, ScrollView } from "react-native";
import { OrderCardHistory_ForDriver } from "../../../components/features/OrderCard";
import { useRouter } from "expo-router";
import { mock_assignment, mock_odercard } from "../../../mock/shipper";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "../../../services/deliveryService";
import { userService } from "@/services/userService";

export default function HistoryPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    const { data: shipperdata } = useQuery({
        queryKey: ['shipper'],
        queryFn: () => userService.getShipperByUserId(user?.id || '')
    })

    const { data: assignedDeliveries, refetch: assignedDeliveriesRefetch, isFetching: isRefreshing } = useQuery({
        queryKey: ['assigned-deliveries'],
        queryFn: () => deliveryService.getAssignedDeliveries(shipperdata?.id || '')
    })

    const assignedHistory = mock_assignment.filter(f => f.status === 'Completed' || f.status === 'Failed') || assignedDeliveries?.items.filter(f => f.status === 'Completed' || f.status === 'Failed');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Lịch sử giao hàng</Text>
            </View>
            <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingTop: 20 }}>
                {assignedHistory?.map((item, index) => <OrderCardHistory_ForDriver key={index} {...item} />)}
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
        paddingHorizontal: 30,
        gap: 8,
    }
});