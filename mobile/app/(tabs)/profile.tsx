import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { icon: 'stats-chart', label: 'لوحة التحكم', route: '/provider' },
  { icon: 'shield-checkmark', label: 'لوحة المشرف', route: '/admin' },
  { icon: 'add-circle', label: 'إضافة خدمة', route: '/add-service' },
  { icon: 'wallet', label: 'المحفظة', route: '/wallet' },
  { icon: 'notifications', label: 'الإشعارات', route: '/notifications' },
  { icon: 'star', label: 'التقييمات', route: '/settings' },
  { icon: 'settings-sharp', label: 'الإعدادات', route: '/settings' },
  { icon: 'help-circle', label: 'مساعدة ودعم', route: '/settings' },
];

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد؟', [
      { text: 'إلغاء' },
      { text: 'تسجيل خروج', onPress: async () => { await AsyncStorage.removeItem('token'); router.replace('/(auth)/welcome'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>حسابي</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>مستخدم</Text>
            <Text style={styles.profilePhone}>٧٧٠٠٠٠٠٠٠</Text>
            <Text style={styles.profileRole}>صاحب عمل • صاحب مهارة</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>٠</Text>
            <Text style={styles.statLabel}>خدمات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>٠</Text>
            <Text style={styles.statLabel}>طلبات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>٠</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={() => router.push(item.route as any)}>
              <Ionicons name={item.icon as any} size={22} color={Colors.onSurfaceVariant} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.outline} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: Roundness.xl, borderBottomRightRadius: Roundness.xl },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginTop: Spacing.md, ...Shadow.card },
  avatar: { width: 56, height: 56, borderRadius: Roundness.full, backgroundColor: Colors.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.headlineMd, color: Colors.white },
  profileInfo: { flex: 1, marginHorizontal: Spacing.sm },
  profileName: { ...Typography.labelLg, color: Colors.onSurface },
  profilePhone: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  profileRole: { ...Typography.labelSm, color: Colors.primary },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, alignItems: 'center', ...Shadow.card },
  statNumber: { ...Typography.headlineMd, color: Colors.primary },
  statLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  menuSection: { backgroundColor: Colors.white, borderRadius: Roundness.md, marginTop: Spacing.md, overflow: 'hidden', ...Shadow.card },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHighest },
  menuLabel: { flex: 1, ...Typography.bodyMd, color: Colors.onSurface, marginHorizontal: Spacing.sm },
  logoutBtn: { paddingVertical: 16, alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  logoutText: { ...Typography.labelLg, color: Colors.error },
});
