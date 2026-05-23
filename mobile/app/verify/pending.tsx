import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyPendingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="time" size={56} color={Colors.primary} />
        </View>
        <Text style={styles.title}>قيد التحقق</Text>
        <Text style={styles.subtitle}>
          تم استلام وثائقك بنجاح.{'\n'}
          سيتم مراجعتها من قبل فريق التدقيق.{'\n'}
          سنقوم بإشعارك عند اكتمال التحقق.
        </Text>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={Colors.info} />
          <Text style={styles.infoText}>عادةً ما يستغرق التحقق من ٢٤-٤٨ ساعة</Text>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>العودة للرئيسية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primaryLight + '30', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  title: { ...Typography.headlineMd, color: Colors.onSurface, marginBottom: Spacing.sm },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 26, marginBottom: Spacing.xl },
  infoCard: { flexDirection: 'row', backgroundColor: Colors.info + '15', borderRadius: Roundness.md, padding: Spacing.md, gap: Spacing.sm, alignItems: 'center', width: '100%', marginBottom: Spacing.xl },
  infoText: { flex: 1, ...Typography.labelSm, color: Colors.info },
  homeBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', width: '100%' },
  homeBtnText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
