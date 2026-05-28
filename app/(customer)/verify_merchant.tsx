import { KeyboardAvoidingView, Platform, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import React, { useState } from "react";

export default function VerifyMerchant() {
    const [merchantName, setMerchantName] = useState("");
    const [faxID, setFaxID] = useState("");
    const [logo, setLogo] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const [license, setLicense] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [confirmBusiness, setConfirmBusiness] = useState(false);

    const router = useRouter();
    const handleTakePhoto = async (type: "logo" | "banner" | "license") => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.status !== 'granted') {
                alert('Xin cấp quyền truy cập camera để sử dụng chức năng này.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                if (type === "logo") {
                    setLogo(imageUri);
                } else if (type === "banner") {
                    setBanner(imageUri);
                } else if (type === "license") {
                    setLicense(imageUri);
                }
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    const handleChooseFromLibrary = async (type: "logo" | "banner" | "license") => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.status !== 'granted') {
                alert('Xin cấp quyền truy cập thư viện để sử dụng chức năng này.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
                selectionLimit: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                if (type === "logo") {
                    setLogo(imageUri);
                } else if (type === "banner") {
                    setBanner(imageUri);
                } else if (type === "license") {
                    setLicense(imageUri);
                }
            }
        } catch (error) {
            console.error('Error choosing from library:', error);
        }
    };

    const handleSave = async () => {

    };

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
                            <Text style={styles.sectionTitle}>Số Fax</Text>
                            <TextInput style={styles.input} placeholder="Nhập số Fax" value={faxID} onChangeText={setFaxID} />
                        </View>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hình ảnh thương hiệu</Text>
                        </View>

                        <View style={[styles.sectionContainer, { width: 250, height: 250, alignSelf: 'center' }]}>
                            <Text style={[styles.sectionTitle, { alignSelf: 'center' }]}>Tải lên Logo</Text>

                            {logo ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: logo }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setLogo(null)}>
                                        <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.dashedContainer}>
                                    <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("logo")}>
                                        <MaterialIcons name="add-a-photo" size={24} color="#9CA3AF" />
                                        <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("logo")}>
                                        <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                        <Text style={styles.libraryButtonText}>Thư viện</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Tải lên Banner</Text>

                            {banner ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: banner }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setBanner(null)}>
                                        <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.dashedContainer}>
                                    <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("banner")}>
                                        <MaterialIcons name="photo-size-select-actual" size={24} color="#9CA3AF" />
                                        <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("banner")}>
                                        <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                        <Text style={styles.libraryButtonText}>Thư viện</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hồ sơ pháp lý</Text>
                        </View>

                        <View style={[styles.sectionContainer, { backgroundColor: "#ecececff", padding: 20 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <AntDesign name="file-text" size={24} color="#EE4D2D" />
                                <Text style={styles.sectionTitle}>Giấy phép kinh doanh</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#949494ff' }}>Bạn cần tải lên giấy phép kinh doanh hợp lệ để xác minh tài khoản của mình</Text>
                            {license ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: license }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setLicense(null)}>
                                        <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.dashedContainer}>
                                    <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("license")}>
                                        <AntDesign name="cloud-upload" size={24} color="#9CA3AF" />
                                        <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("license")}>
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
                            (!logo || !license || !banner || !merchantName.trim() || !faxID.trim()) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSave}
                        disabled={!logo || !license || !banner || !merchantName.trim() || !faxID.trim() || submitting}
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
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
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