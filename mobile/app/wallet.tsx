import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>المحفظة</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>الرصيد الحالي</Text>
          <Text style={styles.balanceAmount}>٠ ﷼</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="add-circle" size={24} color={Colors.white} />
            <Text style={styles.actionText}>إيداع</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="cash" size={24} color={Colors.white} />
            <Text style={styles.actionText}>سحب</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.white} />
            <Text style={styles.actionText}>تحويل</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>آخر المعاملات</Text>
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={Colors.outlineVariant} />
          <Text style={styles.emptyText}>لا توجد معاملات</Text>
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
  balanceCard: { backgroundColor: Colors.primary, borderRadius: Roundness.md, padding: Spacing.xl, alignItems: 'center', ...Shadow.elevated },
  balanceLabel: { ...Typography.bodyMd, color: Colors.primaryLight },
  balanceAmount: { ...Typography.displayLg, color: Colors.white, marginTop: Spacing.sm },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  actionBtn: { flex: 1, backgroundColor: Colors.primaryDark, borderRadius: Roundness.md, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs },
  actionText: { ...Typography.labelSm, color: Colors.white },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  emptyState: { alignItems: 'center', padding: Spacing.xl },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.sm },
});
