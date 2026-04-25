import { Stack } from 'expo-router';
export default function CustomerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="restaurant" options={{ headerShown: false, title: 'Nhà hàng' }} />
            <Stack.Screen name="searchresult" options={{ headerShown: false, title: 'Tìm kiếm' }} />
        </Stack>
    );
}