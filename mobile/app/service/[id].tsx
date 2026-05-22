import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>اسم الخدمة</Text>
        <View style={styles.providerRow}>
          <View style={styles.providerAvatar} />
          <View>
            <Text style={styles.providerName}>مقدم الخدمة</Text>
            <Text style={styles.providerMeta}>صنعاء • ٥ تقييمات</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>١٠,٠٠٠ ﷼</Text>
          <Text style={styles.priceLabel}>السعر</Text>
        </View>

        <Text style={styles.sectionTitle}>الوصف</Text>
        <Text style={styles.description}>
          وصف تفصيلي للخدمة المقدمة مع شرح كامل لكل ما يتعلق بها.
        </Text>

        <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat/1')}>
          <Ionicons name="chatbubble" size={20} color={Colors.white} />
          <Text style={styles.chatBtnText}>تواصل مع مقدم الخدمة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.orderBtn}>
          <Text style={styles.orderBtnText}>طلب الخدمة</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  imageHeader: { height: 240, backgroundColor: Colors.surfaceContainerHighest, justifyContent: 'flex-start', paddingTop: 50, paddingRight: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: Roundness.full, backgroundColor: Colors.black + '40', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: Spacing.md },
  title: { ...Typography.headlineMd, color: Colors.onSurface },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md },
  providerAvatar: { width: 44, height: 44, borderRadius: Roundness.full, backgroundColor: Colors.surfaceContainerHigh },
  providerName: { ...Typography.labelLg, color: Colors.onSurface },
  providerMeta: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, marginTop: Spacing.lg, paddingVertical: Spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.outlineVariant },
  price: { ...Typography.headlineMd, color: Colors.primary },
  priceLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  description: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, lineHeight: 24 },
  chatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.secondary, paddingVertical: 14, borderRadius: Roundness.md, marginTop: Spacing.lg },
  chatBtnText: { ...Typography.labelLg, color: Colors.white },
  orderBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  orderBtnText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
