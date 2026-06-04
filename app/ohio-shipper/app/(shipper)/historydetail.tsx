import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { ProductCard_ForDriver } from "../../components/features/ProductCard";
import { mock_merchant, mock_order_detail, } from "../../mock/shipper";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { ShipperAssignmentDto } from "@/types/assignment";

export default function HistoryDetail() {
    const { data } = useLocalSearchParams();
    const assignment = JSON.parse(data as string) as ShipperAssignmentDto;
    const router = useRouter();
    const { data: merchantData } = useQuery({
        queryKey: ['merchant', assignment.merchantId],
        queryFn: () => userService.getMerchantProfile(assignment.merchantId),
        enabled: !!assignment.merchantId,
    })

    const { data: orderData } = useQuery({
        queryKey: ['order', assignment.orderId],
        queryFn: () => orderService.getOrderDetail(assignment.orderId),
        enabled: !!assignment.orderId,
    })
    const merchant = merchantData || mock_merchant
    const order = orderData || mock_order_detail
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Lịch sử đơn hàng</Text>
            </View>
            <ScrollView style={{ width: '100%', height: '100%', padding: 20 }} contentContainerStyle={{ rowGap: 20 }}>
                <View style={styles.smallcontainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {
                            assignment.status === 'Completed' ? (
                                <Ionicons name="checkmark-circle" size={45} color="#20c74bff" />
                            ) : (
                                <Ionicons name="close-circle" size={45} color="#a83620ff" />
                            )
                        }
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{assignment.status === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}</Text>
                            <Text style={{ fontSize: 12 }}>{new Date(assignment.deliveredAt || '').toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <MaterialIcons name="restaurant" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Điểm lấy hàng</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{merchant.storeName}</Text>
                            <Text style={{ fontSize: 14 }}>{assignment.pickupAddress}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <Entypo name="location" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Điểm giao hàng</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{assignment.customerName}</Text>
                            <Text style={{ fontSize: 14 }}>{assignment.dropoffAddress}</Text>
                        </View>
                    </View>
                </View>

                {/*<View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đánh giá từ khách hàng</Text>
                    <View>
                        <Text>Từ: <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{customer?.fullName}</Text></Text>
                        <Text>Đánh giá: <Entypo name="star" size={15} color="#ffd900ff" />{order?.rating}</Text>
                        <Text>Lời nhắn: <Text style={{ fontSize: 18, fontStyle: 'italic' }}>"{order?.comment}"</Text></Text>
                    </View>
                </View>*/}

                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tóm tắt đơn hàng</Text>
                    <View style={{ borderRadius: 14, overflow: 'hidden', gap: 15 }}>
                        {order?.items?.map((item, index) => <ProductCard_ForDriver key={index} {...item} />)}
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tạm tính:</Text>
                        <Text>{order?.subtotal} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Phí vận chuyển:</Text>
                        <Text>{order?.deliveryFee} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Giảm giá:</Text>
                        <Text>{order?.discountAmount} đ</Text>
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tổng số tiền:</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#EE4D2D' }}>{order?.totalAmount} đ</Text>
                    </View>
                </View>



                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    )
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
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        gap: 8,
    },
    smallcontainer: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 14,
        padding: 20,
        gap: 10
    },
})