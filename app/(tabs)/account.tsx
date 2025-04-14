import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AccountScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Tài khoản</ThemedText>
      </ThemedView>

      {/* Account Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Họ và tên</ThemedText>
          <ThemedText style={styles.accountValue}>Người dùng</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Email</ThemedText>
          <ThemedText style={styles.accountValue}>user@example.com</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Số điện thoại</ThemedText>
          <ThemedText style={styles.accountValue}>0123456789</ThemedText>
        </ThemedView>
        
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Đăng xuất</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  accountItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accountLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});