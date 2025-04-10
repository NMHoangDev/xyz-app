import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TotalFooter } from '@/components/footer/TotalFooter';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { EditTransactionModal } from '@/components/modals/EditTransactionModal';
import { DateSelector } from '@/components/datePickers/DateSelector';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
};

export default function ExpenseScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddExpense = (name: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name,
      amount,
      date: selectedDate, // Sử dụng ngày được chọn
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditExpense = (id: string, name: string, amount: number) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id 
        ? { ...transaction, name, amount }
        : transaction
    ));
  };

  const handleDeleteExpense = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  // Lọc transactions theo ngày được chọn
  const filteredTransactions = transactions.filter(transaction => 
    transaction.date.toDateString() === selectedDate.toDateString()
  );

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Chi tiêu</ThemedText>
      </ThemedView>

      <DateSelector 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <ThemedView style={styles.content}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction)}
            >
              <ThemedView style={styles.transactionInfo}>
                <ThemedText style={styles.transactionName}>
                  {transaction.name}
                </ThemedText>
                <ThemedText style={styles.transactionDate}>
                  {formatDate(transaction.date)}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.transactionAmount}>
                {transaction.amount.toLocaleString()} đ
              </ThemedText>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedText style={styles.placeholderText}>
            Chưa có khoản chi tiêu nào
          </ThemedText>
        )}
      </ThemedView>

      <TotalFooter
        totalAmount={totalAmount}
        label="chi tiêu"
        onAddPress={() => setIsAddModalVisible(true)}
      />

      <AddTransactionModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddExpense}
        type="expense"
      />

      <EditTransactionModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleEditExpense}
        onDelete={handleDeleteExpense}
        transaction={selectedTransaction}
        type="expense"
      />
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
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
