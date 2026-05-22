import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>→ رجوع</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>طلب #{id}</Text>
        <View style={styles.statusBadge}><Text style={styles.statusText}>قيد الانتظار</Text></View>

        <Text style={styles.sectionTitle}>التفاصيل</Text>
        <Text style={styles.description}>وصف الطلب...</Text>

        <Text style={styles.sectionTitle}>العروض</Text>
        <Text style={styles.emptyText}>لا توجد عروض بعد</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  back: { padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  content: { flex: 1, padding: Spacing.md },
  title: { ...Typography.headlineMd, color: Colors.onSurface },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: Colors.warning + '20', paddingVertical: 4, paddingHorizontal: 12, borderRadius: Roundness.full, marginTop: Spacing.sm },
  statusText: { ...Typography.labelSm, color: Colors.warning },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  description: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, textAlign: 'center', padding: Spacing.lg },
});
