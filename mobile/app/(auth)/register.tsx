import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness } from '../../src/constants/theme';
import { auth } from '../../src/api/client';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('both');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) { Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول'); return; }
    setLoading(true);
    try {
      const otpRes = await auth.sendOtp(phone);
      router.push(`/(auth)/verify-otp?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}&role=${role}`);
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'فشل الإرسال');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.title}>إنشاء حساب</Text>
          <Text style={styles.subtitle}>انضم إلى درب</Text>

          <Text style={styles.label}>الاسم</Text>
          <TextInput style={styles.input} placeholder="الاسم الكامل" placeholderTextColor={Colors.outline} value={name} onChangeText={setName} />

          <Text style={styles.label}>رقم الجوال</Text>
          <TextInput style={styles.input} placeholder="٧٧٠٠٠٠٠٠٠" placeholderTextColor={Colors.outline} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.outline} secureTextEntry value={password} onChangeText={setPassword} />

          <Text style={styles.label}>نوع الحساب</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity style={[styles.roleBtn, role === 'client' && styles.roleActive]} onPress={() => setRole('client')}>
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>صاحب عمل</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleBtn, role === 'provider' && styles.roleActive]} onPress={() => setRole('provider')}>
              <Text style={[styles.roleText, role === 'provider' && styles.roleTextActive]}>صاحب مهارة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleBtn, role === 'both' && styles.roleActive]} onPress={() => setRole('both')}>
              <Text style={[styles.roleText, role === 'both' && styles.roleTextActive]}>الاثنين</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'جاري...' : 'تسجيل'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>لديك حساب؟ تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  back: { padding: Spacing.md, marginTop: 50 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  form: { flex: 1, paddingHorizontal: Spacing.lg, paddingBottom: 60 },
  title: { ...Typography.headlineMd, color: Colors.onSurface, textAlign: 'center', marginTop: Spacing.md },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: Spacing.lg },
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
  roleRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: Roundness.md, borderWidth: 1, borderColor: Colors.outlineVariant, alignItems: 'center' },
  roleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleText: { ...Typography.labelLg, color: Colors.onSurface },
  roleTextActive: { color: Colors.white },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Roundness.md, alignItems: 'center', marginTop: Spacing.xl },
  buttonText: { ...Typography.labelLg, color: Colors.white, fontSize: 16 },
  link: { ...Typography.bodyMd, color: Colors.primary, textAlign: 'center', marginTop: Spacing.md },
});
