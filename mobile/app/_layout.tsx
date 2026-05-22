import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/theme';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="service/[id]" />
        <Stack.Screen name="request/[id]" />
        <Stack.Screen name="chat/[userId]" />
        <Stack.Screen name="wallet" />
        <Stack.Screen name="transaction/[id]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="add-service" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="review" />
        <Stack.Screen name="provider" />
        <Stack.Screen name="admin" />
      </Stack>
    </View>
  );
}
