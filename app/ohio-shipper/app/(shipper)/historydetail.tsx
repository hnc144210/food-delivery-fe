import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { ProductCard_ForDriver } from "../../components/features/ProductCard";
import { mock_odercard, mock_orderitems, OrderCardType } from "../../mock/shipper";
import { mock_nearbyrestaurant } from "@/mock/home";
import { useMemo } from "react";

export default function HistoryDetail() {
    const id = useLocalSearchParams();
    const router = useRouter();
    const order = useMemo(() => mock_odercard.find(f => f.id === id?.id), [id?.id])// OrderCardType = mock_odercard.find((item) => item.id === id?.id)!;
    const restaurant = useMemo(() => mock_nearbyrestaurant.find(f => f.id === order?.merchantId), [order?.merchantId]);
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
                            order?.status === 'DELIVERED' ? (
                                <Ionicons name="checkmark-circle" size={45} color="#20c74bff" />
                            ) : (
                                <Ionicons name="close-circle" size={45} color="#a83620ff" />
                            )
                        }
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{order?.status === 'DELIVERED' ? 'Đã hoàn thành' : 'Đã hủy'}</Text>
                            <Text style={{ fontSize: 14 }}>{order?.deliveredtime}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <MaterialIcons name="restaurant" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Điểm lấy hàng</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{restaurant?.name}</Text>
                            <Text style={{ fontSize: 14 }}>{order?.pickuplocation}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <Entypo name="location" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Điểm giao hàng</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{order?.recipientname}</Text>
                            <Text style={{ fontSize: 14 }}>{order?.deliverylocation}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đánh giá từ khách hàng</Text>
                    <View>
                        <Text>Từ: <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{order?.recipientname}</Text></Text>
                        <Text>Đánh giá: <Entypo name="star" size={15} color="#ffd900ff" />{order?.rating}</Text>
                        <Text>Lời nhắn: <Text style={{ fontSize: 18, fontStyle: 'italic' }}>"{order?.comment}"</Text></Text>
                    </View>
                </View>

                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tóm tắt đơn hàng</Text>
                    <View style={{ borderRadius: 14, overflow: 'hidden', gap: 15 }}>
                        {mock_orderitems.map((item, index) => <ProductCard_ForDriver key={index} {...item} />)}
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tạm tính:</Text>
                        <Text>{order?.subtotal} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Phí vận chuyển:</Text>
                        <Text>{order?.deliveryfee} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Giảm giá:</Text>
                        <Text>{order?.discountamount} đ</Text>
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tổng số tiền:</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#EE4D2D' }}>{order?.totalamount} đ</Text>
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