import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const reasons = [
  'خدمة غير مكتملة',
  'جودة سيئة',
  'تأخير في التسليم',
  'اختلاف عن الوصف',
  'عدم استجابة',
  'احتيال',
];

export default function DisputeScreen() {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>رفع نزاع</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={Colors.error} />
          <Text style={styles.warningText}>يتم رفع النزاع إلى فريق الوساطة لحل المشكلة بين الطرفين</Text>
        </View>

        <Text style={styles.label}>سبب النزاع</Text>
        <View style={styles.reasonsGrid}>
          {reasons.map((r) => (
            <TouchableOpacity key={r} style={[styles.reasonChip, reason === r && styles.reasonActive]} onPress={() => setReason(r)}>
              <Text style={[styles.reasonText, reason === r && styles.reasonTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>الوصف التفصيلي</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="اشرح تفاصيل المشكلة..." placeholderTextColor={Colors.outline} multiline numberOfLines={5} value={description} onChangeText={setDescription} />

        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="attach" size={20} color={Colors.primary} />
          <Text style={styles.attachText}>إرفاق صور أو مستندات</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={() => { Alert.alert('تم', 'تم رفع النزاع. سيتم التواصل معك خلال ٢٤ ساعة'); router.back(); }}>
          <Text style={styles.submitText}>رفع نزاع</Text>
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
  warningCard: { flexDirection: 'row', backgroundColor: Colors.errorContainer, borderRadius: Roundness.md, padding: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.md, alignItems: 'flex-start' },
  warningText: { flex: 1, ...Typography.labelSm, color: Colors.onErrorContainer },
  label: { ...Typography.labelLg, color: Colors.onSurface, marginBottom: Spacing.sm },
  reasonsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  reasonChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: Roundness.full, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.white },
  reasonActive: { backgroundColor: Colors.error + '15', borderColor: Colors.error },
  reasonText: { ...Typography.labelSm, color: Colors.onSurface },
  reasonTextActive: { color: Colors.error },
  input: { ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md, padding: 14, backgroundColor: Colors.white, textAlign: 'right', marginBottom: Spacing.md },
  textArea: { height: 120, textAlignVertical: 'top' },
  attachBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, marginBottom: Spacing.lg },
  attachText: { ...Typography.bodyMd, color: Colors.primary },
  submitBtn: { backgroundColor: Colors.error, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginBottom: Spacing.xl },
  submitText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
