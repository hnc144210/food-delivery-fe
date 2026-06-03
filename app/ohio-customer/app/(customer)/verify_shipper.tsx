import { KeyboardAvoidingView, Platform, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ShipperProfileRequest } from "@/types/profile";
import { userService } from "@/services/userService";

export default function VerifyShipper() {
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [frontLicenseImage, setFrontLicenseImage] = useState<string | null>(null);
    const [backLicenseImage, setBackLicenseImage] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [citizenId, setCitizenId] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");

    const router = useRouter();
    const handleTakePhoto = async (type: "front" | "back" | "selfie") => {
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
                if (type === "front") {
                    setFrontImage(imageUri);
                } else if (type === "back") {
                    setBackImage(imageUri);
                } else if (type === "selfie") {
                    setSelfie(imageUri);
                }
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    const handleChooseFromLibrary = async (type: "front" | "back" | "selfie") => {
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
                if (type === "front") {
                    setFrontImage(imageUri);
                } else if (type === "back") {
                    setBackImage(imageUri);
                } else if (type === "selfie") {
                    setSelfie(imageUri);
                }
            }
        } catch (error) {
            console.error('Error choosing from library:', error);
        }
    };

    const registerForShipping = useMutation({
        mutationFn: () => userService.registerForShipping({
            dateOfBirth: dob,
            fullName: fullName,
            idCardBackUrl: backImage!,
            idCardFrontUrl: frontImage!,
            idNumber: citizenId,
            licenseBackUrl: backLicenseImage!,
            licenseFrontUrl: frontLicenseImage!,
            licenseNumber: licenseNumber,
            selfieUrl: selfie!,
        }),
        onSuccess: () => {
            router.back();
        },
        onError: (error: any) => {
            console.error('Error registering for shipping:', error);
        },
    });

    const handleSubmit = async () => {
        registerForShipping.mutate();
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Đăng ký giao hàng</Text>
                    <View style={{ width: 40 }} />
                </View>
                <ScrollView>
                    <View style={{ padding: 20, width: '100%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>Xác minh tài xế</Text>
                        <Text style={{ fontSize: 16, color: '#949494ff', marginBottom: 20 }}>Vui lòng cung cấp thông tin chính xác để kích hoạt tài khoản đối tác tài xế của bạn.</Text>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Thông tin cá nhân</Text>
                        </View>
                        <View style={{ flexDirection: 'column', width: '100%', gap: 10, marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Số CMND/CCCD</Text>
                            <TextInput style={styles.input} placeholder="Nhập số CMND/CCCD" value={citizenId} onChangeText={setCitizenId} />
                            <Text style={styles.sectionTitle}>Số GPLX</Text>
                            <TextInput style={styles.input} placeholder="Nhập số GPLX" value={licenseNumber} onChangeText={setLicenseNumber} />
                            <Text style={styles.sectionTitle}>Họ tên</Text>
                            <TextInput style={styles.input} placeholder="Nhập họ tên" value={fullName} onChangeText={setFullName} />
                            <Text style={styles.sectionTitle}>Ngày sinh</Text>
                            <TextInput style={styles.input} placeholder="dd/MM/yyyy" value={dob} onChangeText={setDob} />
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Ảnh selfie</Text>

                            {selfie ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: selfie }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelfie(null)}>
                                        <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.dashedContainer}>
                                    <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("selfie")}>
                                        <MaterialCommunityIcons name="face-recognition" size={70} color="#6B7280" />
                                        <Text style={styles.cameraTriggerText}>Chụp ảnh</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("selfie")}>
                                        <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                        <Text style={styles.libraryButtonText}>Thư viện</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>


                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hình ảnh CMND/CCCD</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
                            <View style={styles.sectionContainer}>
                                {frontImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: frontImage }} style={styles.imagePreview} />
                                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setFrontImage(null)}>
                                            <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.dashedContainer}>
                                        <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("front")}>
                                            <Ionicons name="camera-reverse" size={32} color="#6B7280" />
                                            <Text style={styles.cameraTriggerText}>Mặt trước</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("front")}>
                                            <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                            <Text style={styles.libraryButtonText}>Thư viện</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <View style={styles.sectionContainer}>
                                {backImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: backImage }} style={styles.imagePreview} />
                                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setBackImage(null)}>
                                            <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.dashedContainer}>
                                        <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("back")}>
                                            <Ionicons name="camera-reverse" size={32} color="#6B7280" />
                                            <Text style={styles.cameraTriggerText}>Mặt sau</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("back")}>
                                            <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                            <Text style={styles.libraryButtonText}>Thư viện</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: '#EE4D2D', paddingLeft: 10, marginBottom: 10, justifyContent: 'center', height: 30 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hình ảnh giấy phép lái xe</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
                            <View style={styles.sectionContainer}>
                                {frontLicenseImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: frontLicenseImage }} style={styles.imagePreview} />
                                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setFrontLicenseImage(null)}>
                                            <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.dashedContainer}>
                                        <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("front")}>
                                            <Ionicons name="camera-reverse" size={32} color="#6B7280" />
                                            <Text style={styles.cameraTriggerText}>Mặt trước</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("front")}>
                                            <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                            <Text style={styles.libraryButtonText}>Thư viện</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <View style={styles.sectionContainer}>
                                {backLicenseImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: backLicenseImage }} style={styles.imagePreview} />
                                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setBackLicenseImage(null)}>
                                            <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.dashedContainer}>
                                        <TouchableOpacity style={styles.cameraTrigger} onPress={() => handleTakePhoto("back")}>
                                            <Ionicons name="camera-reverse" size={32} color="#6B7280" />
                                            <Text style={styles.cameraTriggerText}>Mặt sau</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.libraryButton} onPress={() => handleChooseFromLibrary("back")}>
                                            <MaterialIcons name="image" size={18} color="#9CA3AF" />
                                            <Text style={styles.libraryButtonText}>Thư viện</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonFooter}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!citizenId.trim() || !licenseNumber.trim() || !fullName.trim() || !dob.trim() || !frontImage || !backImage || !frontLicenseImage || !backLicenseImage || !selfie) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!citizenId.trim() || !licenseNumber.trim() || !fullName.trim() || !dob.trim() || !frontImage || !backImage || !frontLicenseImage || !backLicenseImage || !selfie}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.submitButtonText}>Gửi thông tin đăng ký</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </View>
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
        backgroundColor: 'white',
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