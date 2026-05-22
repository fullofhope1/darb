import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>بحث</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن خدمة أو طلب..."
          placeholderTextColor={Colors.outline}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>جميع التصنيفات</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name="grid" size={20} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: Roundness.xl, borderBottomRightRadius: Roundness.xl },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    marginHorizontal: Spacing.md, marginTop: Spacing.md, paddingHorizontal: Spacing.md,
    borderRadius: Roundness.md, ...Shadow.card,
  },
  searchIcon: { marginLeft: Spacing.sm },
  searchInput: { flex: 1, paddingVertical: 14, ...Typography.bodyMd, textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingBottom: Spacing.xl },
  categoryCard: { width: '30%', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.sm, alignItems: 'center', ...Shadow.card, marginBottom: Spacing.sm },
  categoryIcon: { width: 48, height: 48, borderRadius: Roundness.full, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  categoryName: { ...Typography.labelSm, color: Colors.onSurface, textAlign: 'center' },
});
