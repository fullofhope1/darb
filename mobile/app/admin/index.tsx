import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const statsCards = [
  { label: 'المستخدمين', value: '١,٢٤٧', icon: 'people', color: '#1565C0', route: '/admin/users' },
  { label: 'الخدمات', value: '٨٩٢', icon: 'briefcase', color: '#2e7d32', route: '/admin/users' },
  { label: 'المعاملات', value: '٣,٤٥١', icon: 'swap-horizontal', color: '#F9A825', route: '/admin/users' },
  { label: 'الإيرادات', value: '١٢٬٤٥٠٬٠٠٠ ﷼', icon: 'cash', color: '#f5a623', route: '/admin/users' },
];

const quickActions = [
  { label: 'إدارة المستخدمين', icon: 'people', route: '/admin/users', color: '#1565C0' },
  { label: 'إدارة التصنيفات', icon: 'grid', route: '/admin/categories', color: '#2e7d32' },
  { label: 'إدارة النزاعات', icon: 'shield', route: '/admin/users', color: '#D32F2F' },
  { label: 'المدفوعات', icon: 'cash', route: '/admin/users', color: '#F9A825' },
  { label: 'إحصائيات', icon: 'bar-chart', route: '/admin/users', color: '#6A1B9A' },
  { label: 'الإعدادات', icon: 'settings', route: '/admin/settings', color: '#37474F' },
];

const recentUsers = [
  { name: 'أحمد محمد', phone: '٧٧١٢٣٤٥٦', date: 'منذ ٥ دقائق', role: 'مقدم خدمة' },
  { name: 'خالد علي', phone: '٧٧٩٨٧٦٥٤', date: 'منذ ساعة', role: 'صاحب عمل' },
  { name: 'سامي حسن', phone: '٧٧٣٢١٤٥٨', date: 'منذ ٣ ساعات', role: 'الاثنين' },
];

export default function AdminDashboardScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>لوحة المشرف</Text>
        <Ionicons name="shield-checkmark" size={22} color={Colors.white} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {statsCards.map((s, i) => (
            <TouchableOpacity key={i} style={[styles.statCard, { borderRightColor: s.color, borderRightWidth: 3 }]}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((a, i) => (
            <TouchableOpacity key={i} style={styles.actionCard} onPress={() => router.push(a.route as any)}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '20' }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>آخر المستخدمين</Text>
          <TouchableOpacity onPress={() => router.push('/admin/users')}>
            <Text style={styles.seeAll}>عرض الكل ←</Text>
          </TouchableOpacity>
        </View>

        {recentUsers.map((u, i) => (
          <View key={i} style={styles.userCard}>
            <View style={styles.userAvatar}><Text style={styles.avatarText}>{u.name[0]}</Text></View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userPhone}>{u.phone} • {u.role}</Text>
            </View>
            <Text style={styles.userDate}>{u.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, padding: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card },
  statIcon: { width: 36, height: 36, borderRadius: Roundness.full, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  statValue: { ...Typography.labelLg, color: Colors.onSurface, fontSize: 16 },
  statLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  actionCard: { width: '30%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.sm, alignItems: 'center', ...Shadow.card },
  actionIcon: { width: 44, height: 44, borderRadius: Roundness.full, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  actionLabel: { ...Typography.labelSm, color: Colors.onSurface, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  seeAll: { ...Typography.labelLg, color: Colors.primary },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.sm, marginBottom: Spacing.xs, ...Shadow.card },
  userAvatar: { width: 36, height: 36, borderRadius: Roundness.full, backgroundColor: Colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.labelLg, color: Colors.white },
  userInfo: { flex: 1, marginHorizontal: Spacing.sm },
  userName: { ...Typography.labelLg, color: Colors.onSurface },
  userPhone: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  userDate: { ...Typography.labelSm, color: Colors.outline },
});
