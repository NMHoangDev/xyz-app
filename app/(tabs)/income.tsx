import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TotalFooter } from '@/components/footer/TotalFooter';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { EditTransactionModal } from '@/components/modals/EditTransactionModal';
import { MonthSelector } from '@/components/datePickers/MonthSelector';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category?: string;  // Thêm trường category và đánh dấu là optional với ?
};

export default function IncomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Thêm hàm helper để kiểm tra xem transaction có thuộc tháng được chọn không
  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  // Lọc transactions theo tháng được chọn
  const filteredTransactions = transactions.filter(transaction => 
    isSameMonth(transaction.date, selectedDate)
  );

  // Tính tổng amount từ transactions đã được lọc
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const handleAddIncome = (name: string, amount: number) => {
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name,
      amount,
      date: firstDayOfMonth, // Luôn set ngày là ngày đầu tiên của tháng
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditIncome = (id: string, name: string, amount: number) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id 
        ? { ...transaction, name, amount }
        : transaction
    ));
  };

  const handleDeleteIncome = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Thu nhập</ThemedText>
      </ThemedView>

      <MonthSelector 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Main Content Area */}
      <ThemedView style={styles.content}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction)}
            >
              <ThemedView style={styles.transactionInfo}>
                <ThemedText style={styles.transactionName}>{transaction.name}</ThemedText>
                {/* Bỏ phần hiển thị ngày ở đây */}
              </ThemedView>
              <ThemedText style={styles.transactionAmount}>
                +{transaction.amount.toLocaleString()} đ
              </ThemedText>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedText style={styles.placeholderText}>Chưa có khoản nào</ThemedText>
        )}
      </ThemedView>

      <TotalFooter
        totalAmount={totalAmount}
        label="thu nhập"
        onAddPress={() => setIsAddModalVisible(true)}
        type="income"
      />

      <AddTransactionModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddIncome}
        type="income"
      />

      <EditTransactionModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleEditIncome}
        onDelete={handleDeleteIncome}
        transaction={selectedTransaction ? {...selectedTransaction, category: selectedTransaction.category || 'other'} : null}
        type="income"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759', // Thêm màu xanh iOS
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
  },
});
