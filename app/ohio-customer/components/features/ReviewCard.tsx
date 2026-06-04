import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export interface ReviewState {
    rating: number;
    comment: string;
    image: string | null;
}

interface ReviewCardProps {
    productId: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    unitPrice: number;
    reviewState: ReviewState;
    onChange: (state: Partial<ReviewState>) => void;
}

export function ReviewCard({
    productName,
    productImage,
    quantity,
    unitPrice,
    reviewState,
    onChange
}: ReviewCardProps) {
    const { rating, comment, image } = reviewState;

    const handleTakePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Quyền truy cập máy ảnh",
                    "Vui lòng cấp quyền truy cập máy ảnh trong cài đặt thiết bị để chụp ảnh sản phẩm!"
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onChange({ image: result.assets[0].uri });
            }
        } catch (error) {
            console.log("Error launching camera:", error);
            Alert.alert("Lỗi", "Không thể khởi động máy ảnh!");
        }
    };

    const handleChooseFromLibrary = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Quyền truy cập thư viện",
                    "Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh sản phẩm!"
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onChange({ image: result.assets[0].uri });
            }
        } catch (error) {
            console.log("Error choosing image:", error);
            Alert.alert("Lỗi", "Không thể mở thư viện ảnh!");
        }
    };

    return (
        <View style={styles.card}>
            {/* Product Header */}
            <View style={styles.productRow}>
                <Image 
                    source={{ uri: productImage || 'https://via.placeholder.com/100' }} 
                    style={styles.productImage} 
                />
                <View style={styles.productMeta}>
                    <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.quantityText}>{quantity}x</Text>
                        <Text style={styles.priceText}>{unitPrice.toLocaleString('vi-VN')}đ</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Star Rating Section */}
            <Text style={styles.sectionLabel}>Đánh giá chất lượng sản phẩm</Text>
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => onChange({ rating: star })}
                        activeOpacity={0.7}
                        style={styles.starTouchable}
                    >
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={28}
                            color={star <= rating ? '#FFD700' : '#9CA3AF'}
                        />
                    </TouchableOpacity>
                ))}
                {rating > 0 && (
                    <Text style={styles.ratingText}>
                        {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Không hài lòng' : 'Rất tệ'}
                    </Text>
                )}
            </View>

            {/* Comment Section */}
            <Text style={styles.sectionLabel}>Bình luận / Nhận xét</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textArea}
                    value={comment}
                    onChangeText={(text) => onChange({ comment: text })}
                    placeholder="Chia sẻ hương vị, chất lượng và dịch vụ..."
                    placeholderTextColor="#9CA3AF"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            {/* Image Section */}
            <Text style={styles.sectionLabel}>Hình ảnh thực tế</Text>
            {image ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity 
                        style={styles.removeImageButton} 
                        onPress={() => onChange({ image: null })}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close-circle" size={24} color="#FF5A5F" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.uploadOptionsContainer}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
                        <Ionicons name="camera" size={20} color="#EE4D2D" />
                        <Text style={styles.uploadButtonText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleChooseFromLibrary}>
                        <MaterialIcons name="image" size={20} color="#EE4D2D" />
                        <Text style={styles.uploadButtonText}>Thư viện</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    productMeta: {
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
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 13,
        color: '#6B7280',
        marginRight: 8,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EE4D2D',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 2,
    },
    starTouchable: {
        padding: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EE4D2D',
        marginLeft: 12,
    },
    inputContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 14,
    },
    textArea: {
        fontSize: 14,
        color: '#1F2937',
        height: 80,
        lineHeight: 20,
    },
    uploadOptionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    uploadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0ED',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFEBE7',
        paddingVertical: 10,
        gap: 6,
    },
    uploadButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EE4D2D',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
});
