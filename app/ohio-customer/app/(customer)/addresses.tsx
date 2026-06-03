import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { AddressCard } from "@/components/features/AddressCard";
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { mock_addresses_new } from "../../mock/home";
import { userService } from "@/services/userService";

export default function AddressesScreen() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const userId = user?.id;

    const { data: addresses, isLoading } = useQuery({
        queryKey: ['addresses', userId],
        queryFn: () => userService.getAddresses(userId!),
        enabled: !!userId,
    });

    const addressList = addresses?.items || mock_addresses_new

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>Địa điểm của tôi</Text>
                <View style={{ width: 40 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10, paddingHorizontal: 20, height: 40, marginVertical: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Địa chỉ đã lưu</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 30, paddingHorizontal: 14, backgroundColor: 'white', borderRadius: 8 }} onPress={() => router.push('/(customer)/edit_address')}>
                    <AntDesign name="plus" size={20} color="#EE4D2D" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#EE4D2D' }}>Thêm địa điểm</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', paddingHorizontal: 20 }} >
                {isLoading ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#EE4D2D" />
                    </View>
                ) : addressList.length === 0 ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EE4D2D' }}>Chưa có địa chỉ nào</Text>
                    </View>
                ) : (
                    addressList.map((addr) => (
                        <AddressCard key={addr.id} {...addr} />
                    ))
                )}
            </ScrollView>
        </View>
    );
}
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
        gap: 8,
    },
});