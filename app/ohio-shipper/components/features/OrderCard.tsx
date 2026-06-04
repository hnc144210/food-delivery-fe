import EvilIcons from "@expo/vector-icons/EvilIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { mock_merchant, OrderCardType } from "../../mock/shipper";
import { mock_nearbyrestaurant } from "@/mock/home";
import { useMemo } from "react";
import { number } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateDeliveryStatusRequestDto, ShipperAssignmentDto } from "@/types/assignment";
import { deliveryService } from "@/services/deliveryService";
import { userService } from "@/services/userService";

export function OrderCard_ForDriver({ data, offerId }: { data: ShipperAssignmentDto, offerId: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: merchantData } = useQuery({
        queryKey: ['merchant', data.merchantId],
        queryFn: () => userService.getMerchantProfile(data.merchantId),
    })
    const merchant = merchantData || mock_merchant;


    const acceptAssignmentMutation = useMutation({
        mutationFn: () => deliveryService.acceptAssignment(data.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
            queryClient.invalidateQueries({ queryKey: ['offer-assignment'] });
            queryClient.invalidateQueries({ queryKey: ['active-offer'] });
            queryClient.invalidateQueries({ queryKey: ['shipper-availability'] });
            Alert.alert("Thành công", "Cảm ơn bạn đã xác nhận");
        },
        onError: (error) => {
            Alert.alert("Lỗi", error.message);
        }
    })

    const rejectAssignmentMutation = useMutation({
        mutationFn: (reason: string) =>
            deliveryService.rejectAssignment(data.id, {
                offerId: offerId,
                reason: reason
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
            queryClient.invalidateQueries({ queryKey: ['offer-assignment'] });
            queryClient.invalidateQueries({ queryKey: ['active-offer'] });
            queryClient.invalidateQueries({ queryKey: ['shipper-availability'] });
            Alert.alert("Thành công", "Bạn đã từ chối đơn hàng");
        },
        onError: (error) => {
            Alert.alert("Lỗi", error.message);
        }
    })
    const updateStatusMutation = useMutation({
        mutationFn: ({ assignmentId, data }: { assignmentId: string, data: UpdateDeliveryStatusRequestDto }) => deliveryService.updateDeliveryStatus(assignmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
            queryClient.invalidateQueries({ queryKey: ['offer-assignment'] });
            queryClient.invalidateQueries({ queryKey: ['active-offer'] });
            queryClient.invalidateQueries({ queryKey: ['shipper-availability'] });
            Alert.alert("Thành công", "Cập nhật trạng thái đơn hàng thành công");
        },
        onError: (error) => {
            Alert.alert("Lỗi", error.message);
        }
    })

    const statusText = () => {
        if (data.status === 'Offering' || data.status === 'Pending') return 'Chờ xác nhận';
        if (data.status === 'Accepted') return 'Đã nhận đơn';
        if (data.status === 'PickingUp') return 'Đang lấy hàng';
        if (data.status === 'PickedUp') return 'Đã lấy hàng';
        if (data.status === 'Delivering') return 'Đang giao hàng';
        if (data.status === 'Delivered') return 'Đã giao hàng';
        if (data.status === 'Failed') return 'Thất bại';
        else return data.status
    }
    const statusColor = () => {
        if (data.status === 'Offering' || data.status === 'Pending') return '#b6b6b6ff';
        if (data.status === 'Accepted') return '#EA580C';
        if (data.status === 'PickingUp') return '#1bcc91ff';
        if (data.status === 'PickedUp') return '#40d3d8ff';
        if (data.status === 'Delivering') return '#16c616ff';
    }

    const buttontext = () => {
        if (data.status === 'Pending') return 'Nhận đơn';
        if (data.status === 'Accepted') return 'Lấy hàng';
        if (data.status === 'PickingUp') return 'Lấy hàng';
        if (data.status === 'PickedUp') return 'Bắt đầu giao hàng';
        if (data.status === 'Delivering') return 'Hoàn thành';
        return '';
    }
    const handleAccept = () => {
        const isOffer = data.status === 'Offering' || data.status === 'Pending';
        if (!isOffer) return;
        acceptAssignmentMutation.mutate();
    }

    const handleReject = () => {
        const isOffer = data.status === 'Offering' || data.status === 'Pending';
        if (!isOffer) return;
        rejectAssignmentMutation.mutate("Tôi không thể giao hàng vào lúc này");
    }
    const handlePickup = () => {
        if (data.status === 'Accepted') {
            router.push({ pathname: `/(shipper)/pickedup`, params: { data: JSON.stringify(data) } })
            // updateStatusMutation.mutate({ assignmentId: data.id, data: { status: "PickedUp", note: "Đã lấy hàng", proofFileKey: null } })
        }
    }
    const handleDelivering = () => {
        if (data.status === 'PickedUp') {
            updateStatusMutation.mutate({ assignmentId: data.id, data: { status: "Delivering", note: "Bắt đầu giao hàng", proofFileKey: null } })
        }
    }
    const handleComplete = () => {
        if (data.status === 'Delivering') {
            router.push({ pathname: `/(shipper)/completion`, params: { data: JSON.stringify(data) } })
            // updateStatusMutation.mutate({ assignmentId: data.id, data: { status: "Delivered", note: "Hoàn thành đơn hàng", proofFileKey: null } })
        }
    }
    return (
        <View style={styles.ordercard_container}>
            <View style={{ padding: 20, gap: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={[styles.status, { backgroundColor: statusColor() }]}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{statusText()}</Text>
                    </View>
                    {(data.status !== 'Pending' && data.status !== 'Offering') &&
                        <View style={{ flexDirection: 'row', gap: 8 }}>

                            {/*<TouchableOpacity
                                style={styles.incidentBadgeButton}
                                onPress={() => router.push({ pathname: '/(shipper)/incidentreport' as any, params: { data: JSON.stringify(data) } })}
                            >
                                <Ionicons name="warning-outline" size={16} color="#EF4444" />
                                <Text style={styles.incidentBadgeText}>Sự cố</Text>
                            </TouchableOpacity>*/}
                            <TouchableOpacity
                                style={styles.chatBadgeButton}
                                onPress={() => router.push({ pathname: '/(shipper)/chatroom' as any, params: { data: JSON.stringify(data) } })}
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#EE4D2D" />
                                <Text style={styles.chatBadgeText}>Trò chuyện</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onPress={() => router.push({ pathname: `/(shipper)/orderdetail`, params: { data: JSON.stringify(data) } })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={{ uri: merchant.storeLogoUrl }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{merchant.storeName}</Text>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Xem chi tiết đơn hàng</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B22203' }}>{data.deliveryFee}đ</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>Phí vận chuyển</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 20 }}>
                    <View style={[styles.round, (data.status === 'Delivering' || data.status === 'PickedUp') && { backgroundColor: '#ee4d2d3b' }]}>
                        <Octicons name="dot-fill" size={20} color={data.status === 'Delivering' || data.status === 'PickedUp' ? '#EE4D2D' : 'black'} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 12, color: 'gray' }}>Điểm lấy hàng</Text>
                        <Text>{data.pickupAddress}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 20 }}>
                    <View style={[styles.round, (data.status === 'DELIVERED') && { backgroundColor: '#ee4d2d3b' }]}>
                        <EvilIcons name="location" size={20} color={data.status === 'DELIVERED' ? '#EE4D2D' : 'black'} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 12, color: 'gray' }}>Điểm giao hàng</Text>
                        <Text>{data.dropoffAddress}</Text>
                    </View>

                </View>
            </View>
            {(data.status === "Offering" || data.status === "Pending") && <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60, flex: 1, backgroundColor: '#b1b1b1ff' }} onPress={handleReject}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60, flex: 2, backgroundColor: "#6b6b6bff" }} onPress={handleAccept}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
            }
            {(data.status !== "Pending" && data.status !== "Offering") && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60, width: '100%', backgroundColor: statusColor() }} onPress={data.status === 'Accepted' ? handlePickup : data.status === 'PickedUp' ? handleDelivering : handleComplete}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{buttontext()}</Text>
            </TouchableOpacity>}

        </View>
    );
}

