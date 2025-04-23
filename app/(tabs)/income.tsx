import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo vector icons
import { API_URL } from "@env";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TotalFooter } from "@/components/footer/TotalFooter";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { EditTransactionModal } from "@/components/modals/EditTransactionModal";
import { MonthSelector } from "@/components/datePickers/MonthSelector";

type Transaction = {
  id: number;
  name: string;
  amount: string;
  date: Date;
  category?: string; // Thêm trường category và đánh dấu là optional với ?
};

export default function IncomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchIncome = async (userId: number) => {
    try {
      const date = new Date(selectedDate); // selectedDate là ngày được chọn
      const month = date.getMonth() + 1; // vì getMonth() trả về 0–11
      const year = date.getFullYear();

      const response = await fetch(
        `${API_URL}/api/income/get-all?userId=${userId}&month=${month}&year=${year}`
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Phản hồi không phải JSON hoặc bị lỗi:", text);
        return;
      }

      const result = await response.json();
      console.log("Danh sách thu nhập:", result.data);
      setTransactions(result.data);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    }
  };
  useEffect(() => {
    fetchIncome(1);
  }, [selectedDate]);

  // Lọc transactions theo tháng được chọn

  // Tính tổng amount từ transactions đã được lọc
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + parseInt(transaction.amount),
    0
  );

  const handleAddIncome = async (
    name: string,
    amount: number,
    category: string | null,
    userId: number
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/income/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
          userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅", result.message);
      } else {
        console.error("❌", result.error);
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối API:", error);
    }
    fetchIncome(userId);
  };

  const handleEditIncome = async (id: number, name: string, amount: string) => {
    try {
      const response = await fetch(`${API_URL}/api/income/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount }),
      });
      const contentType = response.headers.get("content-type");

      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text(); // Đọc lỗi chi tiết
        console.error("❌ Phản hồi không hợp lệ:", text);
        return;
      }

      const result = await response.json();

      if (response.ok) {
        console.log("✅", result.message);
      } else {
        console.error("❌", result.error);
      }
      fetchIncome(1);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thu nhập:", error);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/income/delete/${id}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text(); // Đọc lỗi chi tiết
        console.error("❌ Phản hồi không hợp lệ:", text);
        return;
      }

      const result = await response.json();
      console.log("✅", result.message);
      fetchIncome(1);
    } catch (error) {
      console.error("❌ Lỗi khi xóa thu nhập:", error);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN");
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
      <View style={styles.incomeList}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.incomeCard}>
              <View style={styles.incomeContent}>
                <View style={styles.iconWithText}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="cash-outline" size={20} color="#4CD964" />
                  </View>
                  <Text style={styles.incomeTitle}>{transaction.name}</Text>
                </View>
                <Text style={styles.incomeAmount}>
                  +{parseInt(transaction.amount).toLocaleString()} đ
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>Chưa có khoản thu nhập nào</Text>
        )}
      </View>

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
        userId={1}
      />

      <EditTransactionModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleEditIncome}
        onDelete={handleDeleteIncome}
        transaction={
          selectedTransaction
            ? {
                ...selectedTransaction,
                category: selectedTransaction.category || "other",
              }
            : null
        }
        type="income"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F10", // nền tối hiện đại
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
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
  incomeList: {
    marginTop: 24,
  },

  incomeCard: {
    backgroundColor: "#1C1C1E", // Nền card
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  incomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  incomeTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  incomeAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CD964", // Xanh sáng hiện đại
  },

  placeholder: {
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 15,
    color: "#A0A0A0",
    marginTop: 12,
  },
});
