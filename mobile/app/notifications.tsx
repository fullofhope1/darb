import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="notifications-off-outline" size={64} color={Colors.outlineVariant} />
        <Text style={styles.emptyText}>لا توجد إشعارات</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 60 },
  backText: { ...Typography.bodyMd, color: Colors.white },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.md },
});
