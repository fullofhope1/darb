import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const users = [
  { name: 'أحمد محمد', phone: '٧٧١٢٣٤٥٦', email: 'ahmed@mail.com', role: 'مقدم خدمة', date: '٢٠٢٦-٠٥-٢٠', status: 'نشط' },
  { name: 'خالد علي', phone: '٧٧٩٨٧٦٥٤', email: 'khalid@mail.com', role: 'صاحب عمل', date: '٢٠٢٦-٠٥-١٨', status: 'نشط' },
  { name: 'سامي حسن', phone: '٧٧٣٢١٤٥٨', email: 'sami@mail.com', role: 'الاثنين', date: '٢٠٢٦-٠٥-١٥', status: 'موقوف' },
  { name: 'علي عمر', phone: '٧٧٥٥٦٦٧٧', email: 'ali@mail.com', role: 'مقدم خدمة', date: '٢٠٢٦-٠٥-١٠', status: 'نشط' },
];

export default function AdminUsersScreen() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.includes(search) || u.phone.includes(search));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>→ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.outline} />
        <TextInput style={styles.searchInput} placeholder="بحث عن مستخدم..." placeholderTextColor={Colors.outline} value={search} onChangeText={setSearch} />
      </View>

      <ScrollView style={styles.list}>
        {filtered.map((u, i) => (
          <View key={i} style={styles.userCard}>
            <View style={styles.userAvatar}><Text style={styles.avatarText}>{u.name[0]}</Text></View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userPhone}>{u.phone}</Text>
              <Text style={styles.userMeta}>{u.role} • {u.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: u.status === 'نشط' ? Colors.success + '20' : Colors.error + '20' }]}>
              <Text style={[styles.statusText, { color: u.status === 'نشط' ? Colors.success : Colors.error }]}>{u.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  back: { padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.primary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: Roundness.md, ...Shadow.card, marginBottom: Spacing.md },
  searchInput: { flex: 1, paddingVertical: 12, ...Typography.bodyMd, textAlign: 'right', marginRight: Spacing.sm },
  list: { flex: 1, paddingHorizontal: Spacing.md },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  userAvatar: { width: 44, height: 44, borderRadius: Roundness.full, backgroundColor: Colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.labelLg, color: Colors.white },
  userInfo: { flex: 1, marginHorizontal: Spacing.sm },
  userName: { ...Typography.labelLg, color: Colors.onSurface },
  userPhone: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  userMeta: { ...Typography.labelSm, color: Colors.outline, marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: Roundness.full },
  statusText: { ...Typography.labelSm },
});
