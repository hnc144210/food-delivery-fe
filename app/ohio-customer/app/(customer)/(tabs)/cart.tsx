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
import { CartCard, OrderCard_ForCustomer } from "@/components/features/OrderCard";
import { mock_cart_new, mock_odercard_forcustomer, mock_order_history_items, mock_order_ongoing_items } from "@/mock/customer_cart";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { Feather } from "@expo/vector-icons";

export default function CartScreen() {
    const [cartState, setCartState] = useState(1);

    // Fetch dynamic cart items with elegant mock fallback (similar to categories & vouchers on Home)
    const { data: carts, isLoading: isCartLoading, refetch: refetchCart, isRefetching } = useQuery({
        queryKey: ['cart'],
        queryFn: orderService.getCart,
    });

    const { data: orderHistory, refetch: refetchOrderHistory, isRefetching: isOrderHistoryRefetching } = useQuery({
        queryKey: ['order-history'],
        queryFn: orderService.getMyOrderHistory,
    });
    const ongoingOrders = orderHistory?.items.filter((item) => item.status !== 'DELIVERED' && item.status !== 'CANCELLED') || mock_order_ongoing_items;
    const historyOrders = orderHistory?.items.filter((item) => item.status === 'DELIVERED' || item.status === 'CANCELLED') || mock_order_history_items;
    const myCarts = carts?.items || mock_cart_new;

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
                                {myCarts.map((item: any, index: number) => (
                                    <CartCard key={index} merchantId={item.merchantId} items={item.items} refetchCart={refetchCart} />
                                ))}
                                {myCarts.length === 0 && (
                                    <View style={{ justifyContent: "center", alignItems: "center", gap: 20, paddingTop: 160 }}>
                                        <Feather name="shopping-cart" size={60} color="#9ca3af" />
                                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#9ca3af" }}>Không có giỏ hàng</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )
                )}

                {/* TAB 2: ONGOING ORDERS */}
                {cartState === 2 && (
                    isOrderHistoryRefetching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#EE4D2D" />
                            <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={isOrderHistoryRefetching} onRefresh={refetchOrderHistory} colors={["#EE4D2D"]} />}
                        >
                            <View style={{ gap: 20, paddingBottom: 24 }}>
                                {ongoingOrders
                                    .map((item, index) => (
                                        <OrderCard_ForCustomer key={`mock-ongoing-${index}`} {...item} />
                                    ))
                                }
                                {ongoingOrders.length === 0 && (
                                    <View style={{ justifyContent: "center", alignItems: "center", gap: 20, paddingTop: 160 }}>
                                        <Feather name="shopping-cart" size={60} color="#9ca3af" />
                                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#9ca3af" }}>Không có đơn hàng</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )
                )}

                {/* TAB 3: ORDER HISTORY */}
                {cartState === 3 && (
                    isOrderHistoryRefetching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#EE4D2D" />
                            <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={isOrderHistoryRefetching} onRefresh={refetchOrderHistory} colors={["#EE4D2D"]} />}
                        >
                            <View style={{ gap: 20, paddingBottom: 24 }}>
                                {historyOrders
                                    .map((item, index) => (
                                        <OrderCard_ForCustomer key={`history-${index}`} {...item} />
                                    ))
                                }
                                {historyOrders.length === 0 && (
                                    <View style={{ justifyContent: "center", alignItems: "center", gap: 20, paddingTop: 160 }}>
                                        <Feather name="shopping-cart" size={60} color="#9ca3af" />
                                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#9ca3af" }}>Không có đơn hàng</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )
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