import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MonthSelector } from "@/components/datePickers/MonthSelector";
import { PieChart } from "react-native-gifted-charts";
import { API_URL } from "@env";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
};

type PieItem = {
  value: number;
  text: string;
  label: string;
  color: string;
  focused: boolean;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ReportScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 3, 1));
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [pieData, setPieData] = useState<PieItem[]>([]);

  const fetchFinanceSummary = async () => {
    const userId = 1; // Giả định user đang đăng nhập có ID là 1
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    try {
      const res = await fetch(
        `${API_URL}/api/expense/get-finance?userId=${userId}&month=${month}&year=${year}`
      );
      const data = await res.json();

      setTotalIncome(data.totalIncome);
      setTotalExpense(data.totalExpense);

      const incomeData = data.incomes.map((item: any) => ({
        id: item.id,
        name: item.name,
        amount: parseFloat(item.amount),
        date: new Date(item.createdAt),
      }));

      const expenseData = data.expenses.map((item: any) => ({
        id: item.id,
        name: item.name,
        amount: -Math.abs(parseFloat(item.amount)),
        date: new Date(item.createdAt),
      }));

      const pieItems: PieItem[] = data.expensePercentage.map((item: any) => ({
        value: parseFloat(item.amount),
        text: item.percentage,
        label: item.type,
        color: getRandomColor(),
        focused: false,
      }));

      setIncomes(incomeData);
      setExpenses(expenseData);
      setPieData(pieItems);
    } catch (err) {
      console.error("Lỗi khi fetch tài chính:", err);
    }
  };

  useEffect(() => {
    fetchFinanceSummary();
  }, [selectedDate]);

  const balance = totalIncome - totalExpense;

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
        {/* Tổng quan */}
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
            <ThemedText
              style={[styles.incomeText, balance < 0 && styles.expenseText]}
            >
              {balance.toLocaleString()} đ
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Biểu đồ tròn */}
        <ThemedView style={[styles.card, styles.chartCard]}>
          <ThemedText style={styles.chartTitle}>
            Tỷ lệ các khoản chi tiêu
          </ThemedText>
          {pieData.length > 0 ? (
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
            <ThemedText style={styles.emptyText}>
              Chưa có dữ liệu chi tiêu
            </ThemedText>
          )}
        </ThemedView>

        {/* Thu nhập */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Thu nhập</ThemedText>
          {incomes.length > 0 ? (
            incomes.map((transaction) => (
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

        {/* Chi tiêu */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Chi tiêu</ThemedText>
          {expenses.length > 0 ? (
            expenses.map((transaction) => (
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
    backgroundColor: "#1C1C1E",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    alignItems: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
  },
  incomeText: {
    color: "#34C759",
    fontWeight: "600",
    fontSize: 16,
  },
  expenseText: {
    color: "#e74c3c",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
    paddingVertical: 16,
  },
  placeholderText: {
    color: "#666",
    fontStyle: "italic",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default ReportScreen;
