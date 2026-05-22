import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness } from '../../src/constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>درب</Text>
          <Text style={styles.tagline}>سوق الخدمات اليمني</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>مرحباً بك في درب</Text>
        <Text style={styles.subtitle}>
          أول سوق خدمات يمني يربطك بأصحاب المهارات المعتمدين.{'\n'}بأمان وثقة وضمان
        </Text>

        <View style={styles.features}>
          <Text style={styles.feature}>✓ ٢٤ تصنيف خدمي</Text>
          <Text style={styles.feature}>✓ دفع آمن (Escrow)</Text>
          <Text style={styles.feature}>✓ ضمان الجودة</Text>
          <Text style={styles.feature}>✓ بدون عمولة أول ٦ أشهر</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>إنشاء حساب جديد</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  topSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoText: { ...Typography.displayLg, color: Colors.white, fontSize: 48 },
  tagline: { ...Typography.bodyMd, color: Colors.primaryLight, marginTop: Spacing.sm },
  bottomSection: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Roundness.xl,
    borderTopRightRadius: Roundness.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl + 20,
  },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 24 },
  features: { marginBottom: Spacing.lg },
  feature: { ...Typography.bodyMd, color: Colors.onSurface, marginBottom: Spacing.xs, paddingRight: Spacing.sm },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Roundness.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryButtonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Roundness.md,
    alignItems: 'center',
  },
  secondaryButtonText: { ...Typography.labelLg, color: Colors.primary, fontSize: 16 },
});
