import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';

export default function AdminSettingsScreen() {
  const [platformFee, setPlatformFee] = useState('١٥');
  const [supportPhone, setSupportPhone] = useState('٨٠٠٠٠٠٠');
  const [supportEmail, setSupportEmail] = useState('support@darb.app');

  const handleSave = () => {
    Alert.alert('تم', 'تم حفظ الإعدادات');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إعدادات النظام</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>العمولة</Text>
          <Text style={styles.label}>نسبة المنصة (%)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={platformFee} onChangeText={setPlatformFee} />
          <Text style={styles.hint}>النسبة الحالية: ١٥٪ (أول ٦ أشهر مجاناً)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
          <Text style={styles.label}>رقم الدعم</Text>
          <TextInput style={styles.input} keyboardType="phone-pad" value={supportPhone} onChangeText={setSupportPhone} />
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput style={styles.input} keyboardType="email-address" value={supportEmail} onChangeText={setSupportEmail} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طرق الدفع</Text>
          {['كريمي', 'جيب', 'ون كاش', 'جوالي', 'محفظة درب'].map((m, i) => (
            <View key={i} style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{m}</Text>
              <View style={[styles.paymentStatus, { backgroundColor: Colors.success + '20' }]}>
                <Text style={styles.paymentStatusText}>مفعل</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>حفظ الإعدادات</Text>
        </TouchableOpacity>
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
  section: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.card },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  label: { ...Typography.labelLg, color: Colors.onSurface, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  input: { ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md, padding: 12, backgroundColor: Colors.surfaceContainerLow, textAlign: 'right' },
  hint: { ...Typography.labelSm, color: Colors.outline, marginTop: Spacing.xs },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHighest },
  paymentLabel: { ...Typography.bodyMd, color: Colors.onSurface },
  paymentStatus: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: Roundness.full },
  paymentStatusText: { ...Typography.labelSm, color: Colors.success },
  saveBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginVertical: Spacing.md },
  saveBtnText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
