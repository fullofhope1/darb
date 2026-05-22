import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { Colors, Typography } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 64, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingBottom: 8, paddingTop: 8 },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.outline,
      tabBarLabelStyle: { ...Typography.labelSm },
    }}>
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'بحث', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'طلباتي', tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'المحادثات', tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'حسابي', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}
