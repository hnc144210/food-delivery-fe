import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { ReturnButton } from "@/components/ui/ReturnButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/catalogService";
import { orderService } from "@/services/orderService";
import { ReviewCard, ReviewState } from "@/components/features/ReviewCard";
import { mock_order_detail } from "@/mock/customer_cart";

export default function Review() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: orderDetail = mock_order_detail, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderService.getOrderDetail(id as string),
        enabled: !!id
    });

    const [reviewsState, setReviewsState] = useState<Record<string, ReviewState>>({});

    useEffect(() => {
        if (orderDetail?.items) {
            const initialStates: Record<string, ReviewState> = {};
            orderDetail.items.forEach(item => {
                initialStates[item.productId] = {
                    rating: 5,
                    comment: "",
                    image: null
                };
            });
            setReviewsState(initialStates);
        }
    }, [orderDetail]);

    const updateReview = (productId: string, stateUpdate: Partial<ReviewState>) => {
        setReviewsState(prev => ({
            ...prev,
            [productId]: {
                ...(prev[productId] || { rating: 5, comment: "", image: null }),
                ...stateUpdate
            }
        }));
    };

    const submitReviewsMutation = useMutation({
        mutationFn: async () => {
            if (!orderDetail?.items) return;
            const promises = orderDetail.items.map(item => {
                const itemReview = reviewsState[item.productId] || { rating: 5, comment: "", image: null };
                return homeService.createReview({
                    userId: orderDetail.userId || '',
                    orderId: orderDetail.id || '',
                    merchantId: orderDetail.merchantId || '',
                    productId: item.productId,
                    comment: itemReview.comment,
                    rating: itemReview.rating,
                    images: itemReview.image ? [itemReview.image] : [],
                    merchantReply: null,
                    repliedAt: null
                });
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
            router.back();
        },
        onError: (error) => {
            console.error("Submit Reviews Error:", error);
            Alert.alert("Thất bại", "Không thể gửi đánh giá!");
        }
    });

    const handleSubmitReviews = () => {
        submitReviewsMutation.mutate();
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#EE4D2D" />
                <Text style={{ marginTop: 12, color: '#888' }}>Đang tải thông tin đơn hàng...</Text>
            </View>
        );
    }

    if (!orderDetail) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: '#888' }}>Không tìm thấy đơn hàng</Text>
                <TouchableOpacity onPress={router.back} style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 16, color: '#EE4D2D', fontWeight: '700' }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Đánh giá đơn hàng</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={{ width: '100%', paddingHorizontal: 16, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.merchantHeaderCard}>
                        <View style={styles.merchantHeaderMeta}>
                            <Text style={styles.merchantCode}>Mã đơn: {orderDetail.orderNumber}</Text>
                            <Text style={styles.merchantName}>{orderDetail.merchantName}</Text>
                            <Text style={styles.deliveredDate}>Giao lúc: {new Date(orderDetail.updatedAt).toLocaleDateString('vi-VN')}</Text>
                        </View>
                    </View>

                    <Text style={styles.mainPromptText}>Bạn hài lòng với các món ăn chứ?</Text>

                    {orderDetail.items.map((item) => (
                        <ReviewCard
                            key={item.id}
                            productId={item.productId}
                            productName={item.productName}
                            productImage={item.productImage}
                            quantity={item.quantity}
                            unitPrice={item.unitPrice}
                            reviewState={reviewsState[item.productId] || { rating: 5, comment: "", image: null }}
                            onChange={(stateUpdate) => updateReview(item.productId, stateUpdate)}
                        />
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>

                <View style={styles.buttonFooter}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            submitReviewsMutation.isPending && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmitReviews}
                        disabled={submitReviewsMutation.isPending}
                    >
                        {submitReviewsMutation.isPending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Text style={styles.submitButtonText}>Gửi tất cả đánh giá</Text>
                                <Ionicons name="paper-plane" size={18} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        gap: 8,
    },
    merchantHeaderCard: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    merchantHeaderMeta: {
        flexDirection: 'column',
        gap: 2,
    },
    merchantCode: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    merchantName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    deliveredDate: {
        fontSize: 13,
        color: '#6B7280',
    },
    mainPromptText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'center',
        marginVertical: 14,
    },
    buttonFooter: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: '#EE4D2D',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#F0B3A3',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },

})