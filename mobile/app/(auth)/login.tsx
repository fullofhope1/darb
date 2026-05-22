import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { auth } from '../../src/api/client';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) { Alert.alert('تنبيه', 'يرجى إدخال رقم الجوال وكلمة المرور'); return; }
    setLoading(true);
    try {
      const res = await auth.login({ phone, password });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'فشل تسجيل الدخول');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>→ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>أهلاً بعودتك</Text>

        <Text style={styles.label}>رقم الجوال</Text>
        <TextInput
          style={styles.input}
          placeholder="٧٧٠٠٠٠٠٠٠"
          placeholderTextColor={Colors.outline}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={Colors.outline}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>ليس لديك حساب؟ إنشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  back: { padding: Spacing.md, marginTop: 50 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  form: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center', paddingBottom: 60 },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center' },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.xl },
  label: { ...Typography.labelLg, color: Colors.onSurface, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: {
    ...Typography.bodyMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Roundness.md,
    padding: 14,
    backgroundColor: Colors.surfaceContainerLow,
    textAlign: 'right',
  },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.xl },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
  link: { ...Typography.bodyMd, color: Colors.primary, textAlign: 'center', marginTop: Spacing.md },
});
