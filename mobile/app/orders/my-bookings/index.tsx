import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const bookings = [
  { id: '#١٠٢٤', service: 'تركيب مكيف سبلت', provider: 'أحمد محمد', date: '٢٠٢٦-٠٦-٠١', amount: '١٠,٠٠٠ ﷼', status: 'قادم', statusColor: Colors.info },
  { id: '#١٠٢٣', service: 'سباكة حمام', provider: 'خالد علي', date: '٢٠٢٦-٠٥-٢٨', amount: '١٢,٠٠٠ ﷼', status: 'قيد التنفيذ', statusColor: Colors.warning },
  { id: '#١٠٢٢', service: 'دهان غرفة نوم', provider: 'سامي حسن', date: '٢٠٢٦-٠٥-٢٠', amount: '٥,٠٠٠ ﷼', status: 'مكتمل', statusColor: Colors.success },
  { id: '#١٠٢١', service: 'تصميم شعار', provider: 'نور عبدالله', date: '٢٠٢٦-٠٥-١٥', amount: '٣,٠٠٠ ﷼', status: 'ملغي', statusColor: Colors.error },
];

export default function MyBookingsScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const filtered = bookings.filter(b => tab === 'upcoming' ? b.status !== 'مكتمل' && b.status !== 'ملغي' : b.status === 'مكتمل' || b.status === 'ملغي');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>حجوزاتي</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'upcoming' && styles.tabActive]} onPress={() => setTab('upcoming')}>
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>الحالية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'past' && styles.tabActive]} onPress={() => setTab('past')}>
          <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>السابقة</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>لا توجد حجوزات</Text>
          </View>
        ) : filtered.map((b, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardId}>{b.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: b.statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: b.statusColor }]}>{b.status}</Text>
              </View>
            </View>
            <Text style={styles.cardService}>{b.service}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardProvider}>{b.provider}</Text>
              <Text style={styles.cardDate}>{b.date}</Text>
            </View>
            <Text style={styles.cardAmount}>{b.amount}</Text>
          </TouchableOpacity>
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
  tabs: { flexDirection: 'row', margin: Spacing.md, backgroundColor: Colors.surfaceContainer, borderRadius: Roundness.md, padding: 3 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Roundness.md - 2, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadow.card },
  tabText: { ...Typography.labelLg, color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.primary },
  list: { flex: 1, paddingHorizontal: Spacing.md },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  cardId: { ...Typography.labelLg, color: Colors.onSurface },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: Roundness.full },
  statusText: { ...Typography.labelSm },
  cardService: { ...Typography.bodyMd, color: Colors.onSurface, marginBottom: Spacing.sm },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardProvider: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  cardDate: { ...Typography.labelSm, color: Colors.outline },
  cardAmount: { ...Typography.labelLg, color: Colors.primary, marginTop: Spacing.xs },
});
