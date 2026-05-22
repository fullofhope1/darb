import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewScreen() {
  const { serviceId, providerId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) { Alert.alert('تنبيه', 'يرجى اختيار تقييم'); return; }
    Alert.alert('شكراً لك', 'تم إرسال تقييمك بنجاح');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تقييم</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>كيف كانت الخدمة؟</Text>
        <Text style={styles.subtitle}>قم بتقييم الخدمة التي حصلت عليها</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={48}
                color={star <= rating ? Colors.star : Colors.outlineVariant}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingText}>
          {rating === 0 ? 'اختر تقييمك' : rating === 1 ? 'سيء' : rating === 2 ? 'مقبول' : rating === 3 ? 'جيد' : rating === 4 ? 'جيد جداً' : 'ممتاز'}
        </Text>

        <Text style={styles.label}>التعليق (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="شارك تجربتك مع هذه الخدمة..."
          placeholderTextColor={Colors.outline}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="star" size={20} color={Colors.white} />
          <Text style={styles.buttonText}>إرسال التقييم</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  content: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center', marginTop: Spacing.lg },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.xl },
  starsContainer: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  ratingText: { ...Typography.headlineSm, color: Colors.star, marginBottom: Spacing.lg },
  label: { ...Typography.labelLg, color: Colors.onSurface, alignSelf: 'flex-start', marginBottom: Spacing.xs },
  input: {
    ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.md,
    padding: 14, backgroundColor: Colors.white, textAlign: 'right', width: '100%', height: 100, textAlignVertical: 'top',
  },
  button: { flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl, width: '100%', gap: Spacing.sm },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
});
