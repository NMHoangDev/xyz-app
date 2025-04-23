import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({
  selectedDate,
  onDateSelect,
}: DateSelectorProps) {
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);

  // Tạo mảng 12 tháng của năm hiện tại
  const getMonthsInYear = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  };

  const currentYear = new Date().getFullYear();
  const months = getMonthsInYear(currentYear);

  // Tạo mảng các ngày trong tháng được chọn
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(year, month, i + 1);
      return day;
    });
  };

  const formatDayOfWeek = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const formatMonthYear = (date: Date) => {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleMonthSelect = (date: Date) => {
    // Tạo ngày mới với ngày 1 của tháng được chọn
    const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
    onDateSelect(newDate);
    setMonthPickerVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={() => setMonthPickerVisible(true)}
        style={styles.monthSelector}
      >
        <ThemedText style={styles.monthText}>
          {formatMonthYear(selectedDate)}
        </ThemedText>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {getDaysInMonth(selectedDate).map((date) => (
          <TouchableOpacity
            key={date.toISOString()}
            onPress={() => onDateSelect(date)}
            style={[
              styles.dateItem,
              isSelected(date) && styles.selectedDateItem,
            ]}
          >
            <ThemedText
              style={[
                styles.dayOfWeekText,
                isSelected(date) && styles.selectedText,
              ]}
            >
              {formatDayOfWeek(date)}
            </ThemedText>
            <ThemedText
              style={[styles.dateText, isSelected(date) && styles.selectedText]}
            >
              {formatDate(date)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={isMonthPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthPickerVisible(false)}
        >
          <ThemedView style={styles.monthPickerContainer}>
            <ThemedText style={styles.monthPickerTitle}>Chọn tháng</ThemedText>
            <View style={styles.monthGrid}>
              {months.map((date) => (
                <TouchableOpacity
                  key={date.getMonth()}
                  style={[
                    styles.monthItem,
                    date.getMonth() === selectedDate.getMonth() &&
                      styles.selectedMonthItem,
                  ]}
                  onPress={() => handleMonthSelect(date)}
                >
                  <ThemedText
                    style={[
                      styles.monthItemText,
                      date.getMonth() === selectedDate.getMonth() &&
                        styles.selectedMonthText,
                    ]}
                  >
                    {`Tháng ${date.getMonth() + 1}`}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    backgroundColor: "#0F0F10", // nền chung dark
  },
  monthSelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  dateItem: {
    width: 52,
    height: 70,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#1E1F22",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateItem: {
    backgroundColor: "#4BAF50", // xanh nổi bật hơn
  },
  dayOfWeekText: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "500",
    color: "#B0B0B0",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F3F3F3",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  monthPickerContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#1B1B1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  monthPickerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  monthItem: {
    width: "30%",
    paddingVertical: 14,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: "#2A2B2F",
    alignItems: "center",
  },
  selectedMonthItem: {
    backgroundColor: "#4CB050",
  },
  monthItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DDDDDD",
  },
  selectedMonthText: {
    color: "#FFFFFF",
  },
});
