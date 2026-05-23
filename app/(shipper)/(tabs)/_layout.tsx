import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ShipperLayout() {
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
            <Tabs.Screen name="home" options={{ title: 'Trang chủ', tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
            <Tabs.Screen name="history" options={{ title: 'Lịch sử', tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: 'Tài khoản', tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} /> }} />
        </Tabs>
    );
}