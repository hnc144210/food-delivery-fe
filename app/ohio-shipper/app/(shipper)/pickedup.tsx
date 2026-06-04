import { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import api from "@/services/api";
import { mock_odercard, OrderCardType } from "../../mock/shipper";
import { ShipperAssignmentDto, UpdateDeliveryStatusRequestDto } from "@/types/assignment";
import { fileService } from "@/services/fileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "@/services/deliveryService";

export default function Pickedup() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data } = useLocalSearchParams();
    const assignment = JSON.parse(data as string) as ShipperAssignmentDto;

    // States
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [proofImage, setProofImage] = useState('');

    // Handle launch camera
    const handleTakePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Quyền truy cập máy ảnh",
                    "Vui lòng cấp quyền truy cập máy ảnh trong cài đặt thiết bị để chụp ảnh minh chứng!"
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
                setProofImage(result.assets[0].uri);
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
                    "Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh minh chứng!"
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
                setProofImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error choosing image from library:", error);
            Alert.alert("Lỗi", "Không thể mở thư viện ảnh!");
        }
    };

    const updateStatusMutation = useMutation({
        mutationFn: ({ assignmentId, data }: { assignmentId: string, data: UpdateDeliveryStatusRequestDto }) => deliveryService.updateDeliveryStatus(assignmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assigned-deliveries'] });
            queryClient.invalidateQueries({ queryKey: ['offer-assignments'] });
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            Alert.alert("Thành công", "Cập nhật trạng thái đơn hàng thành công");
        },
        onError: (error) => {
            Alert.alert("Lỗi", error.message);
        }
    })

    // Handle submit confirmation
    const handleConfirmDelivered = async () => {
        if (!proofImage || !assignment.orderId) return;
        setSubmitting(true);
        try {
            let finalFileKey = '';
            if (proofImage) {
                const fileName = proofImage.split('/').pop() || "image.jpg";
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

                const uploadUrlResponse = await fileService.getUploadUrlForCompletion(assignment.orderId, assignment.shipperId, 'pickingup', fileName, contentType);
                const { uploadUrl, fileKey } = uploadUrlResponse;

                await fileService.uploadFile(uploadUrl, proofImage, contentType);

                finalFileKey = fileKey;
            }
            updateStatusMutation.mutate({ assignmentId: assignment.id, data: { status: "PickedUp", note: "Đã lấy hàng", proofFileKey: finalFileKey } })
            router.back();
        } catch (error) {
            console.log("Error confirming delivery:", error);
            Alert.alert("Lỗi", "Không thể xác nhận đơn hàng!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#EE4D2D" />
                <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải thông tin đơn hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Xác nhận đã lấy hàng</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.scrollContent}>
                {/* Order Information Card */}
                <View style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                        <View style={{ width: 250 }}>
                            <Text style={styles.orderLabel}>MÃ ĐƠN HÀNG</Text>
                            <Text style={styles.orderCode}>{assignment.id}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>Nhận đơn</Text>
                        </View>
                    </View>

                    <View style={styles.addressBlock}>
                        <EvilIcons name="location" size={24} color="#EE4D2D" style={styles.addressIcon} />
                        <Text style={styles.addressText}>{assignment.dropoffAddress}</Text>
                    </View>
                </View>

                {/* Section Title */}
                <Text style={styles.sectionTitle}>Xác nhận đã lấy hàng</Text>

                {/* Proof Dotted Box */}
                <View style={styles.dashedContainer}>
                    {proofImage ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: proofImage }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => setProofImage('')}>
                                <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.dashedInner}>
                            <TouchableOpacity style={styles.cameraCircle} onPress={handleTakePhoto}>
                                <Ionicons name="camera" size={30} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.dashedTitle}>Chụp ảnh gói hàng</Text>
                            <Text style={styles.dashedSubtitle}>Hoặc chọn từ thư viện của bạn</Text>

                            <TouchableOpacity style={styles.libraryButton} onPress={handleChooseFromLibrary}>
                                <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                <Text style={styles.libraryButtonText}>Thư viện</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Safety Alert Banner */}
                <View style={styles.warningBanner}>
                    <Ionicons name="information-circle-outline" size={22} color="#EF4444" style={styles.warningIcon} />
                    <Text style={styles.warningText}>
                        Vui lòng đảm bảo ảnh chụp rõ địa chỉ nhà hoặc khu vực đặt hàng để hoàn tất quy trình an toàn.
                    </Text>
                </View>

                {/* Bottom Confirm Action */}
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        !proofImage && styles.confirmButtonDisabled
                    ]}
                    onPress={handleConfirmDelivered}
                    disabled={!proofImage || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.confirmButtonText}>XÁC NHẬN ĐÃ LẤY HÀNG</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F6F6',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#B22203',
        textAlign: 'center',
        flex: 1,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        gap: 20,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    orderCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 4,
    },
    statusBadge: {
        backgroundColor: '#E9D5FF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    statusBadgeText: {
        color: '#9333EA',
        fontSize: 11,
        fontWeight: 'bold',
    },
    addressBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    addressIcon: {
        marginRight: 6,
        marginLeft: -4,
        marginTop: -1,
    },
    addressText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        lineHeight: 22,
    },
    noteText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 26,
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 4,
    },
    dashedContainer: {
        width: '100%',
        height: 240,
        borderWidth: 1.5,
        borderColor: '#CCCCCC',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    dashedInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cameraCircle: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: '#FF7A59',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF7A59',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 14,
    },
    dashedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    dashedSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 16,
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
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    imagePreviewContainer: {
        width: '100%',
        height: '100%',
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
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        padding: 14,
        gap: 8,
    },
    warningIcon: {
        marginTop: 1,
    },
    warningText: {
        flex: 1,
        fontSize: 12.5,
        color: '#991B1B',
        lineHeight: 18,
        fontWeight: '500',
    },
    confirmButton: {
        height: 55,
        borderRadius: 12,
        backgroundColor: '#EE4D2D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EC9E8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 10,
        marginBottom: 30,
    },
    confirmButtonDisabled: {
        backgroundColor: '#F5C2B5',
        opacity: 0.7,
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});