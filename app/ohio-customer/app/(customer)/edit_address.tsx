import { useState, useEffect, useMemo } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from "react-native";
import { ReturnButton } from "@/components/ui/ReturnButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { mock_addresses, mock_addresses_new } from "@/mock/home";
import { userService } from "@/services/userService";
import { AddressRequestDto } from "@/types/address";

// ─── Dropdown Options ────────────────────────────────────────────────────────

const CITY_OPTIONS = [
    "Thành phố Hồ Chí Minh",
    "Thành phố Hà Nội",
    "Thành phố Đà Nẵng",
    "Thành phố Cần Thơ",
    "Thành phố Hải Phòng"
];

const WARD_OPTIONS = [
    "Phường Bến Nghé",
    "Phường Bến Thành",
    "Phường Cầu Ông Lãnh",
    "Phường Cô Giang",
    "Phường Nguyễn Thái Bình",
    "Phường Đa Kao",
    "Phường Tân Định",
    "Phường Phạm Ngũ Lão",
    "Phường Cầu Kho"
];

const STREET_OPTIONS = [
    "Đường Nguyễn Huệ",
    "Đường Lê Lợi",
    "Đường Đồng Khởi",
    "Đường Pasteur",
    "Đường Nam Kỳ Khởi Nghĩa",
    "Đường Võ Văn Kiệt",
    "Đường Hàm Nghi",
    "Đường Tôn Đức Thắng",
    "Đường Cách Mạng Tháng 8",
    "Đường Nguyễn Thị Minh Khai"
];

// ─── ComboBox Sub-component ──────────────────────────────────────────────────

interface ComboBoxProps {
    label: string;
    value: string;
    options: string[];
    onSelect: (val: string) => void;
    placeholder: string;
}

