import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { mock_merchant } from "../../mock/shipper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { ShipperAssignmentDto } from "@/types/assignment";

export default function OrderDetail() {
    const router = useRouter();
    const { data } = useLocalSearchParams();
    const assignment = JSON.parse(data as string) as ShipperAssignmentDto;

    const { data: merchantData } = useQuery({
        queryKey: ['merchant', assignment.merchantId],
        queryFn: () => userService.getMerchantProfile(assignment.merchantId),
        enabled: !!assignment.merchantId,
    })

    const merchant = merchantData || mock_merchant

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Chi tiết đơn hàng</Text>
            </View>
            <ScrollView style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%', height: 260, position: 'relative' }}>
                    <Image source={{ uri: 'https://developers.google.com/static/maps/documentation/tile/images/example-basemap-tile.png' }} style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }} />
                    <View style={styles.direction}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{ backgroundColor: '#ee4d2d21', width: 55, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="delivery-dining" size={30} color="#EE4D2D" />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text>Thời gian dự kiến</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>24 phút <Text style={{ fontWeight: 'thin', fontSize: 15 }}>(6.5km)</Text></Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EE4D2D', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialIcons name="my-location" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ margin: 20, gap: 20 }}>
                    <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 14, padding: 20, }}>
                        <View style={{ backgroundColor: '#ee4d2d21', width: 110, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                            <Text style={{ color: '#ee4d2dff' }}>Điểm lấy hàng</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>{merchant?.storeName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 250, gap: 10 }}>
                                    <FontAwesome name="location-arrow" size={20} color="black" />
                                    <Text>{assignment.pickupAddress}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 14, padding: 20 }}>
                        <View style={{ backgroundColor: '#43ee2d21', width: 110, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                            <Text style={{ color: '#27881aff' }}>Điểm nhận hàng</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{assignment.customerName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <FontAwesome6 name="contact-card" size={14} color="black" />
                                    <Text>{assignment.customerPhone}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 250, gap: 10 }}>
                                    <FontAwesome name="location-arrow" size={20} color="black" />
                                    <Text>{assignment.dropoffAddress}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 90, backgroundColor: '#15803c1a', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="phone" size={24} color="#15803D" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', backgroundColor: '#F6F6F6', borderRadius: 7, flexDirection: 'row', alignItems: 'center', padding: 10, gap: 5, marginTop: 10 }}>
                            <Ionicons name="information-circle-outline" size={20} color="#EE4D2D" />
                            <Text style={{ fontSize: 12, flex: 1 }}>Order: {assignment.orderNumber || assignment.orderId}</Text>
                        </View>

                    </View>

                    <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 14, padding: 20, gap: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tóm tắt đơn hàng</Text>
                        <View style={{ borderRadius: 14, overflow: 'hidden', gap: 15 }}>
                            <Text style={{ color: 'gray' }}>Order item details are not available for shipper.</Text>
                        </View>
                        <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Tạm tính:</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Phí vận chuyển:</Text>
                            <Text>{assignment.deliveryFee} đ</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Giảm giá:</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{ height: 1, width: '100%', backgroundColor: "lightgray" }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Tổng số tiền:</Text>
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#EE4D2D' }}>{assignment.deliveryFee} đ</Text>
                        </View>
                    </View>
                    <View style={{ height: 80 }} />
                </View>
            </ScrollView >
        </View >
    );
}
export const styles = StyleSheet.create({
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
    direction: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '90%',
        height: 90,
        borderRadius: 14,
        padding: 20,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
