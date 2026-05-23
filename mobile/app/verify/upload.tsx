import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyUploadScreen() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>→ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>رفع الوثيقة</Text>
        <Text style={styles.subtitle}>صور وجه البطاقة بوضوح</Text>

        <TouchableOpacity style={styles.uploadArea} onPress={() => setImage('preview')}>
          {image ? (
            <View style={styles.preview}>
              <View style={styles.previewBox}><Ionicons name="document-text" size={48} color={Colors.primary} /></View>
              <Text style={styles.previewText}>تم رفع الصورة بنجاح</Text>
            </View>
          ) : (
            <>
              <Ionicons name="camera" size={56} color={Colors.outline} />
              <Text style={styles.uploadText}>التقط صورة أو اختر من المعرض</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cameraBtn}>
                  <Ionicons name="camera" size={20} color={Colors.white} />
                  <Text style={styles.btnLabel}>تصوير</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.galleryBtn}>
                  <Ionicons name="images" size={20} color={Colors.primary} />
                  <Text style={[styles.btnLabel, { color: Colors.primary }]}>معرض</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitBtn, !image && { opacity: 0.5 }]} disabled={!image} onPress={() => router.push('/verify/pending')}>
          <Text style={styles.submitText}>رفع وتحقق</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  back: { padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  content: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  title: { ...Typography.headlineMd, color: Colors.onSurface, marginTop: Spacing.md },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginBottom: Spacing.xl },
  uploadArea: { width: '100%', height: 280, backgroundColor: Colors.white, borderRadius: Roundness.md, borderWidth: 2, borderColor: Colors.outlineVariant, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', ...Shadow.card },
  uploadText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.md, marginBottom: Spacing.lg },
  btnRow: { flexDirection: 'row', gap: Spacing.sm },
  cameraBtn: { flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: Roundness.md, gap: Spacing.xs, alignItems: 'center' },
  galleryBtn: { flexDirection: 'row', borderWidth: 1, borderColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: Roundness.md, gap: Spacing.xs, alignItems: 'center' },
  btnLabel: { ...Typography.labelSm, color: Colors.white },
  preview: { alignItems: 'center' },
  previewBox: { width: 100, height: 100, backgroundColor: Colors.primaryLight + '30', borderRadius: Roundness.md, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  previewText: { ...Typography.labelLg, color: Colors.success },
  submitBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', width: '100%', marginTop: Spacing.xl },
  submitText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
