import { KeyboardAvoidingView, Platform, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { fileService } from "@/services/fileService";
import * as FileSystem from 'expo-file-system/legacy';

export default function VerifyMerchant() {
    const [merchantName, setMerchantName] = useState("");
    const [description, setDescription] = useState("");
    const [taxId, setTaxId] = useState("");
    const [businessLicense, setBusinessLicense] = useState("");
    const [businessLicenseUrl, setBusinessLicenseUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();
    const handleTakePhoto = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.status !== 'granted') {
                alert('Xin cấp quyền truy cập camera để sử dụng chức năng này.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [9, 16],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                setBusinessLicenseUrl(imageUri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    const handleChooseFromLibrary = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.status !== 'granted') {
                alert('Xin cấp quyền truy cập thư viện để sử dụng chức năng này.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [9, 16],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                setBusinessLicenseUrl(imageUri);
            }
        } catch (error) {
            console.error('Error choosing from library:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện');
        }
    };

    const registerForMerchantMutation = useMutation({
        mutationFn: (variables: { licenseUrl: string }) => userService.registerForMerchant({
            storeName: merchantName,
            storeDescription: description,
            taxId: taxId,
            businessLicense: businessLicense,
            businessLicenseUrl: variables.licenseUrl,
        }),
        onSuccess: () => {
            Alert.alert("Thành công", "Đăng ký bán hàng thành công!");
            router.back();
        },
        onError: (error: any) => {
            Alert.alert("Lỗi", error.message || "Đăng ký bán hàng thất bại!");
        }
    });

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const fileName = businessLicenseUrl.split('/').pop() || "image.jpg";
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

            const uploadUrlResponse = await fileService.getUploadUrl(fileName, contentType);
            const { uploadUrl, fileKey } = uploadUrlResponse;

            await fileService.uploadFile(uploadUrl, businessLicenseUrl, contentType);

            const readUrlResponse = await fileService.getReadUrl(fileKey);
            const { readUrl } = readUrlResponse;
            console.log('Read URL:', readUrl);

            setBusinessLicenseUrl(readUrl);

            await registerForMerchantMutation.mutateAsync({ licenseUrl: readUrl });

        } catch (error) {
            console.error("Lỗi trong quá trình xử lý:", error);
            Alert.alert('Lỗi', (error as Error).message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Đăng ký bán hàng</Text>
                    <View style={{ width: 40 }} />
                </View>
                <ScrollView>
                    <View style={{ padding: 20, width: '100%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>Xác minh chủ sở hữu</Text>
                        <Text style={{ fontSize: 16, color: '#949494ff', marginBottom: 20 }}>Vui lòng cung cấp thông tin chính xác để kích hoạt tài khoản đối tác tài xế của bạn.</Text>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Thông tin nhà hàng</Text>
                        </View>

                        <View style={{ flexDirection: 'column', width: '100%', gap: 10, marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Tên nhà hàng</Text>
                            <TextInput style={styles.input} placeholder="Nhập tên nhà hàng" value={merchantName} onChangeText={setMerchantName} />
                            <Text style={styles.sectionTitle}>Mô tả</Text>
                            <TextInput style={styles.input} placeholder="Nhập mô tả về nhà hàng" value={description} onChangeText={setDescription} />
                            <Text style={styles.sectionTitle}>Mã số thuế</Text>
                            <TextInput style={styles.input} placeholder="Nhập mã số thuế" value={taxId} onChangeText={setTaxId} />
                            <Text style={styles.sectionTitle}>Giấy phép kinh doanh</Text>
                            <TextInput style={styles.input} placeholder="Nhập giấy phép kinh doanh" value={businessLicense} onChangeText={setBusinessLicense} />
                        </View>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hồ sơ pháp lý</Text>
                        </View>

                        <View style={[styles.sectionContainer, { backgroundColor: "#ecececff", padding: 20, borderRadius: 12 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <AntDesign name="file-text" size={24} color="#EE4D2D" />
                                <Text style={styles.sectionTitle}>Giấy phép kinh doanh</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#949494ff' }}>Bạn cần tải lên giấy phép kinh doanh hợp lệ để xác minh tài khoản của mình</Text>
                            {businessLicenseUrl ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: businessLicenseUrl }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setBusinessLicenseUrl("")}>
                                        <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.dashedContainer}>
                                    <TouchableOpacity style={styles.cameraTrigger} onPress={handleTakePhoto}>
                                        <MaterialIcons name="photo-camera" size={24} color="#9CA3AF" />
                                        <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.libraryButton} onPress={handleChooseFromLibrary}>
                                        <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                        <Text style={styles.libraryButtonText}>Thư viện</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonFooter}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!businessLicenseUrl || !merchantName.trim() || !taxId.trim() || !businessLicense.trim()) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!businessLicenseUrl || !merchantName.trim() || !taxId.trim() || !businessLicense.trim() || submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Text style={styles.submitButtonText}>Gửi thông tin đăng ký</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        gap: 8,
    },
    sectionContainer: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 590,
        borderRadius: 8,
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 14,
        padding: 2,
    },
    dashedContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    cameraTrigger: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    cameraTriggerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    libraryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    libraryButtonText: {
        fontSize: 14,
        color: '#6B7280',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    buttonFooter: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        paddingTop: 10,
        backgroundColor: '#F6F6F6',
    },
    submitButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: '#EE4D2D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EE4D2D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#F3A495',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    sendIcon: {
        marginTop: 1,
    },
})