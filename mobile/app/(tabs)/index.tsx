import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>مرحباً بك في</Text>
        <Text style={styles.logo}>درب</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.searchPlaceholder}>ابحث عن خدمة...</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>التصنيفات</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Text style={[styles.categoryEmoji, { color: cat.color }]}>
                  {String.fromCodePoint(0x1F4A1)}
                </Text>
              </View>
              <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.seeAllText}>عرض الكل ←</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>خدمات مميزة</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {[1, 2, 3, 4].map((i) => (
            <TouchableOpacity key={i} style={styles.featuredCard}>
              <View style={styles.featuredImage} />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>خدمة {i}</Text>
                <Text style={styles.featuredProvider}>مقدم الخدمة</Text>
                <Text style={styles.featuredPrice}>١٠,٠٠٠ ﷼</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>أحدث الطلبات</Text>
        {[1, 2, 3].map((i) => (
          <TouchableOpacity key={i} style={styles.requestCard}>
            <Text style={styles.requestTitle}>طلب {i}</Text>
            <Text style={styles.requestDesc}>وصف الطلب هنا...</Text>
            <View style={styles.requestMeta}>
              <Text style={styles.requestMetaText}>المدينة: صنعاء</Text>
              <Text style={styles.requestPrice}>٥,٠٠٠ ﷼</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: Roundness.xl, borderBottomRightRadius: Roundness.xl },
  greeting: { ...Typography.bodyMd, color: Colors.primaryLight },
  logo: { ...Typography.displayLg, color: Colors.white, fontSize: 36 },
  scroll: { flex: 1, paddingHorizontal: Spacing.md },
  searchBar: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: Roundness.md,
    marginTop: Spacing.md,
    ...Shadow.card,
  },
  searchPlaceholder: { ...Typography.bodyMd, color: Colors.outline },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryCard: { width: '23%', alignItems: 'center', marginBottom: Spacing.md },
  categoryIcon: { width: 56, height: 56, borderRadius: Roundness.full, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  categoryEmoji: { fontSize: 24 },
  categoryName: { ...Typography.labelSm, color: Colors.onSurface, textAlign: 'center' },
  seeAll: { alignSelf: 'flex-end', marginBottom: Spacing.sm },
  seeAllText: { ...Typography.labelLg, color: Colors.primary },
  horizontalScroll: { marginBottom: Spacing.sm },
  featuredCard: { width: 200, backgroundColor: Colors.white, borderRadius: Roundness.md, marginRight: Spacing.sm, ...Shadow.card, overflow: 'hidden' },
  featuredImage: { height: 100, backgroundColor: Colors.surfaceContainerHighest },
  featuredContent: { padding: Spacing.sm },
  featuredTitle: { ...Typography.labelLg, color: Colors.onSurface },
  featuredProvider: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  featuredPrice: { ...Typography.labelLg, color: Colors.primary, marginTop: Spacing.xs },
  requestCard: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  requestTitle: { ...Typography.labelLg, color: Colors.onSurface },
  requestDesc: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: Spacing.xs },
  requestMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  requestMetaText: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  requestPrice: { ...Typography.labelLg, color: Colors.primary },
});
