import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { ProductCard_ForDriver } from "../../components/features/ProductCard";
import { mock_orderitems } from "../../mock/shipper";
import { useRouter } from "expo-router";

export default function OrderDetail() {
    const router = useRouter();
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
                        <View style={{ backgroundColor: '#ee4d2d21', width: 65, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                            <Text style={{ color: '#ee4d2dff' }}>Pick up</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>The Pizza</Text>
                            <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 90, backgroundColor: '#15803c1a', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="phone" size={24} color="#15803D" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <EvilIcons name="location" size={24} color="black" />
                            <Text>24 Quach Dieu, Ward 15, Tan Binh</Text>
                        </View>

                    </View>

                    <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 14, padding: 20 }}>
                        <View style={{ backgroundColor: '#43ee2d21', width: 75, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                            <Text style={{ color: '#27881aff' }}>Drop off</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Kim vu</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 90, backgroundColor: '#15803c1a', justifyContent: 'center', alignItems: 'center' }}>
                                    <Feather name="message-circle" size={24} color="#15803D" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 90, backgroundColor: '#15803c1a', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome name="phone" size={24} color="#15803D" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <EvilIcons name="location" size={24} color="black" />
                            <Text>19/3/4 Lu Wuang, Ward 15, Tan Binh</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#F6F6F6', borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 10, gap: 5 }}>
                            <Ionicons name="information-circle-outline" size={20} color="#EE4D2D" />
                            <Text style={{ fontSize: 12, flex: 1 }}>Note: Nhắn người giao hàng gọi trước khi đến</Text>
                        </View>

                    </View>

                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order item ({mock_orderitems.length})</Text>
                    <View style={{ borderRadius: 14, overflow: 'hidden', gap: 10, backgroundColor: 'white', padding: 20 }}>
                        {mock_orderitems.map((item, index) => <ProductCard_ForDriver key={index} {...item} />)}
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total: 150000đ</Text>
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