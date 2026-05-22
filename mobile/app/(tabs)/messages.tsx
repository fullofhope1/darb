import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المحادثات</Text>
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="chatbubbles-outline" size={64} color={Colors.outlineVariant} />
        <Text style={styles.emptyText}>لا توجد محادثات</Text>
        <Text style={styles.emptySubtext}>عندما تتواصل مع مزود خدمة، ستظهر المحادثات هنا</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: Roundness.xl, borderBottomRightRadius: Roundness.xl },
  headerTitle: { ...Typography.headlineMd, color: Colors.white },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyText: { ...Typography.headlineSm, color: Colors.outline, marginTop: Spacing.md },
  emptySubtext: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: Spacing.sm },
});
