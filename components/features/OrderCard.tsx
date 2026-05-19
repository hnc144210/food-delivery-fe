import EvilIcons from "@expo/vector-icons/EvilIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OrderCardType } from "../../mock/shipper";

export function OrderCard_ForDriver({ status, restaurantname, totalamount, pickuplocation, deliverylocation, onView }: OrderCardType) {

    const router = useRouter();

    const statuscolor = () => {
        if (status === 'PENDING') return 'lightgray';
        if (status === 'READY') return '#FFCC00';
        if (status === 'DELIVERING') return '#EA580C';
        if (status === 'DELIVERED') return '#34C759';
    }


    return (
        <View style={styles.ordercard_container}>
            <View style={{ padding: 20, gap: 10 }}>
                <View style={[styles.status, { backgroundColor: statuscolor() }]}>
                    <Text style={{ color: 'white' }}>{status}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={{ uri: 'https://cdn.pixabay.com/photo/2021/05/03/04/18/uber-6225185_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                        <Text>{restaurantname}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B22203' }}>{totalamount}đ</Text>
                        <Text>Driver fee</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 20 }}>
                    <View style={[styles.round, (status === 'delivering' || status === 'delivered') && { backgroundColor: '#ee4d2d3b' }]}>
                        <Octicons name="dot-fill" size={20} color={status === 'delivering' || status === 'delivered' ? '#EE4D2D' : 'black'} />
                    </View>
                    <View>
                        <Text>Pickup</Text>
                        <Text>{pickuplocation}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 20 }}>
                    <View style={[styles.round, (status === 'delivered') && { backgroundColor: '#ee4d2d3b' }]}>
                        <EvilIcons name="location" size={20} color={status === 'delivered' ? '#EE4D2D' : 'black'} />
                    </View>
                    <View>
                        <Text>Delivery</Text>
                        <Text>{deliverylocation}</Text>
                    </View>

                </View>
            </View>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60, width: '100%', backgroundColor: statuscolor() }} onPress={onView}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>View</Text>
            </TouchableOpacity>
        </View>
    );
}

export function OrderCardHistory_ForDriver({ restaurantname, deliveredtime, totalamount, status, rating, onView }: OrderCardType) {
    const statuscolor = () => {
        if (status === 'CANCELLED') return 'red';
        if (status === 'DELIVERED') return '#34C759';
    }
    return (
        <TouchableOpacity style={styles.ordercard_container} onPress={onView}>
            <View style={{ padding: 20, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={{ uri: 'https://cdn.pixabay.com/photo/2021/05/03/04/18/uber-6225185_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                        <View>
                            <Text style={{ fontSize: 16 }}>{restaurantname}</Text>
                            <Text style={{ color: 'gray', fontSize: 12 }}>{deliveredtime}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                <Text style={{ fontSize: 11, color: 'gray' }}>Rating:</Text>
                                <Entypo name="star" size={12} color="#ffd900ff" />
                                <Text style={{ fontSize: 12 }}>{rating}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#B22203' }}>{totalamount}đ</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: statuscolor(), fontSize: 12, fontWeight: 'bold' }}>{status}</Text>
                            </View>
                        </View>

                        <Entypo name="chevron-thin-right" size={18} color="black" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function OrderCard_ForCustomer({ status, orderedtime, deliveredtime, restaurantname, totalamount, orderitems, onView }: OrderCardType) {
    const statuscolor = () => {
        if (status === 'PENDING') return '#ddddddff';
        if (status === 'CONFIRMED') return '#90d9e2ff';
        if (status === 'PREPARING') return '#ffaf54ff';
        if (status === 'DELIVERING') return '#ee99e3ff';
        if (status === 'DELIVERED') return '#a6ff83ff';
        if (status === 'CANCELLED') return '#ffa6a6ff';
        return '#FEF3C7';
    }
    const textcolor = () => {
        if (status === 'PENDING') return '#000000ff';
        if (status === 'CONFIRMED') return '#005661ff';
        if (status === 'PREPARING') return '#6b4000ff';
        if (status === 'DELIVERING') return '#682b60ff';
        if (status === 'DELIVERED') return '#207000ff';
        if (status === 'CANCELLED') return '#960000ff';
        return '#92400eff';
    }
    return (
        <View style={[styles.ordercard_container, { borderColor: statuscolor(), borderWidth: 1 }]}>
            <View style={{ padding: 20, width: '100%', gap: 12 }}>
                <View style={{ backgroundColor: statuscolor(), paddingVertical: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                    <Text style={{ color: textcolor(), fontSize: 12 }}>{status === '' ? 'Chưa đặt hàng' : status}</Text>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }} onPress={onView}>
                    <Image source={{ uri: 'https://cdn.pixabay.com/photo/2021/05/03/04/18/uber-6225185_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                    <View style={{ width: 240 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{restaurantname}</Text>
                        <Text style={{ color: 'gray', fontSize: 12 }}>{orderitems?.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</Text>
                    </View>
                </TouchableOpacity>

                {status !== 'DELIVERED' && status !== 'CANCELLED' && status !== '' &&
                    <View style={{ gap: 12 }}>
                        <View>
                            <Text style={{ fontSize: 11, fontWeight: '300' }}>Thời điểm đặt hàng</Text>
                            <Text>{orderedtime}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 18, backgroundColor: '#ebebebff', borderRadius: 12 }}>
                            <Text style={{ fontSize: 15 }}>Tổng cộng</Text>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{totalamount}đ</Text>
                        </View>
                    </View>
                }

                {status === 'DELIVERED' &&
                    <View style={{ gap: 12 }}>
                        <View>
                            <Text style={{ fontWeight: '300', fontSize: 11 }}>Đã giao lúc: </Text>
                            <Text>{deliveredtime}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 12 }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#ebebebff', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Đặt lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#EE4D2D', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Đánh giá</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                }

                {status === '' &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 12 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#ebebebff', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>Hủy giỏ hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#EE4D2D', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Hoàn thành đơn</Text>
                        </TouchableOpacity>
                    </View>
                }

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    ordercard_container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
    },
    status: {
        height: 35,
        width: 100,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    round: {
        width: 25,
        height: 25,
        borderRadius: 90,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center'
    },
})
