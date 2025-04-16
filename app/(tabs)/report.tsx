import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MonthSelector } from '@/components/datePickers/MonthSelector';
import { isSameMonth } from 'date-fns';
import { PieChart } from 'react-native-gifted-charts';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
};

// Tạo một mảng các khoản thu nhập và chi tiêu mẫu
const MOCK_TRANSACTIONS: Transaction[] = [
  // Thu nhập
  {
    id: '1',
    name: 'Lương tháng 4',
    amount: 15000000,
    date: new Date(2025, 3, 5) // 5/4/2025
  },
  {
    id: '2',
    name: 'Thưởng dự án',
    amount: 3000000,
    date: new Date(2025, 3, 10)
  },
  {
    id: '3',
    name: 'Thu nhập phụ',
    amount: 2000000,
    date: new Date(2025, 3, 15)
  },
  
  // Chi tiêu
  {
    id: '4',
    name: 'Tiền nhà',
    amount: -7000000,
    date: new Date(2025, 3, 1)
  },
  {
    id: '5',
    name: 'Tiền điện',
    amount: -800000,
    date: new Date(2025, 3, 5)
  },
  {
    id: '6',
    name: 'Tiền nước',
    amount: -200000,
    date: new Date(2025, 3, 5)
  },
  {
    id: '7',
    name: 'Internet',
    amount: -300000,
    date: new Date(2025, 3, 5)
  },
  {
    id: '8',
    name: 'Đi chợ',
    amount: -2500000,
    date: new Date(2025, 3, 8)
  },
  {
    id: '9',
    name: 'Xăng xe',
    amount: -500000,
    date: new Date(2025, 3, 12)
  },
  {
    id: '10',
    name: 'Ăn uống ngoài',
    amount: -1500000,
    date: new Date(2025, 3, 15)
  }
];

export default function ReportScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 3, 1));
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Lọc transactions theo tháng được chọn
  const filteredTransactions = transactions.filter(transaction => 
    isSameMonth(transaction.date, selectedDate)
  );

  // Tách thành thu nhập và chi tiêu
  const incomeTransactions = filteredTransactions.filter(t => t.amount > 0);
  const expenseTransactions = filteredTransactions.filter(t => t.amount < 0);

  // Tính tổng thu nhập và chi tiêu
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Tạo data cho biểu đồ tròn - chỉ hiển thị tỷ lệ các khoản chi tiêu
  const pieData = expenseTransactions.map(t => ({
    value: Math.abs(t.amount),
    text: `${Math.round((Math.abs(t.amount) / totalExpense) * 100)}%`, // Tính % trên tổng chi tiêu
    label: t.name,
    color: getRandomColor(),
    focused: false,
  }));

  // Bỏ phần thêm "Còn lại" vào pieData

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Báo cáo thu chi</ThemedText>
      </ThemedView>

      <MonthSelector 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <ScrollView style={styles.content}>
        {/* Card tổng quan */}
        <ThemedView style={styles.card}>
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Tổng thu:</ThemedText>
            <ThemedText style={styles.incomeText}>
              {totalIncome.toLocaleString()} đ
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Tổng chi:</ThemedText>
            <ThemedText style={styles.expenseText}>
              {totalExpense.toLocaleString()} đ
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Còn lại:</ThemedText>
            <ThemedText style={[styles.incomeText, totalIncome < totalExpense && styles.expenseText]}>
              {(totalIncome - totalExpense).toLocaleString()} đ
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Biểu đồ tròn */}
        <ThemedView style={[styles.card, styles.chartCard]}>
          <ThemedText style={styles.chartTitle}>Tỷ lệ các khoản chi tiêu</ThemedText>
          {totalExpense > 0 ? (
            <PieChart
              data={pieData}
              donut
              showText
              textColor="white"
              radius={120}
              innerRadius={80}
              textSize={12}
              centerLabelComponent={() => null}
            />
          ) : (
            <ThemedText style={styles.emptyText}>Chưa có dữ liệu chi tiêu</ThemedText>
          )}
        </ThemedView>

        {/* Danh sách thu nhập */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Thu nhập</ThemedText>
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map(transaction => (
              <ThemedView key={transaction.id} style={styles.transactionItem}>
                <ThemedText>{transaction.name}</ThemedText>
                <ThemedText style={styles.incomeText}>
                  +{transaction.amount.toLocaleString()} đ
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedText style={styles.placeholderText}>
              Chưa có khoản thu nhập nào
            </ThemedText>
          )}
        </ThemedView>

        {/* Danh sách chi tiêu */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Chi tiêu</ThemedText>
          {expenseTransactions.length > 0 ? (
            expenseTransactions.map(transaction => (
              <ThemedView key={transaction.id} style={styles.transactionItem}>
                <ThemedText>{transaction.name}</ThemedText>
                <ThemedText style={styles.expenseText}>
                  -{Math.abs(transaction.amount).toLocaleString()} đ
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedText style={styles.placeholderText}>
              Chưa có khoản chi tiêu nào
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
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
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  chartCard: {
    marginVertical: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent', // Để trong suốt
  },
  summaryLabel: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
  },
  incomeText: {
    color: '#34C759', 
    fontWeight: '600',
    fontSize: 16,
  },
  expenseText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    paddingVertical: 16,
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});




































