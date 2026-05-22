import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';
import { Ionicons } from '@expo/vector-icons';

export default function AdminCategoriesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>التصنيفات</Text>
        <TouchableOpacity onPress={() => Alert.alert('جديد', 'نافذة إضافة تصنيف')}>
          <Ionicons name="add-circle" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <View style={[styles.icon, { backgroundColor: cat.color + '20' }]}>
              <Ionicons name="grid" size={20} color={cat.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{cat.name}</Text>
              <Text style={styles.meta}>ترتيب: {cat.id}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  list: { flex: 1, padding: Spacing.md },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  icon: { width: 40, height: 40, borderRadius: Roundness.md, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginHorizontal: Spacing.sm },
  name: { ...Typography.labelLg, color: Colors.onSurface },
  meta: { ...Typography.labelSm, color: Colors.outline },
  editBtn: { padding: Spacing.sm },
  deleteBtn: { padding: Spacing.sm },
});
