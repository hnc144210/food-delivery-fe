import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { ReturnButton } from "@/components/ui/ReturnButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mock_nearbyrestaurant } from "@/mock/home";
import { mock_odercard_forcustomer } from "@/mock/customer_cart";
import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function Review() {
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewImage, setReviewImage] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const order = mock_odercard_forcustomer.find((o) => o.id?.toString() === id);
    const merchant = mock_nearbyrestaurant.find((r) => r.id === order?.merchantId);

    // Handle take photo
    const handleTakePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Quyền truy cập máy ảnh",
                    "Vui lòng cấp quyền truy cập máy ảnh trong cài đặt thiết bị để chụp ảnh minh chứng sự cố!"
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
                setReviewImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error launching camera:", error);
            Alert.alert("Lỗi", "Không thể khởi động máy ảnh!");
        }
    };

    // Handle choose from library
    const handleChooseFromLibrary = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Quyền truy cập thư viện",
                    "Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh minh chứng sự cố!"
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
                setReviewImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error choosing image:", error);
            Alert.alert("Lỗi", "Không thể mở thư viện ảnh!");
        }
    };

    const handleSubmitReview = () => {
        try {
            setSubmitting(true);

        } catch (error) {
            console.log("Error submitting review:", error);
            Alert.alert("Lỗi", "Không thể gửi đánh giá!");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Đánh giá</Text>
                    <View style={{ width: 40 }} />
                </View>
                <ScrollView style={{ width: '100%', padding: 20 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
                        <Image source={{ uri: merchant?.logo_url }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1 }}>
                            <Text style={{ color: '#949494ff' }}>Mã đơn: {order?.id}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{merchant?.name}</Text>
                            <Text style={{ color: '#949494ff' }}>Giao lúc {order?.deliveredtime}</Text>
                        </View>
                    </View>


                    <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 10, alignSelf: 'center' }}>Bạn hài lòng về đơn hàng chứ?</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                            >
                                <Ionicons
                                    name={star <= rating ? 'star' : 'star-outline'}
                                    size={32}
                                    color={star <= rating ? '#FFD700' : '#6B7280'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Nhận xét chi tiết</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textArea}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Hãy chia sẻ cảm nhận của bạn..."
                            placeholderTextColor="#9CA3AF"
                            multiline={true}
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Thêm hình ảnh</Text>
                    {reviewImage ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: reviewImage }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => setReviewImage(null)}>
                                <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.dashedContainer}>
                            <TouchableOpacity style={styles.cameraTrigger} onPress={handleTakePhoto}>
                                <Ionicons name="camera-reverse" size={32} color="#6B7280" />
                                <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.libraryButton} onPress={handleChooseFromLibrary}>
                                <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                <Text style={styles.libraryButtonText}>Thư viện</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
                <View style={styles.buttonFooter}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !description.trim() && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmitReview}
                        disabled={!description.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
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
    dashedContainer: {
        width: '100%',
        height: 180,
        borderWidth: 1.5,
        borderColor: '#CCCCCC',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 12,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20
    },
    textArea: {
        fontSize: 15,
        color: '#1F2937',
        height: 120,
        lineHeight: 22,
    },
    cameraTrigger: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    cameraTriggerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    libraryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    libraryButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 180,
        borderRadius: 16,
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
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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