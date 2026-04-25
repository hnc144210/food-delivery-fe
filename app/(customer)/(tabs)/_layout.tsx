import { Stack, Tabs } from 'expo-router';

export default function CustomerLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" options={{ title: 'Home' }} />
        </Tabs>
    );
}