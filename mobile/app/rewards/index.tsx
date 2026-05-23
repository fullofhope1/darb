import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const rewards = [
  { name: 'خصم ١٠٪', points: 500, icon: 'pricetag', color: '#1565C0' },
  { name: 'ترقية الخدمة', points: 1000, icon: 'trending-up', color: '#2e7d32' },
  { name: 'Boost أسبوع', points: 2000, icon: 'flash', color: '#F9A825' },
  { name: 'شحن محفظة ١٠٠٠﷼', points: 3000, icon: 'wallet', color: '#6A1B9A' },
];

const history = [
  { action: 'تسجيل حساب', points: '+١٠٠', date: 'منذ ٣ أيام' },
  { action: 'إتمام خدمة #١٠٢٤', points: '+٥٠', date: 'منذ أسبوع' },
  { action: 'تقييم خدمة', points: '+٢٠', date: 'منذ أسبوع' },
  { action: 'صرف خصم ١٠٪', points: '-٥٠٠', date: 'منذ شهر' },
];

export default function RewardsScreen() {
  const [tab, setTab] = useState<'rewards' | 'history'>('rewards');
  const totalPoints = 1250;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Darb Rewards</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.pointsCard}>
        <Ionicons name="star" size={32} color={Colors.gold} />
        <Text style={styles.pointsValue}>{totalPoints}</Text>
        <Text style={styles.pointsLabel}>نقطة ولاء</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>الفضية</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'rewards' && styles.tabActive]} onPress={() => setTab('rewards')}>
          <Text style={[styles.tabText, tab === 'rewards' && styles.tabTextActive]}>المكافآت</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'history' && styles.tabActive]} onPress={() => setTab('history')}>
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>السجل</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {tab === 'rewards' ? (
          <>
            <Text style={styles.sectionTitle}>استبدل نقاطك</Text>
            {rewards.map((r, i) => (
              <TouchableOpacity key={i} style={styles.rewardCard} onPress={() => Alert.alert('تم', `تم استبدال ${r.name}`)}>
                <View style={[styles.rewardIcon, { backgroundColor: r.color + '20' }]}>
                  <Ionicons name={r.icon as any} size={24} color={r.color} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName}>{r.name}</Text>
                  <Text style={styles.rewardPoints}>{r.points} نقطة</Text>
                </View>
                <TouchableOpacity style={[styles.redeemBtn, totalPoints < r.points && { opacity: 0.4 }]} disabled={totalPoints < r.points}>
                  <Text style={styles.redeemText}>استبدال</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>كيف تربح النقاط؟</Text>
            <View style={styles.howItWorks}>
              <Text style={styles.howText}>✓ تسجيل حساب: +١٠٠ نقطة</Text>
              <Text style={styles.howText}>✓ إتمام خدمة: +٥٠ نقطة</Text>
              <Text style={styles.howText}>✓ تقييم خدمة: +٢٠ نقطة</Text>
              <Text style={styles.howText}>✓ دعوة صديق: +٢٠٠ نقطة</Text>
            </View>
          </>
        ) : (
          history.map((h, i) => (
            <View key={i} style={styles.historyCard}>
              <Text style={styles.historyAction}>{h.action}</Text>
              <View style={styles.historyRight}>
                <Text style={[styles.historyPoints, { color: h.points.startsWith('+') ? Colors.success : Colors.error }]}>{h.points}</Text>
                <Text style={styles.historyDate}>{h.date}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  pointsCard: { backgroundColor: Colors.primaryDark, margin: Spacing.md, padding: Spacing.xl, borderRadius: Roundness.md, alignItems: 'center', ...Shadow.elevated },
  pointsValue: { ...Typography.displayLg, color: Colors.gold, marginTop: Spacing.sm },
  pointsLabel: { ...Typography.bodyMd, color: Colors.primaryLight },
  levelBadge: { backgroundColor: Colors.gold + '30', paddingVertical: 4, paddingHorizontal: 16, borderRadius: Roundness.full, marginTop: Spacing.sm },
  levelText: { ...Typography.labelSm, color: Colors.gold },
  tabs: { flexDirection: 'row', marginHorizontal: Spacing.md, backgroundColor: Colors.surfaceContainer, borderRadius: Roundness.md, padding: 3, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Roundness.md - 2, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadow.card },
  tabText: { ...Typography.labelLg, color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.primary },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.sm },
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card, gap: Spacing.md },
  rewardIcon: { width: 48, height: 48, borderRadius: Roundness.md, justifyContent: 'center', alignItems: 'center' },
  rewardInfo: { flex: 1 },
  rewardName: { ...Typography.labelLg, color: Colors.onSurface },
  rewardPoints: { ...Typography.labelSm, color: Colors.outline },
  redeemBtn: { backgroundColor: Colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: Roundness.full },
  redeemText: { ...Typography.labelSm, color: Colors.white },
  howItWorks: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, ...Shadow.card, marginBottom: Spacing.xl },
  howText: { ...Typography.bodyMd, color: Colors.onSurface, marginBottom: Spacing.xs },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  historyAction: { ...Typography.bodyMd, color: Colors.onSurface },
  historyRight: { alignItems: 'flex-end' },
  historyPoints: { ...Typography.labelLg },
  historyDate: { ...Typography.labelSm, color: Colors.outline },
});
