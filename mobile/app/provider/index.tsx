import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const stats = [
  { label: 'الخدمات النشطة', value: '٤', icon: 'briefcase', color: '#1565C0' },
  { label: 'الطلبات الجديدة', value: '١٢', icon: 'document-text', color: '#F9A825' },
  { label: 'المنجزة', value: '٤٧', icon: 'checkmark-done', color: '#2e7d32' },
  { label: 'التقييم', value: '٤.٨', icon: 'star', color: '#f5a623' },
];

const recentOrders = [
  { id: '#١٠٢٤', service: 'تركيب مكيف', client: 'محمد علي', amount: '٨,٠٠٠ ﷼', status: 'جديد' },
  { id: '#١٠٢٣', service: 'سباكة حمام', client: 'خالد أحمد', amount: '١٢,٠٠٠ ﷼', status: 'قيد التنفيذ' },
  { id: '#١٠٢٢', service: 'دهان غرفة', client: 'سامي حسن', amount: '٥,٠٠٠ ﷼', status: 'منجز' },
];

export default function ProviderDashboardScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>لوحة التحكم</Text>
        <TouchableOpacity onPress={() => router.push('/provider/earnings')}>
          <Ionicons name="bar-chart" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>إجمالي الأرباح</Text>
          <Text style={styles.summaryValue}>٢٣٤,٠٠٠ ﷼</Text>
          <Text style={styles.summaryChange}>↑ ١٢٪ عن الشهر الماضي</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>آخر الطلبات</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>عرض الكل ←</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.map((order, i) => (
          <View key={i} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.statusBadge,
                { backgroundColor: order.status === 'جديد' ? Colors.info + '20' : order.status === 'قيد التنفيذ' ? Colors.warning + '20' : Colors.success + '20' }
              ]}>
                <Text style={[styles.statusText,
                  { color: order.status === 'جديد' ? Colors.info : order.status === 'قيد التنفيذ' ? Colors.warning : Colors.success }
                ]}>{order.status}</Text>
              </View>
            </View>
            <Text style={styles.orderService}>{order.service}</Text>
            <View style={styles.orderBottom}>
              <Text style={styles.orderClient}>{order.client}</Text>
              <Text style={styles.orderAmount}>{order.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, padding: Spacing.md },
  summaryCard: { backgroundColor: Colors.primary, borderRadius: Roundness.md, padding: Spacing.lg, ...Shadow.elevated, marginBottom: Spacing.md },
  summaryLabel: { ...Typography.bodyMd, color: Colors.primaryLight },
  summaryValue: { ...Typography.displayLg, color: Colors.white, marginTop: Spacing.xs },
  summaryChange: { ...Typography.labelSm, color: Colors.primaryLight, marginTop: Spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card },
  statIcon: { width: 40, height: 40, borderRadius: Roundness.full, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  statValue: { ...Typography.headlineSm, color: Colors.onSurface },
  statLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  seeAll: { ...Typography.labelLg, color: Colors.primary },
  orderCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  orderId: { ...Typography.labelLg, color: Colors.onSurface },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: Roundness.full },
  statusText: { ...Typography.labelSm },
  orderService: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginBottom: Spacing.sm },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  orderClient: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  orderAmount: { ...Typography.labelLg, color: Colors.primary },
});
