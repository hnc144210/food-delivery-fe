import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AddressResponseDto } from "@/types/address";
import { useRouter } from "expo-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-native-toast-message";
import { homeService } from "@/services/homeService";
import { useAuthStore } from "@/store/authStore";

export function AddressCard({ Id, Label, Phone, AddressLine, Ward, District, City, IsDefault }: AddressResponseDto) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const userId = user?.id || '';
    const { mutateAsync: deleteAddress } = useMutation({
        mutationFn: () => homeService.deleteAddress(userId, Id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
            toast.show({
                type: 'success',
                text1: 'Xóa địa chỉ thành công',
            });
        },
        onError: () => {
            toast.show({
                type: 'error',
                text1: 'Xóa địa chỉ thất bại',
            });
        },
    });
    const handleDelete = () => {
        deleteAddress();
    }
    const handleUpdate = () => {
        router.push({ pathname: "/(customer)/edit_address", params: { Id } });
    }
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    {IsDefault &&
                        <>
                            <AntDesign name="environment" size={24} color={"#EE4D2D"} />
                            <Text style={styles.defaultBadge}>Mặc định</Text>
                        </>
                    }
                </View>
                <Text style={styles.name}>{Label}</Text>
                <Text style={styles.address}>{AddressLine}, {Ward}, {District}, {City}</Text>
                <Text style={styles.phoneNumber}>{Phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={handleUpdate}>
                    <AntDesign name="edit" size={20} color="gray" />
                    <Text style={styles.footerButtonText}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={handleDelete}>
                    <AntDesign name="delete" size={20} color="gray" />
                    <Text style={styles.footerButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 4
    },
    defaultBadge: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EE4D2D',
        backgroundColor: '#FFF2E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    content: {
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 14,
        color: 'gray',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 4,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        flex: 1,
        justifyContent: 'center',
    },
    footerButtonText: {
        fontSize: 14,
        color: 'gray',
        fontWeight: '500',
    },
});