import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const [tab, setTab] = useState<'services' | 'requests'>('services');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>طلباتي</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'services' && styles.tabActive]} onPress={() => setTab('services')}>
          <Text style={[styles.tabText, tab === 'services' && styles.tabTextActive]}>الخدمات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'requests' && styles.tabActive]} onPress={() => setTab('requests')}>
          <Text style={[styles.tabText, tab === 'requests' && styles.tabTextActive]}>الطلبات</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={Colors.outlineVariant} />
          <Text style={styles.emptyText}>لا توجد {tab === 'services' ? 'خدمات' : 'طلبات'} حالياً</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: Roundness.xl, borderBottomRightRadius: Roundness.xl },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  tabs: { flexDirection: 'row', margin: Spacing.md, backgroundColor: Colors.surfaceContainer, borderRadius: Roundness.md, padding: 3 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Roundness.md - 2, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadow.card },
  tabText: { ...Typography.labelLg, color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.primary },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.md },
});
