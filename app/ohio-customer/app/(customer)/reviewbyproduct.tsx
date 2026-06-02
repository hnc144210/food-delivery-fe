import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { homeService } from "@/services/catalogService";
import { ReviewQueryDto } from "@/types/review";

export default function ReviewByProduct() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Filters state
    const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
    const [hasImagesOnly, setHasImagesOnly] = useState<boolean>(false);

    // Fetch review summary
    const { data: summary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['product-review-summary', id],
        queryFn: () => homeService.getProductReviewSummary(id!),
        enabled: !!id
    });

    // Fetch product detail to display product info in header/card
    const { data: product } = useQuery({
        queryKey: ['product', id],
        queryFn: () => homeService.getProductDetail(id!),
        enabled: !!id
    });

    // Fetch reviews list
    const queryParams: ReviewQueryDto = {
        rating: selectedRating,
        hasImages: hasImagesOnly ? true : undefined,
        limit: 50,
    };

    const { data: reviewList, isLoading: isReviewsLoading } = useQuery({
        queryKey: ['product-reviews', id, selectedRating, hasImagesOnly],
        queryFn: () => homeService.getProductReviews(id!, queryParams),
        enabled: !!id
    });

    const reviews = reviewList?.items || [];
    const isLoading = isSummaryLoading || isReviewsLoading;

    // Helper to format date
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } catch {
            return dateStr;
        }
    };

    // Calculate rating percentage for progress bars
    const getRatingPercentage = (count: number) => {
        if (!summary || summary.totalReviews === 0) return 0;
        return (count / summary.totalReviews) * 100;
    };

    const renderStars = (rating: number, size = 14) => {
        return (
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                        key={star}
                        name="star"
                        size={size}
                        color="#FFD700"
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Product Card Info */}
                {product && (
                    <View style={styles.productCard}>
                        <Image source={{ uri: product.imageUrl || "" }} style={styles.productImage} />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                            <Text style={styles.productPrice}>
                                {(product.discountPrice ?? product.basePrice).toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                    </View>
                )}

                {/* Summary Section */}
                {summary && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryLeft}>
                            <Text style={styles.avgRatingText}>{summary.averageRating.toFixed(1)}</Text>
                            {renderStars(Math.round(summary.averageRating), 18)}
                            <Text style={styles.totalReviewsText}>{summary.totalReviews} đánh giá</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRight}>
                            {[
                                { stars: 5, count: summary.counts.fiveStar },
                                { stars: 4, count: summary.counts.fourStar },
                                { stars: 3, count: summary.counts.threeStar },
                                { stars: 2, count: summary.counts.twoStar },
                                { stars: 1, count: summary.counts.oneStar }
                            ].map((item) => (
                                <View key={item.stars} style={styles.ratingBarRow}>
                                    <Text style={styles.starLabelText}>{item.stars}</Text>
                                    <AntDesign name="star" size={10} color="#FFD700" style={{ marginRight: 6 }} />
                                    <View style={styles.progressBarBackground}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${getRatingPercentage(item.count)}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.starCountText}>{item.count}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Filters Row */}
                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Lọc theo</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
                        <TouchableOpacity
                            style={[styles.filterChip, selectedRating === undefined && !hasImagesOnly && styles.filterChipActive]}
                            onPress={() => {
                                setSelectedRating(undefined);
                                setHasImagesOnly(false);
                            }}
                        >
                            <Text style={[styles.filterChipText, selectedRating === undefined && !hasImagesOnly && styles.filterChipTextActive]}>
                                Tất cả
                            </Text>
                        </TouchableOpacity>

                        {[5, 4, 3, 2, 1].map((rating) => (
                            <TouchableOpacity
                                key={rating}
                                style={[styles.filterChip, selectedRating === rating && styles.filterChipActive]}
                                onPress={() => {
                                    setSelectedRating(rating);
                                    setHasImagesOnly(false);
                                }}
                            >
                                <Text style={[styles.filterChipText, selectedRating === rating && styles.filterChipTextActive]}>
                                    {rating} Sao
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[styles.filterChip, hasImagesOnly && styles.filterChipActive]}
                            onPress={() => {
                                setSelectedRating(undefined);
                                setHasImagesOnly(true);
                            }}
                        >
                            <Text style={[styles.filterChipText, hasImagesOnly && styles.filterChipTextActive]}>
                                Có hình ảnh
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Reviews List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#EE4D2D" />
                        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
                    </View>
                ) : reviews.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbox-ellipses-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Chưa có đánh giá nào phù hợp</Text>
                    </View>
                ) : (
                    <View style={styles.reviewsListContainer}>
                        {reviews.map((review) => (
                            <View key={review.id} style={styles.reviewItemCard}>
                                {/* Review Header */}
                                <View style={styles.reviewHeader}>
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarText}>
                                            {review.userId ? "U" : "K"}
                                        </Text>
                                    </View>
                                    <View style={styles.reviewUserMeta}>
                                        <Text style={styles.userNameText}>
                                            {review.userId ? `Khách hàng (ID: ${review.userId.substring(0, 8)})` : "Khách hàng ẩn danh"}
                                        </Text>
                                        <View style={styles.starsAndDate}>
                                            {renderStars(review.rating)}
                                            <Text style={styles.dateText}>{formatDate(review.createdAt)}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Review Comment */}
                                {review.comment && (
                                    <Text style={styles.commentText}>{review.comment}</Text>
                                )}

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContainer}>
                                        {review.images.map((imgUri, imgIdx) => (
                                            <Image
                                                key={imgIdx}
                                                source={{ uri: imgUri }}
                                                style={styles.reviewAttachedImage}
                                            />
                                        ))}
                                    </ScrollView>
                                )}

                                {/* Merchant Reply */}
                                {review.merchantReply && (
                                    <View style={styles.merchantReplyCard}>
                                        <View style={styles.merchantReplyHeader}>
                                            <MaterialIcons name="storefront" size={16} color="#EE4D2D" />
                                            <Text style={styles.merchantReplyTitle}>Phản hồi từ Cửa hàng</Text>
                                            {review.repliedAt && (
                                                <Text style={styles.replyDateText}>{formatDate(review.repliedAt)}</Text>
                                            )}
                                        </View>
                                        <Text style={styles.merchantReplyText}>{review.merchantReply}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EE4D2D',
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 12,
        marginTop: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EE4D2D',
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    summaryLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.4,
    },
    avgRatingText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    totalReviewsText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 6,
    },
    divider: {
        width: 1,
        height: 80,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    summaryRight: {
        flex: 0.6,
        justifyContent: 'center',
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    starLabelText: {
        fontSize: 11,
        color: '#6B7280',
        width: 10,
        textAlign: 'right',
        marginRight: 4,
    },
    progressBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 3,
    },
    starCountText: {
        fontSize: 10,
        color: '#6B7280',
        width: 24,
        textAlign: 'right',
        marginLeft: 6,
    },
    filterSection: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        marginLeft: 4,
    },
    filterScrollView: {
        paddingBottom: 4,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#FFF0ED',
        borderColor: '#EE4D2D',
    },
    filterChipText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#EE4D2D',
        fontWeight: '700',
    },
    loadingContainer: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#6B7280',
        fontSize: 14,
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        marginTop: 12,
        color: '#9CA3AF',
        fontSize: 15,
    },
    reviewsListContainer: {
        marginTop: 12,
        paddingBottom: 32,
    },
    reviewItemCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarPlaceholder: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EE4D2D',
    },
    reviewUserMeta: {
        flex: 1,
        marginLeft: 10,
    },
    userNameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    starsAndDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    dateText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    commentText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 8,
    },
    imageScrollContainer: {
        gap: 8,
        paddingVertical: 4,
        marginBottom: 8,
    },
    reviewAttachedImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    merchantReplyCard: {
        backgroundColor: '#FFF8F6',
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#FFEBE7',
    },
    merchantReplyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    merchantReplyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#EE4D2D',
        marginLeft: 6,
        flex: 1,
    },
    replyDateText: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    merchantReplyText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },
});
