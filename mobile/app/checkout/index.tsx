import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const paymentMethods = [
  { id: 'wallet', label: 'محفظة درب', icon: 'wallet' },
  { id: 'karimi', label: 'كريمي', icon: 'phone-portrait' },
  { id: 'jeeb', label: 'جيب', icon: 'phone-portrait' },
  { id: 'onecash', label: 'ون كاش', icon: 'cash' },
  { id: 'jawali', label: 'جوالي', icon: 'cellular' },
];

export default function CheckoutScreen() {
  const { serviceId } = useLocalSearchParams();
  const [method, setMethod] = useState('wallet');

  const handlePay = () => {
    Alert.alert('تم', 'تم تأكيد الدفع. المبلغ محجوز في حساب الأمان (Escrow) حتى اكتمال الخدمة.');
    router.push('/wallet');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الدفع</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ملخص الطلب</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>اسم الخدمة</Text>
            <Text style={styles.summaryValue}>تركيب مكيف سبلت</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>مقدم الخدمة</Text>
            <Text style={styles.summaryValue}>أحمد محمد</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>المبلغ</Text>
            <Text style={styles.totalValue}>١٠,٠٠٠ ﷼</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>ضمان المنصة</Text>
            <Text style={styles.totalValue}>مجاناً</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>الإجمالي</Text>
            <Text style={styles.grandTotalValue}>١٠,٠٠٠ ﷼</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        {paymentMethods.map((pm) => (
          <TouchableOpacity
            key={pm.id}
            style={[styles.paymentMethod, method === pm.id && styles.paymentMethodActive]}
            onPress={() => setMethod(pm.id)}
          >
            <Ionicons name={pm.icon as any} size={22} color={method === pm.id ? Colors.primary : Colors.onSurfaceVariant} />
            <Text style={[styles.paymentLabel, method === pm.id && { color: Colors.primary }]}>{pm.label}</Text>
            {method === pm.id && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
          </TouchableOpacity>
        ))}

        <View style={styles.escrowNote}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <Text style={styles.escrowText}>الدفع عبر نظام Escrow: المبلغ محجوز لحين تأكيد استلام الخدمة</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>تأكيد الدفع - ١٠,٠٠٠ ﷼</Text>
        </TouchableOpacity>
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
  summaryCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card, marginBottom: Spacing.md },
  summaryTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  summaryLabel: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  summaryValue: { ...Typography.bodyMd, color: Colors.onSurface },
  divider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: Spacing.sm },
  totalLabel: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  totalValue: { ...Typography.bodyMd, color: Colors.onSurface },
  grandTotalLabel: { ...Typography.labelLg, color: Colors.onSurface },
  grandTotalValue: { ...Typography.labelLg, color: Colors.primary, fontSize: 18 },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  paymentMethod: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card, gap: Spacing.sm,
  },
  paymentMethodActive: { borderWidth: 2, borderColor: Colors.primary },
  paymentLabel: { flex: 1, ...Typography.bodyMd, color: Colors.onSurface },
  escrowNote: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.primaryLight + '20', borderRadius: Roundness.md, padding: Spacing.md, marginTop: Spacing.md, alignItems: 'flex-start' },
  escrowText: { flex: 1, ...Typography.labelSm, color: Colors.primaryDark },
  payButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  payButtonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
