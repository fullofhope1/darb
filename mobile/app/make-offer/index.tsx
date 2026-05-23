import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MakeOfferScreen() {
  const { requestId } = useLocalSearchParams();
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تقديم عرض</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.requestSummary}>
          <Text style={styles.requestLabel}>الطلب</Text>
          <Text style={styles.requestTitle}>مطلوب سباك لتركيب أدوات حمام</Text>
          <Text style={styles.requestBudget}>الميزانية: ١٠,٠٠٠ - ١٥,٠٠٠ ﷼</Text>
        </View>

        <Text style={styles.label}>سعرك *</Text>
        <TextInput style={styles.input} placeholder="٠٠٠,٠٠ ﷼" placeholderTextColor={Colors.outline} keyboardType="numeric" value={price} onChangeText={setPrice} />

        <Text style={styles.label}>مدة الإنجاز</Text>
        <TextInput style={styles.input} placeholder="مثلاً: ٣ أيام" placeholderTextColor={Colors.outline} value={duration} onChangeText={setDuration} />

        <Text style={styles.label}>وصف العرض</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="اشرح ما ستقدمه..." placeholderTextColor={Colors.outline} multiline numberOfLines={4} value={description} onChangeText={setDescription} />

        <View style={styles.escrowNote}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
          <Text style={styles.escrowText}>الدفع عبر Escrow: العميل يدفع للمنصة، وتستلم الفلوس بعد تأكيد الإنجاز</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => { Alert.alert('تم', 'تم إرسال عرضك لصاحب الطلب'); router.back(); }}>
          <Text style={styles.submitText}>إرسال العرض</Text>
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
  requestSummary: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card, marginBottom: Spacing.lg },
  requestLabel: { ...Typography.labelSm, color: Colors.outline, marginBottom: Spacing.xs },
  requestTitle: { ...Typography.bodyMd, color: Colors.onSurface },
  requestBudget: { ...Typography.labelLg, color: Colors.primary, marginTop: Spacing.xs },
  label: { ...Typography.labelLg, color: Colors.onSurface, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: { ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md, padding: 14, backgroundColor: Colors.white, textAlign: 'right' },
  textArea: { height: 100, textAlignVertical: 'top' },
  escrowNote: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.primaryLight + '15', borderRadius: Roundness.md, padding: Spacing.md, marginTop: Spacing.lg, alignItems: 'flex-start' },
  escrowText: { flex: 1, ...Typography.labelSm, color: Colors.primaryDark },
  submitBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  submitText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
