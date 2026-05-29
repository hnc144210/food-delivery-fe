import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { OrderCard_ForCustomer } from "../../../components/features/OrderCard";
import { mock_cart_order, mock_odercard_forcustomer } from "@/mock/customer_cart";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

async function getCartItems(user: User | null) {
    if (!user) return mock_cart_order;
    const userId = user?.id
    try {
        if (!userId) return mock_cart_order;
        const response = await api.get('/orders/cart');
        const resData = response.data;
        const rawData = resData.success ? resData.data : resData;
        const items = rawData?.items || rawData;

        if (Array.isArray(items) && items.length > 0) {
            return items.map((cart: any) => ({
                status: '',
                restaurantname: `Cửa hàng ${cart.merchantId?.slice(0, 5).toUpperCase() || 'Food'}`,
                recipientname: user?.name || 'Khách hàng',
                subtotal: cart.subtotal || 0,
                deliveryfee: 25000,
                discountamount: 0,
                totalamount: (cart.subtotal || 0) + 25000,
                pickuplocation: 'Nhà hàng đối tác',
                deliverylocation: 'Địa chỉ của tôi',
                orderedtime: 'Chưa hoàn thành',
                orderitems: (cart.items || []).map((item: any) => ({
                    name: item.productName || 'Món ăn',
                    quantity: item.quantity || 1
                }))
            }));
        }
        return mock_cart_order;
    } catch (error) {
        console.log('Error fetching cart from backend, using mock:', error);
        return mock_cart_order;
    }
}

export default function CartScreen() {
    const [cartState, setCartState] = useState(1);

    const user = useAuthStore((s) => s.user);
    const userId = user?.id;

    // Fetch dynamic cart items with elegant mock fallback (similar to categories & vouchers on Home)
    const { data: cartItems, isLoading: isCartLoading, refetch: refetchCart, isRefetching } = useQuery({
        queryKey: ['cart', userId],
        queryFn: async () => await getCartItems(user),
        enabled: !!userId,
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white' }}>Đơn hàng</Text>
            </View>

            <View style={styles.body}>
                {/* Custom Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={[styles.tabButton, cartState === 1 && styles.tabButtonActive]} onPress={() => setCartState(1)}>
                        <Text style={[styles.tabText, cartState === 1 && styles.tabTextActive]}>Giỏ hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, cartState === 2 && styles.tabButtonActive]} onPress={() => setCartState(2)}>
                        <Text style={[styles.tabText, cartState === 2 && styles.tabTextActive]}>Đang diễn ra</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, cartState === 3 && styles.tabButtonActive]} onPress={() => setCartState(3)}>
                        <Text style={[styles.tabText, cartState === 3 && styles.tabTextActive]}>Lịch sử</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.tabHeading}>
                    {cartState === 1 ? 'Giỏ hàng hoạt động' : cartState === 2 ? 'Đơn hàng đang diễn ra' : 'Lịch sử mua hàng'}
                </Text>

                {/* TAB 1: ACTIVE CART */}
                {cartState === 1 && (
                    isCartLoading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#EE4D2D" />
                            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetchCart} colors={["#EE4D2D"]} />}
                        >
                            <View style={{ gap: 20, paddingBottom: 24 }}>
                                {(cartItems || mock_cart_order).map((item: any, index: number) => (
                                    <OrderCard_ForCustomer key={index} {...item} />
                                ))}
                            </View>
                        </ScrollView>
                    )
                )}

                {/* TAB 2: ONGOING ORDERS */}
                {cartState === 2 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ gap: 20, paddingBottom: 24 }}>
                            {mock_odercard_forcustomer
                                .filter((item) => item.status === 'PENDING' || item.status === 'CONFIRMED' || item.status === 'PREPARING' || item.status === 'DELIVERING' || item.status === 'READY')
                                .map((item, index) => (
                                    <OrderCard_ForCustomer key={`mock-ongoing-${index}`} {...item} />
                                ))
                            }
                        </View>
                    </ScrollView>
                )}

                {/* TAB 3: ORDER HISTORY */}
                {cartState === 3 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ gap: 20, paddingBottom: 24 }}>
                            {mock_odercard_forcustomer
                                .filter((item) => item.status === 'DELIVERED' || item.status === 'CANCELLED')
                                .map((item, index) => (
                                    <OrderCard_ForCustomer key={`history-${index}`} {...item} />
                                ))
                            }
                        </View>
                    </ScrollView>
                )}
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
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e5e7eb',
        padding: 4,
        borderRadius: 12,
        marginBottom: 20
    },
    tabButton: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    tabButtonActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563'
    },
    tabTextActive: {
        color: '#EE4D2D',
        fontWeight: '700',
    },
    tabHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 14
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 10,
    }
});