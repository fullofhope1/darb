import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const reviews = [
  { name: 'محمد علي', rating: 5, date: 'منذ ٣ أيام', comment: 'خدمة ممتازة وسريع في الإنجاز. تعامل محترف وأنصح بالتعامل معه.', avatar: 'م' },
  { name: 'خالد أحمد', rating: 4, date: 'منذ أسبوع', comment: 'شغل نظيف وممتاز. الالتزام بالمواعيد يحتاج تحسين بسيط.', avatar: 'خ' },
  { name: 'سامي حسن', rating: 5, date: 'منذ أسبوعين', comment: 'أفضل مقدم خدمة في صنعاء. سعره مناسب وجودته عالية.', avatar: 'س' },
  { name: 'علي عمر', rating: 3, date: 'منذ شهر', comment: 'الخدمة مقبولة ولكن كان في تأخير.', avatar: 'ع' },
];

const distribution = [15, 8, 3, 1, 0];

export default function ProviderReviewsScreen() {
  const total = distribution.reduce((a, b) => a + b, 0);
  const avg = (5 * distribution[0] + 4 * distribution[1] + 3 * distribution[2] + 2 * distribution[3] + distribution[4]) / total;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>→ رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>التقييمات</Text>
          <View style={{ width: 60 }} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.avgRating}>{avg.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name="star" size={18} color={s <= Math.round(avg) ? Colors.star : Colors.outlineVariant} />)}
          </View>
          <Text style={styles.totalLabel}>{total} تقييم</Text>
        </View>

        <View style={styles.distributionCard}>
          {[5, 4, 3, 2, 1].map((star, i) => (
            <View key={star} style={styles.distRow}>
              <Text style={styles.distStar}>{star}</Text>
              <Ionicons name="star" size={14} color={Colors.star} />
              <View style={styles.distBar}>
                <View style={[styles.distFill, { width: `${(distribution[i] / total) * 100}%` }]} />
              </View>
              <Text style={styles.distCount}>{distribution[i]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>أحدث التقييمات</Text>
        {reviews.map((r, i) => (
          <View key={i} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}><Text style={styles.avatarText}>{r.avatar}</Text></View>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name="star" size={12} color={s <= r.rating ? Colors.star : Colors.outlineVariant} />)}
              </View>
            </View>
            <Text style={styles.reviewComment}>{r.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, paddingTop: 60 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, padding: Spacing.md },
  summaryCard: { alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.white, borderRadius: Roundness.md, ...Shadow.card, marginBottom: Spacing.md },
  avgRating: { ...Typography.displayLg, color: Colors.onSurface, fontSize: 48 },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: Spacing.xs },
  totalLabel: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  distributionCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card, marginBottom: Spacing.md },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  distStar: { ...Typography.labelSm, color: Colors.onSurface, width: 12 },
  distBar: { flex: 1, height: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 4 },
  distFill: { height: 8, backgroundColor: Colors.star, borderRadius: 4 },
  distCount: { ...Typography.labelSm, color: Colors.onSurface, width: 20, textAlign: 'center' },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  reviewCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card, marginBottom: Spacing.sm },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.labelLg, color: Colors.white },
  reviewInfo: { flex: 1 },
  reviewName: { ...Typography.labelLg, color: Colors.onSurface },
  reviewDate: { ...Typography.labelSm, color: Colors.outline },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewComment: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
});
