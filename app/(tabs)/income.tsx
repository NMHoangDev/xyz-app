import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabSwitcher } from '@/components/navigation/TabSwitcher';
import { TotalFooter } from '@/components/footer/TotalFooter';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { EditTransactionModal } from '@/components/modals/EditTransactionModal';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
};

export default function IncomeScreen() {
  const [activeTab, setActiveTab] = useState('current');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddIncome = (name: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name,
      amount,
      date: new Date(),
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

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Thu nhập</ThemedText>
      </ThemedView>

      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <ThemedView style={styles.content}>
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction)}
            >
              <ThemedView style={styles.transactionInfo}>
                <ThemedText style={styles.transactionName}>{transaction.name}</ThemedText>
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
          <ThemedText style={styles.placeholderText}>Chưa có khoản nào</ThemedText>
        )}
      </ThemedView>

      <TotalFooter
        totalAmount={totalAmount}
        label="thu nhập"
        onAddPress={() => setIsAddModalVisible(true)}
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
        transaction={selectedTransaction}
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
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
  },
});
