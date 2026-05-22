import { Stack } from 'expo-router'

export default function MerchantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-dish" />
      <Stack.Screen name="category-layout" />
      <Stack.Screen name="feedbacks" />
      <Stack.Screen name="store-info" />
      <Stack.Screen name="opening-hours" />
    </Stack>
  )
}