import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';

export default function AddServiceScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [city, setCity] = useState('');

  const handleSubmit = () => {
    if (!title || !price || !categoryId) { Alert.alert('تنبيه', 'يرجى تعبئة الحقول المطلوبة'); return; }
    Alert.alert('تم', 'تم إضافة الخدمة بنجاح');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إضافة خدمة</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>اسم الخدمة *</Text>
        <TextInput style={styles.input} placeholder="مثلاً: تركيب مكيف سبلت" placeholderTextColor={Colors.outline} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>الوصف</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="اشرح الخدمة بالتفصيل..." placeholderTextColor={Colors.outline} multiline numberOfLines={4} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>السعر *</Text>
        <TextInput style={styles.input} placeholder="٠٠٠,٠٠ ﷼" placeholderTextColor={Colors.outline} keyboardType="numeric" value={price} onChangeText={setPrice} />

        <Text style={styles.label}>المدينة</Text>
        <TextInput style={styles.input} placeholder="صنعاء" placeholderTextColor={Colors.outline} value={city} onChangeText={setCity} />

        <Text style={styles.label}>التصنيف *</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.slice(0, 12).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, categoryId === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text style={[styles.categoryText, categoryId === cat.id && { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>نشر الخدمة</Text>
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
  content: { flex: 1, padding: Spacing.md },
  label: { ...Typography.labelLg, color: Colors.onSurface, marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: {
    ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md,
    padding: 14, backgroundColor: Colors.white, textAlign: 'right',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  categoryChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Roundness.full, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.white },
  categoryText: { ...Typography.labelSm, color: Colors.onSurface },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xl },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
