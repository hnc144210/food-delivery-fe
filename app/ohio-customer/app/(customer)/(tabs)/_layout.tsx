import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomerLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#FFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 10,
                height: 85,
            },
            tabBarActiveTintColor: '#EE4D2D',
            tabBarInactiveTintColor: '#c4c4c4ff',
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '500',
            },
        }}>
            <Tabs.Screen name="home" options={{ title: 'Trang chủ', tabBarIcon: ({ color }) => (<Ionicons name="home" size={20} color={color} />) }} />
            <Tabs.Screen name="cart" options={{ title: 'Giỏ hàng', tabBarIcon: ({ color }) => (<Ionicons name="cart" size={20} color={color} />) }} />
            <Tabs.Screen name="notification" options={{ title: 'Thông báo', tabBarIcon: ({ color }) => (<Ionicons name="notifications" size={20} color={color} />) }} />
            <Tabs.Screen name="profile" options={{ title: 'Tài khoản', tabBarIcon: ({ color }) => (<Ionicons name="person" size={20} color={color} />) }} />
        </Tabs>
    );
}