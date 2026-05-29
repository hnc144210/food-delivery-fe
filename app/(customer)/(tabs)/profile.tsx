import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { FontAwesome } from "@expo/vector-icons";
import { profileService } from "@/services/profileService";


export default function ProfileScreen() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const userId = user?.id;
    const clearUser = useAuthStore((s) => s.clearUser);

    // Dynamic reactive query to get latest user profile from backend
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(userId!),
        enabled: !!userId,
    });

    const handleLogout = () => {
        clearUser();
        router.replace('/login');
    }

    const displayUser = user;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white' }}>Thông tin cá nhân</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.roundedBox}>
                    <Image
                        source={{ uri: displayUser?.avatar_url }}
                        style={{ width: 100, height: 100, borderRadius: 10, borderColor: '#ee4d2d41', borderWidth: 3 }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{displayUser?.name || 'Khách hàng'}</Text>
                        <Text style={{ fontSize: 15, color: '#bdbdbdff', marginTop: 2 }}>{displayUser?.email || 'chưa cập nhật email'}</Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#ee4d2d1c',
                                padding: 6,
                                paddingHorizontal: 12,
                                borderRadius: 90,
                                marginTop: 12,
                                alignSelf: 'flex-start'
                            }}
                            onPress={() => router.push('/profiledetail')}
                        >
                            <EvilIcons name="pencil" size={20} color="#EE4D2D" />
                            <Text style={{ color: '#EE4D2D', fontWeight: '600', marginLeft: 4 }}>Chỉnh sửa hồ sơ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.roundedBox, { flexDirection: 'column', gap: 10 }]}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', gap: 10 }} onPress={() => router.push('/(customer)/verify_merchant')}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#a8a8a81c', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Entypo name="shop" size={20} color="#818181ff" />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Đăng ký bán hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', gap: 10 }} onPress={() => router.push('/(customer)/verify_shipper')}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#8f8f8f1c', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="motorcycle" size={20} color="#818181ff" />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Đăng ký giao hàng</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.roundedBox}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', gap: 10 }} onPress={handleLogout}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#ee4d2d1c', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Entypo name="log-out" size={20} color="#EE4D2D" />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EE4D2D' }}>Đăng xuất tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#EE4D2D',
        width: '100%',
        gap: 10
    },
    body: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        padding: 20,
    },
    roundedBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        gap: 20,
    },
});