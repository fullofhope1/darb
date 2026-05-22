import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإشعارات</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>إشعارات التطبيق</Text>
            <Switch value={notifEnabled} onValueChange={setNotifEnabled} trackColor={{ true: Colors.primaryLight }} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حول</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>النسخة</Text>
            <Text style={styles.rowValue}>١.٠.٠</Text>
          </View>
        </View>
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
  section: { backgroundColor: Colors.white, borderRadius: Roundness.md, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.card },
  sectionTitle: { ...Typography.labelLg, color: Colors.onSurfaceVariant, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  rowLabel: { ...Typography.bodyMd, color: Colors.onSurface },
  rowValue: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
});
