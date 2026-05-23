import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';
import { Ionicons } from '@expo/vector-icons';

const cities = ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'المكلا', 'إب', 'ذمار', 'حضرموت'];
const sortOptions = ['الأحدث', 'الأقل سعراً', 'الأعلى تقييماً', 'الأكثر طلباً'];

export default function FilterScreen() {
  const [selectedCat, setSelectedCat] = useState<number[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sort, setSort] = useState('الأحدث');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const toggleCat = (id: number) => setSelectedCat(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>فلتر وترتيب</Text>
        <TouchableOpacity onPress={() => { setSelectedCat([]); setSelectedCity(''); setMinPrice(''); setMaxPrice(''); }}>
          <Text style={styles.resetText}>إعادة</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>الترتيب</Text>
        <View style={styles.sortRow}>
          {sortOptions.map(s => (
            <TouchableOpacity key={s} style={[styles.sortChip, sort === s && styles.sortActive]} onPress={() => setSort(s)}>
              <Text style={[styles.sortText, sort === s && styles.sortTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>التصنيف</Text>
        <View style={styles.catRow}>
          {CATEGORIES.slice(0, 12).map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catChip, selectedCat.includes(cat.id) && { backgroundColor: cat.color + '20', borderColor: cat.color }]} onPress={() => toggleCat(cat.id)}>
              <Text style={[styles.catText, selectedCat.includes(cat.id) && { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>المدينة</Text>
        <View style={styles.catRow}>
          {cities.map(c => (
            <TouchableOpacity key={c} style={[styles.catChip, selectedCity === c && styles.sortActive]} onPress={() => setSelectedCity(selectedCity === c ? '' : c)}>
              <Text style={[styles.catText, selectedCity === c && styles.sortTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>نطاق السعر</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceInput}>
            <Text style={styles.priceLabel}>من</Text>
            <TouchableOpacity style={styles.priceField}>
              <Text style={styles.pricePlaceholder}>٠ ﷼</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.priceDash}>-</Text>
          <View style={styles.priceInput}>
            <Text style={styles.priceLabel}>إلى</Text>
            <TouchableOpacity style={styles.priceField}>
              <Text style={styles.pricePlaceholder}>أقصى سعر</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.applyBtn} onPress={() => { Alert.alert('تم', 'تم تطبيق الفلتر'); router.back(); }}>
          <Text style={styles.applyText}>تطبيق الفلتر</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  resetText: { ...Typography.bodyMd, color: Colors.primaryLight },
  content: { flex: 1, padding: Spacing.md },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sortRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  sortChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Roundness.full, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.white },
  sortActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sortText: { ...Typography.labelSm, color: Colors.onSurface },
  sortTextActive: { color: Colors.white },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Roundness.full, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.white },
  catText: { ...Typography.labelSm, color: Colors.onSurface },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  priceInput: { flex: 1 },
  priceLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, marginBottom: Spacing.xs },
  priceField: { borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md, padding: 12, backgroundColor: Colors.white },
  pricePlaceholder: { ...Typography.bodyMd, color: Colors.outline },
  priceDash: { marginTop: Spacing.lg },
  applyBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xl },
  applyText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
