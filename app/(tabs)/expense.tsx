import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo vector icons
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TotalFooter } from "@/components/footer/TotalFooter";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { EditTransactionModal } from "@/components/modals/EditTransactionModal";
import { DateSelector } from "@/components/datePickers/DateSelector";
import { API_URL } from "@env";

type Transaction = {
  id: number;
  name: string;
  amount: string;
  date: Date;
  category: string | null;
};

type ExpenseCategoryData = {
  category: string;
  totalAmount: number;
  expenses: Array<{ description: string; amount: number; id: number }>;
};

export default function ExpenseScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expense, setExpense] = useState([]);

  const fetchExpenses = async (userId, month, year, day) => {
    try {
      const url = `${API_URL}/api/expense/get-all?userId=${userId}&month=${month}&year=${year}${
        day ? `&day=${day}` : ""
      }`;
      const response = await fetch(url);
      const contentType = response.headers.get("Content-Type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setExpense(data.data);
          return data;
        } else {
          const text = await response.text();
          console.error("Dữ liệu trả về không phải JSON:", text);
          throw new Error("Dữ liệu trả về không phải JSON.");
        }
      } else {
        const errorText = await response.text();
        console.error("Lỗi khi gọi API:", errorText);
        throw new Error(`Lỗi khi gọi API: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  };

  useEffect(() => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    fetchExpenses(1, month, year, day);
  }, [selectedDate]);

  const handleAddExpense = async (
    name: string,
    amount: number,
    category: string | null,
    userId: number
  ) => {
    try {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const response = await fetch(`${API_URL}/api/expense/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount: amount.toString(),
          userId,
          type_expense_name: category,
          day,
          month,
          year,
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        Alert.alert("Tạo chi tiêu thành công");
        fetchExpenses(1, month, year, day);
      } else {
        console.error("Error creating expense:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditExpense = async (
    id: number,
    name: string,
    amount: string,
    category: string | null
  ) => {
    try {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await fetch(`${API_URL}/api/expense/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          amount: amount.toString(),
          userId: 1,
          day,
          month,
          year,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Lỗi", data.error || "Cập nhật thất bại");
      } else {
        Alert.alert("Thành công", "Chi tiêu đã được cập nhật!");
        fetchExpenses(1, month, year, day);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
      console.error(error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    try {
      const response = await fetch(`${API_URL}/api/expense/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Lỗi", data.error || "Không thể xóa chi tiêu");
      } else {
        Alert.alert("Thành công", "Đã xóa chi tiêu thành công!");
        fetchExpenses(1, month, year, day);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  const handleTransactionPress = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const groupedTransactions = expense.reduce<
    Record<string, ExpenseCategoryData>
  >((groups, categoryData, index) => {
    const category = categoryData.category || "Khác";
    if (!groups[category]) {
      groups[category] = {
        id: `${category}-${index}`,
        category,
        totalAmount: 0,
        expenses: [],
      };
    }

    groups[category].totalAmount += categoryData.totalAmount;
    categoryData.expenses.forEach((expense) => {
      groups[category].expenses.push({
        description: expense.description,
        amount: expense.amount,
        id: expense.id,
      });
    });

    return groups;
  }, {});

  const totalAmount = Object.values(groupedTransactions).reduce(
    (sum, category) => sum + category.totalAmount,
    0
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Chi tiêu</ThemedText>
      </ThemedView>

      <DateSelector
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
      >
        {expense.length > 0 ? (
          Object.entries(groupedTransactions).map(
            ([categoryId, categoryData]) => (
              <ThemedView key={categoryId} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === categoryId ? null : categoryId
                    )
                  }
                >
                  <Ionicons name="wallet-outline" size={24} color="#4BA3FA" />{" "}
                  {/* Icon for category */}
                  <ThemedText style={styles.categoryName}>
                    {categoryData.category}
                  </ThemedText>
                  <ThemedText style={styles.categoryAmount}>
                    - {categoryData.totalAmount.toLocaleString()} đ
                  </ThemedText>
                </TouchableOpacity>
                {selectedCategory === categoryId && (
                  <ThemedView style={styles.transactionsList}>
                    {categoryData.expenses.map((transaction) => (
                      <TouchableOpacity
                        key={transaction.id}
                        style={styles.transactionItem}
                        onPress={() => handleTransactionPress(transaction)}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={20}
                          color="#4CD964"
                        />{" "}
                        {/* Icon for transaction */}
                        <ThemedText style={styles.transactionName}>
                          {transaction.description}
                        </ThemedText>
                        <ThemedView style={styles.transactionDetails}>
                          <ThemedText style={styles.transactionAmount}>
                            - {transaction.amount.toLocaleString()} đ
                          </ThemedText>
                        </ThemedView>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                )}
              </ThemedView>
            )
          )
        ) : (
          <ThemedText style={styles.placeholderText}>
            Chưa có khoản chi tiêu nào
          </ThemedText>
        )}
      </ScrollView>

      <TotalFooter
        totalAmount={totalAmount}
        label="chi tiêu"
        onAddPress={() => setIsAddModalVisible(true)}
        type="expense"
      />

      <AddTransactionModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddExpense}
        type="expense"
        userId={1}
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
    backgroundColor: "#0F0F10", // nền đen xám sang
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    width: "90%",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  categoryAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  transactionsList: {
    paddingLeft: 12,
    marginTop: 12,
  },
  transactionItem: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionName: {
    fontSize: 16,
    color: "#F9F9F9",
    marginBottom: 8,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999999",
    fontSize: 14,
    fontStyle: "italic",
  },
});
