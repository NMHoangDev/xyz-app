import React from "react";
import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

type TotalFooterProps = {
  totalAmount: number;
  label: string;
  onAddPress: () => void;
  type: "income" | "expense";
  totalIncome?: number; // Thêm prop cho tổng thu nhập
  totalExpense?: number; // Thêm prop cho tổng chi tiêu

};

export function TotalFooter({
  totalAmount,
  label,
  onAddPress,
  type,
  totalIncome = 0,
  totalExpense = 0,
}: TotalFooterProps) {
  const insets = useSafeAreaInsets();

  // Format số tiền với đơn vị đồng

  const formattedAmount = totalAmount.toLocaleString() + " đ";

  // Tạo text hiển thị tỷ lệ

  const getRatioText = () => {
    if (type === "expense" && totalIncome > 0) {
      return `Tổng chi tiêu: ${totalExpense.toLocaleString()}/${totalIncome.toLocaleString()} đ`;
    }
    return `Tổng ${label} : ${formattedAmount}`;
  };

  return (
    <ThemedView style={[styles.footer, { marginBottom: insets.bottom + 40 }]}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.totalText}>{getRatioText()}</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <IconSymbol name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1C1C1E",
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  container: {

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",

  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4CD964", // mặc định xanh lá (income)
    justifyContent: "center",
    alignItems: "center",
  },
});
