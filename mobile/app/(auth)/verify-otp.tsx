import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Roundness } from '../../src/constants/theme';
import { auth } from '../../src/api/client';

export default function VerifyOtpScreen() {
  const { phone, name, password, role } = useLocalSearchParams<{ phone: string; name?: string; password?: string; role?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length < 4) { Alert.alert('تنبيه', 'يرجى إدخال رمز التحقق'); return; }
    setLoading(true);
    try {
      if (name && password) {
        const res = await auth.register({ name, phone: phone!, password, role: role || 'both' });
        await AsyncStorage.setItem('token', res.data.token);
        router.replace('/(tabs)');
      } else {
        await auth.verifyOtp(phone!, code);
        Alert.alert('تم', 'تم تأكيد رقم الجوال');
        router.back();
      }
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'رمز خاطئ');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    try { await auth.sendOtp(phone!); Alert.alert('تم', 'تم إعادة إرسال الرمز'); }
    catch { Alert.alert('خطأ', 'فشل الإرسال'); }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>→ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>تأكيد رقم الجوال</Text>
        <Text style={styles.subtitle}>أدخل الرمز المرسل إلى {phone}</Text>

        <TextInput
          style={styles.input}
          placeholder="••••"
          placeholderTextColor={Colors.outline}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleVerify} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'جاري...' : 'تأكيد'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resend}>
          <Text style={styles.link}>إعادة إرسال الرمز</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  back: { padding: Spacing.md, marginTop: 50 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center', paddingBottom: 80 },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center' },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.xl },
  input: {
    ...Typography.headlineMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Roundness.md,
    padding: 16,
    backgroundColor: Colors.surfaceContainerLow,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 12,
  },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.xl },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
  link: { ...Typography.bodyMd, color: Colors.primary, textAlign: 'center', marginTop: Spacing.md },
});
