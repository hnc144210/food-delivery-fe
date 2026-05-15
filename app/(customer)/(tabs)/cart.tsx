import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OrderCard_ForCustomer } from "../../../components/features/OrderCard";
import { useState } from "react";
import { mock_cart_order, mock_odercard_forcustomer } from "@/mock/customer_cart";
import { useRouter } from "expo-router";

export default function CartScreen() {
    const [cartState, setCartState] = useState(1);
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white' }}>Đơn hàng</Text>
            </View>

            <View style={styles.body}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#c2c2c2ff', padding: 4, borderRadius: 10, marginBottom: 20 }}>
                    <TouchableOpacity style={[styles.tabButton, cartState === 1 ? styles.tabButtonActive : null]} onPress={() => { setCartState(1) }}>
                        <Text style={[styles.tabText, cartState === 1 ? styles.tabTextActive : null]}>Giỏ hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, cartState === 2 ? styles.tabButtonActive : null]} onPress={() => { setCartState(2) }}>
                        <Text style={[styles.tabText, cartState === 2 ? styles.tabTextActive : null]}>Đang diễn ra</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, cartState === 3 ? styles.tabButtonActive : null]} onPress={() => { setCartState(3) }}>
                        <Text style={[styles.tabText, cartState === 3 ? styles.tabTextActive : null]}>Lịch sử</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{cartState === 1 ? 'Giỏ hàng' : cartState === 2 ? 'Đang diễn ra' : 'Lịch sử'}</Text>
                <ScrollView>
                    {cartState === 1 && <View style={{ gap: 20 }}>
                        {mock_cart_order.map((item, index) => (
                            <OrderCard_ForCustomer key={index} {...item} />
                        ))}
                    </View>}
                    {cartState === 2 && <View style={{ gap: 20 }}>
                        {mock_odercard_forcustomer.filter((item) => item.status === 'PENDING' || item.status === 'CONFIRMED' || item.status === 'PREPARING' || item.status === 'DELIVERING').map((item, index) => (
                            <OrderCard_ForCustomer key={index} {...item} />
                        ))}
                    </View>}
                    {cartState === 3 && <View style={{ gap: 20 }}>
                        {mock_odercard_forcustomer.filter((item) => item.status === 'DELIVERED' || item.status === 'CANCELLED').map((item, index) => (
                            <OrderCard_ForCustomer key={index} {...item} />
                        ))}
                    </View>}

                </ScrollView>
            </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#EE4D2D',
        width: '100%',
        gap: 10
    },
    body: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        padding: 20,
    },
    tabButton: {
        padding: 10,
        width: 115,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        backgroundColor: '#c2c2c2ff',
    },
    tabButtonActive: {
        backgroundColor: 'white',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'black'
    },
    tabTextActive: {
        color: '#EE4D2D'
    },
});