function ComboBox({ label, value, options, onSelect, placeholder }: ComboBoxProps) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.content}>
            <Text style={styles.labelText}>{label}:</Text>
            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => {
                    Keyboard.dismiss();
                    setVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Text style={{ flex: 1, color: value ? '#111827' : '#9ca3af', fontSize: 15 }}>
                    {value || placeholder}
                </Text>
                <AntDesign name="down" size={14} color="#6b7280" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Chọn {label}</Text>
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <AntDesign name="close" size={20} color="#4b5563" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.optionItem, value === item && styles.selectedOption]}
                                        onPress={() => {
                                            onSelect(item);
                                            setVisible(false);
                                        }}
                                    >
                                        <Text style={[styles.optionText, value === item && styles.selectedOptionText]}>
                                            {item}
                                        </Text>
                                        {value === item && <AntDesign name="check" size={16} color="#EE4D2D" />}
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EditAddressScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { Id } = useLocalSearchParams<{ Id: string }>();

    const user = useAuthStore((s) => s.user);
    const userId = user?.id;

    // Form states
    const [label, setLabel] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [street, setStreet] = useState("");
    const [ward, setWard] = useState("");
    const [city, setCity] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    // Load current address
    const { data: address } = useQuery({
        queryKey: ['addresses', userId],
        queryFn: () => userService.getAddressDetail(userId!, Id!),
        enabled: !!userId,
    });

    const addressDetail = address ? address : useMemo(() => mock_addresses_new.find((p) => p.Id === Id), [Id])
    // Populate values on load
    useEffect(() => {
        if (addressDetail) {
            setLabel(addressDetail.Label || "null");
            setReceiverName(addressDetail.RecipientName || "null");
            setReceiverPhone(addressDetail.Phone || "null");
            setAddressLine(addressDetail.AddressLine || "null");
            setStreet(addressDetail.Ward || "null");
            setWard(addressDetail.District || "null");
            setCity(addressDetail.City || "null");
            setIsDefault(addressDetail.IsDefault || false);
        }
    }, [addressDetail]);

    // Mutation to save changes (Updates locally / mocks or hits BE endpoint)
    const updateAddressMutation = useMutation({
        mutationFn: () => {
            if (!userId) {
                throw new Error("User not found");
            }
            if (!Id) {
                throw new Error("Address not found");
            }
            const updatedAddress: AddressRequestDto = {
                Label: label,
                RecipientName: receiverName,
                Phone: receiverPhone,
                AddressLine: addressLine,
                Ward: street,
                District: ward,
                City: city,
                IsDefault: isDefault,
                Lat: addressDetail?.Lat || 0,
                Lng: addressDetail?.Lng || 0,
            };
            return userService.updateAddress(userId, Id, updatedAddress);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
            alert("Cập nhật địa chỉ thành công!");
            router.back();
        },
        onError: (error) => {
            console.log("Error updating address:", error);
            alert("Cập nhật địa chỉ thất bại!");
        }
    });
    const createAddressMutation = useMutation({
        mutationFn: () => {
            if (!userId) {
                throw new Error("User not found");
            }
            const newAddress: AddressRequestDto = {
                Label: label,
                RecipientName: receiverName,
                Phone: receiverPhone,
                AddressLine: addressLine,
                Ward: street,
                District: ward,
                City: city,
                IsDefault: isDefault,
                Lat: addressDetail?.Lat || 0,
                Lng: addressDetail?.Lng || 0,
            };
            return userService.createAddress(userId, newAddress);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
            alert("Thêm địa chỉ thành công!");
            router.back();
        },
        onError: (error) => {
            console.log("Error creating address:", error);
            alert("Thêm địa chỉ thất bại!");
        }
    });

    const handleSave = () => {
        if (!label || !receiverName || !receiverPhone || !addressLine) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }
        if (addressDetail?.Id) {
            updateAddressMutation.mutate();
        } else {
            createAddressMutation.mutate();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Thông tin địa điểm</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Form Body ScrollView */}
                <ScrollView
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Text style={styles.labelText}>Tên địa điểm:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên địa điểm (ví dụ: Nhà, Công ty)"
                            value={label}
                            onChangeText={setLabel}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.labelText}>Tên người nhận:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên người nhận"
                            value={receiverName}
                            onChangeText={setReceiverName}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.labelText}>Số điện thoại:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            value={receiverPhone}
                            onChangeText={setReceiverPhone}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.labelText}>Địa chỉ (Số nhà):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số nhà, số căn hộ"
                            value={addressLine}
                            onChangeText={setAddressLine}
                        />
                    </View>

                    {/* 3 Dropdown ComboBoxes at the bottom */}
                    <ComboBox
                        label="Đường"
                        value={street}
                        options={STREET_OPTIONS}
                        onSelect={setStreet}
                        placeholder="Chọn đường"
                    />

                    <ComboBox
                        label="Phường"
                        value={ward}
                        options={WARD_OPTIONS}
                        onSelect={setWard}
                        placeholder="Chọn phường"
                    />

                    <ComboBox
                        label="Thành phố"
                        value={city}
                        options={CITY_OPTIONS}
                        onSelect={setCity}
                        placeholder="Chọn thành phố"
                    />

                    {/* Checkbox for default address */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsDefault(!isDefault)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                            {isDefault && <AntDesign name="check" size={14} color="white" />}
                        </View>
                        <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={updateAddressMutation.isPending}
                        activeOpacity={0.85}
                    >
                        {updateAddressMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

export const styles = StyleSheet.create({
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
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        gap: 8,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    dropdownTrigger: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    // Modal & Combobox popup styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f9fafb',
    },
    selectedOption: {
        backgroundColor: '#fff7f5',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    optionText: {
        fontSize: 15,
        color: '#374151',
    },
    selectedOptionText: {
        fontWeight: '600',
        color: '#EE4D2D',
    },
    // Save button
    saveButton: {
        backgroundColor: '#EE4D2D',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 20,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EE4D2D',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Checkbox custom styles
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 5,
        gap: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    checkboxChecked: {
        borderColor: '#EE4D2D',
        backgroundColor: '#EE4D2D',
    },
    checkboxLabel: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
});