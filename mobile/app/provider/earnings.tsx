import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const periods = ['يومي', 'أسبوعي', 'شهري', 'سنوي'] as const;
type Period = typeof periods[number];

const chartData: Record<Period, { label: string; value: number }[]> = {
  يومي: [
    { label: 'س', value: 12000 }, { label: 'ح', value: 8000 }, { label: 'ن', value: 15000 },
    { label: 'ث', value: 10000 }, { label: 'ر', value: 20000 }, { label: 'خ', value: 6000 },
    { label: 'ج', value: 18000 },
  ],
  أسبوعي: [
    { label: 'الأسبوع ١', value: 45000 }, { label: 'الأسبوع ٢', value: 52000 },
    { label: 'الأسبوع ٣', value: 38000 }, { label: 'الأسبوع ٤', value: 61000 },
  ],
  شهري: [
    { label: 'يناير', value: 120000 }, { label: 'فبراير', value: 98000 },
    { label: 'مارس', value: 145000 }, { label: 'أبريل', value: 167000 },
    { label: 'مايو', value: 234000 },
  ],
  سنوي: [{ label: '٢٠٢٤', value: 890000 }, { label: '٢٠٢٥', value: 1200000 }, { label: '٢٠٢٦', value: 580000 }],
};

export default function EarningsScreen() {
  const [period, setPeriod] = useState<Period>('شهري');
  const data = chartData[period];
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الأرباح</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>إجمالي الأرباح</Text>
          <Text style={styles.summaryValue}>٢٣٤,٠٠٠ ﷼</Text>
          <Text style={styles.summaryChange}>↑ ٢٢٪ نمو</Text>
        </View>

        <View style={styles.periodRow}>
          {periods.map((p) => (
            <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodActive]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          {data.map((d, i) => (
            <View key={i} style={styles.barColumn}>
              <Text style={styles.barValue}>{(d.value / 1000).toFixed(0)}k</Text>
              <View style={[styles.bar, { height: (d.value / maxVal) * 160 }]} />
              <Text style={styles.barLabel}>{d.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>٤٧</Text>
            <Text style={styles.statLabel}>إجمالي الخدمات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>٤.٨</Text>
            <Text style={styles.statLabel}>متوسط التقييم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>٩٨٪</Text>
            <Text style={styles.statLabel}>نسبة الرضا</Text>
          </View>
        </View>
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
  summaryCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.lg, ...Shadow.card, marginBottom: Spacing.md },
  summaryLabel: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  summaryValue: { ...Typography.displayLg, color: Colors.primary },
  summaryChange: { ...Typography.labelSm, color: Colors.success },
  periodRow: { flexDirection: 'row', backgroundColor: Colors.surfaceContainer, borderRadius: Roundness.md, padding: 3, marginBottom: Spacing.md },
  periodBtn: { flex: 1, paddingVertical: 8, borderRadius: Roundness.md - 2, alignItems: 'center' },
  periodActive: { backgroundColor: Colors.white, ...Shadow.card },
  periodText: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  periodTextActive: { color: Colors.primary },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, height: 240, ...Shadow.card, marginBottom: Spacing.md },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { ...Typography.labelSm, color: Colors.onSurfaceVariant, marginBottom: 4 },
  bar: { width: 24, backgroundColor: Colors.primary, borderRadius: 4, minHeight: 4 },
  barLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, alignItems: 'center', ...Shadow.card },
  statValue: { ...Typography.headlineSm, color: Colors.primary },
  statLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, textAlign: 'center' },
});
