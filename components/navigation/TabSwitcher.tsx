import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type TabSwitcherProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <ThemedView style={styles.tabSwitcher}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'previous' && styles.activeTab]} 
        onPress={() => onTabChange('previous')}
      >
        <ThemedText style={[styles.tabText, activeTab === 'previous' && styles.activeTabText]}>Tháng trước</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'current' && styles.activeTab]} 
        onPress={() => onTabChange('current')}
      >
        <ThemedText style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>Tháng hiện tại</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});