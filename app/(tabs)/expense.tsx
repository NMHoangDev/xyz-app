import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TotalFooter } from '@/components/footer/TotalFooter';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { EditTransactionModal } from '@/components/modals/EditTransactionModal';
import { DateSelector } from '@/components/datePickers/DateSelector';
import { EXPENSE_CATEGORIES, ExpenseCategoryId } from '@/components/modals/AddTransactionModal';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';

const DEBUG = false; 

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
};

export default function ExpenseScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategoryId[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddExpense = (name: string, amount: number, category: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name,
      amount,
      date: selectedDate,
      category,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditExpense = (id: string, name: string, amount: number, category: string) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id 
        ? { ...transaction, name, amount, category }
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

  // data tong icome ao
  const mockTotalIncome = 20000000;

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const category = transaction.category as ExpenseCategoryId;
    if (!groups[category]) {
      groups[category] = {
        transactions: [],
        total: 0,
      };
    }
    groups[category].transactions.push(transaction);
    groups[category].total += transaction.amount;
    return groups;
  }, {} as Record<ExpenseCategoryId, { transactions: Transaction[], total: number }>);

  const getCategoryLabel = (categoryId: ExpenseCategoryId) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.label : 'Khác';
  };

  const getCategoryIcon = (categoryId: ExpenseCategoryId): IconSymbolName => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || 'ellipsis.circle';
  };

  const handleCategoryPress = (categoryId: ExpenseCategoryId) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

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
          Object.entries(groupedTransactions).map(([categoryId, { transactions, total }]) => (
            <ThemedView key={categoryId}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => handleCategoryPress(categoryId as ExpenseCategoryId)}
              >
                <ThemedView style={styles.categoryInfo}>
                  <ThemedView style={styles.categoryTitleRow}>
                    <IconSymbol 
                      name={getCategoryIcon(categoryId as ExpenseCategoryId)} 
                      size={24} 
                      color="#FFFFFF" 
                      style={styles.categoryIcon} 
                    />
                    <ThemedText style={styles.categoryName}>
                      {getCategoryLabel(categoryId as ExpenseCategoryId)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedText style={styles.categoryAmount}>
                  -{total.toLocaleString()} đ
                </ThemedText>
              </TouchableOpacity>

              {selectedCategories.includes(categoryId as ExpenseCategoryId) && (
                <ThemedView style={styles.transactionsList}>
                  {transactions.map(transaction => (
                    <TouchableOpacity
                      key={transaction.id}
                      style={styles.transactionItem}
                      onPress={() => handleTransactionPress(transaction)}
                    >
                      <ThemedText style={styles.transactionName}>
                        {transaction.name}
                      </ThemedText>
                      <ThemedView style={styles.transactionDetails}>
                        <ThemedText style={styles.transactionDate}>
                          {formatDate(transaction.date)}
                        </ThemedText>
                        <ThemedText style={styles.transactionAmount}>
                          -{transaction.amount.toLocaleString()} đ
                        </ThemedText>
                      </ThemedView>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
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
        type="expense"
        totalIncome={mockTotalIncome}
        totalExpense={totalAmount} 
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
    paddingHorizontal: 1, 
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    marginVertical: 8,
  },
  categoryInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 0,
  },
  categoryIcon: {
    marginRight: 8,
    
  },
  categoryRatio: {
    fontSize: 12,
    color: '#888888',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  transactionsList: {
    paddingLeft: 16,
    backgroundColor: 'transparent',
  },
  transactionItem: {
    padding: 12,
    backgroundColor: 'transparent',
  },
  transactionName: {
    fontSize: 14,
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888888',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#e74c3c',
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666666',
  },
});
