import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const docTypes = [
  { id: 'national', label: 'بطاقة شخصية', icon: 'card', desc: 'البطاقة الشخصية اليمنية' },
  { id: 'passport', label: 'جواز سفر', icon: 'globe', desc: 'جواز السفر ساري المفعول' },
  { id: 'license', label: 'رخصة قيادة', icon: 'car', desc: 'رخصة القيادة اليمنية' },
];

export default function VerifyIndexScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>التحقق من الهوية</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={48} color={Colors.white} />
        </View>
        <Text style={styles.title}>التحقق من الهوية</Text>
        <Text style={styles.subtitle}>اختر نوع الوثيقة للتحقق</Text>

        {docTypes.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={[styles.docCard, selected === doc.id && styles.docCardActive]}
            onPress={() => setSelected(doc.id)}
          >
            <View style={[styles.docIcon, selected === doc.id && { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name={doc.icon as any} size={28} color={selected === doc.id ? Colors.primary : Colors.outline} />
            </View>
            <View style={styles.docInfo}>
              <Text style={[styles.docLabel, selected === doc.id && { color: Colors.primary }]}>{doc.label}</Text>
              <Text style={styles.docDesc}>{doc.desc}</Text>
            </View>
            {selected === doc.id && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.button, !selected && { opacity: 0.5 }]} disabled={!selected} onPress={() => router.push('/verify/upload')}>
          <Text style={styles.buttonText}>التالي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
  title: { ...Typography.headlineMd, color: Colors.onSurface },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginBottom: Spacing.xl },
  docCard: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card, gap: Spacing.md },
  docCardActive: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white },
  docIcon: { width: 56, height: 56, borderRadius: Roundness.md, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  docInfo: { flex: 1 },
  docLabel: { ...Typography.labelLg, color: Colors.onSurface },
  docDesc: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', width: '100%', marginTop: Spacing.xl },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
