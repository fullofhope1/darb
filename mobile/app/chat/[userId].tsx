import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Typography, Spacing, Roundness, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>مقدم الخدمة</Text>
          <Text style={styles.headerStatus}>متصل</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Text style={styles.avatarText}>م</Text>
        </View>
      </View>

      <FlatList style={styles.messages} contentContainerStyle={{ padding: Spacing.md }} data={[]} renderItem={() => null} ListEmptyComponent={
        <Text style={styles.emptyText}>لا توجد رسائل بعد. ابدأ المحادثة!</Text>
      } />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالة..."
          placeholderTextColor={Colors.outline}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingTop: 50, gap: Spacing.sm },
  headerInfo: { flex: 1 },
  headerName: { ...Typography.labelLg, color: Colors.white },
  headerStatus: { ...Typography.labelSm, color: Colors.primaryLight },
  headerAvatar: { width: 40, height: 40, borderRadius: Roundness.full, backgroundColor: Colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.labelLg, color: Colors.white },
  messages: { flex: 1 },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, textAlign: 'center', marginTop: 60 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, gap: Spacing.sm },
  input: { flex: 1, ...Typography.bodyMd, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Roundness.full, paddingHorizontal: Spacing.md, paddingVertical: 10, textAlign: 'right' },
  sendBtn: { width: 44, height: 44, borderRadius: Roundness.full, backgroundColor: Colors.green, justifyContent: 'center', alignItems: 'center' },
});