export function OrderCardHistory_ForDriver({ data }: { data: ShipperAssignmentDto }) {
    const statuscolor = () => {
        if (data.status === 'Failed') return 'red';
        if (data.status === 'Completed') return '#34C759';
    }
    const StatusText = () => {
        if (data.status === 'Failed') return 'Thất bại';
        if (data.status === 'Completed') return 'Thành công';
        else return data.status
    }
    const router = useRouter();
    const { data: merchantData } = useQuery({
        queryKey: ['merchant', data.merchantId],
        queryFn: () => userService.getMerchantProfile(data.merchantId),
    })
    const merchant = merchantData || mock_merchant;
    return (
        <TouchableOpacity style={styles.ordercard_container} onPress={() => router.push({ pathname: `/(shipper)/historydetail`, params: { data: JSON.stringify(data) } })}>
            <View style={{ padding: 20, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={{ uri: merchant?.storeLogoUrl }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                        <View>
                            <Text style={{ fontSize: 16 }}>{merchant?.storeName}</Text>
                            <Text style={{ color: 'gray', fontSize: 12 }}>{new Date(data.deliveredAt || '').toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#B22203' }}>{data.deliveryFee}đ</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: statuscolor(), fontSize: 12, fontWeight: 'bold' }}>{StatusText()}</Text>
                            </View>
                        </View>

                        <Entypo name="chevron-thin-right" size={18} color="black" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function OrderCard_ForCustomer({ id, status, orderedtime, deliveredtime, merchantId, totalamount, orderitems }: OrderCardType) {
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
    const statusDisplay = () => {
        if (status === 'PENDING') return 'Chờ duyệt';
        if (status === 'CONFIRMED') return 'Đã xác nhận';
        if (status === 'PREPARING') return 'Đang chuẩn bị';
        if (status === 'DELIVERING') return 'Đang giao hàng';
        if (status === 'DELIVERED') return 'Đã giao hàng';
        if (status === 'CANCELLED') return 'Đã hủy';
        if (status === '') return 'Chưa đặt hàng';
        if (status === 'READY') return 'Sẵn sàng';
        return '';
    }
    const restaurant = useMemo(() => mock_nearbyrestaurant.find(f => f.id === merchantId), [merchantId]);
    const router = useRouter();
    const handleReview = () => {
        router.push({ pathname: `/(customer)/review`, params: { id } });
    }
    return (
        <View style={[styles.ordercard_container, { borderColor: statuscolor(), borderWidth: 1 }]}>
            <View style={{ padding: 20, width: '100%', gap: 12 }}>
                <View style={{ backgroundColor: statuscolor(), paddingVertical: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 100 }}>
                    <Text style={{ color: textcolor(), fontSize: 12 }}>{statusDisplay()}</Text>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }} onPress={() => { }}>
                    <Image source={{ uri: restaurant?.logo_url }} style={{ width: 50, height: 50, borderRadius: 12 }} />
                    <View style={{ width: 240 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{restaurant?.name}</Text>
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
                        {status === 'PENDING' && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', backgroundColor: '#EE4D2D', borderRadius: 12 }}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Hủy đơn hàng</Text>
                        </TouchableOpacity>}
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
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#EE4D2D', padding: 12, borderRadius: 12, alignItems: 'center' }} onPress={handleReview}>
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
        width: 110,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    chatBadgeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ee4d2d12',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 5,
    },
    chatBadgeText: {
        color: '#EE4D2D',
        fontSize: 12,
        fontWeight: 'bold',
    },
    incidentBadgeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef444415',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 5,
    },
    incidentBadgeText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: 'bold',
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
