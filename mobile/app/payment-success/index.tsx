import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Roundness } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentSuccessScreen() {
  const { amount } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={56} color={Colors.white} />
        </View>

        <Text style={styles.title}>تم الدفع بنجاح!</Text>
        <Text style={styles.subtitle}>تم حجز المبلغ في حساب الأمان (Escrow)</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>رقم المعاملة</Text>
            <Text style={styles.detailValue}>#TXN-٢٠٢٦٠٥٢٣-٠٠١</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>المبلغ</Text>
            <Text style={styles.detailValue}>{amount || '١٠,٠٠٠'} ﷼</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الحالة</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>محجوز (Escrow)</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>العودة للرئيسية</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ordersBtn} onPress={() => router.replace('/(tabs)/orders')}>
          <Text style={styles.ordersBtnText}>متابعة الطلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center' },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.xl },
  detailsCard: { width: '100%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.xl },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  detailLabel: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  detailValue: { ...Typography.bodyMd, color: Colors.onSurface },
  divider: { height: 1, backgroundColor: Colors.outlineVariant },
  statusBadge: { backgroundColor: Colors.success + '20', paddingVertical: 4, paddingHorizontal: 12, borderRadius: Roundness.full },
  statusText: { ...Typography.labelSm, color: Colors.success },
  homeBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', width: '100%', marginBottom: Spacing.sm },
  homeBtnText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
  ordersBtn: { borderWidth: 1, borderColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', width: '100%' },
  ordersBtnText: { ...Typography.labelLg, color: Colors.primary, fontSize: 16 },
});
