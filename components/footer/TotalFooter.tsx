import React from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

type TotalFooterProps = {
  totalAmount: number;
  label: string;
  onAddPress: () => void;
  type: 'income' | 'expense';
  totalIncome?: number; 
  totalExpense?: number; 
};

export function TotalFooter({ 
  totalAmount, 
  label, 
  onAddPress, 
  type,
  totalIncome = 0,
  totalExpense = 0 
}: TotalFooterProps) {
  const insets = useSafeAreaInsets();
  
  // Format số tiền với đơn vị đồng
  const formattedAmount = totalAmount.toLocaleString() + ' đ';
  
  // chi tieu / thu nhap
  const getRatioText = () => {
    if (type === 'expense' && totalIncome > 0) {
      return `Tổng chi tiêu: ${totalExpense.toLocaleString()}đ`;
    }
    return `Tổng ${label} : ${formattedAmount}`;
  };

  return (
    <ThemedView style={[styles.footer, { marginBottom: insets.bottom + 40 }]}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.totalText}>
          {getRatioText()}
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <IconSymbol name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingVertical: 0, 
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    includeFontPadding: false, 
    textAlignVertical: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 16, 
      },
      android: {
        lineHeight: 16, 
      },
    }),
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
