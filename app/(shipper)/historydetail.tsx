import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { ProductCard_ForDriver } from "../../components/features/ProductCard";
import { mock_orderitems, OrderCardType } from "../../mock/shipper";

export default function HistoryDetail() {
    const item = useLocalSearchParams();
    const item_parsed: OrderCardType = JSON.parse(item.item as string);
    const router = useRouter();
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
                            item_parsed.status === 'delivered' ? (
                                <Ionicons name="checkmark-circle" size={45} color="#a83620ff" />
                            ) : (
                                <Ionicons name="close-circle" size={45} color="#a83620ff" />
                            )
                        }
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item_parsed.status === 'delivered' ? 'Đã hoàn thành' : 'Đã hủy'}</Text>
                            <Text style={{ fontSize: 14 }}>{item_parsed.deliveredtime}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <MaterialIcons name="restaurant" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>PICKUP</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item_parsed.restaurantname}</Text>
                            <Text style={{ fontSize: 14 }}>{item_parsed.pickuplocation}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 13 }}>
                        <Entypo name="location" size={18} color="#EE4D2D" />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>DROP-OFF</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item_parsed.recipientname}</Text>
                            <Text style={{ fontSize: 14 }}>{item_parsed.deliverylocation}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đánh giá từ khách hàng</Text>
                    <View>
                        <Text>Từ: <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item_parsed.recipientname}</Text></Text>
                        <Text>Rating: <Entypo name="star" size={15} color="#ffd900ff" />{item_parsed.rating}</Text>
                        <Text>Lời nhắn: <Text style={{ fontSize: 18, fontStyle: 'italic' }}>"{item_parsed.comment}"</Text></Text>
                    </View>
                </View>

                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tóm tắt đơn hàng</Text>
                    <View style={{ borderRadius: 14, overflow: 'hidden', gap: 10 }}>
                        {mock_orderitems.map((item, index) => <ProductCard_ForDriver key={index} {...item} />)}
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tạm tính:</Text>
                        <Text>{item_parsed.subtotal} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Phí vận chuyển:</Text>
                        <Text>{item_parsed.deliveryfee} đ</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Giảm giá:</Text>
                        <Text>{item_parsed.discountamount} đ</Text>
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Tổng số tiền:</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#EE4D2D' }}>{item_parsed.totalamount} đ</Text>
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