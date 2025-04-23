import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Modal, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type MonthSelectorProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
};

export function MonthSelector({
  selectedDate,
  onDateSelect,
}: MonthSelectorProps) {
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);

  const getMonthsInYear = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  };

  const currentYear = new Date().getFullYear();
  const months = getMonthsInYear(currentYear);

  const handleMonthSelect = (date: Date) => {
    onDateSelect(date);
    setMonthPickerVisible(false);
  };

  const formatMonthYear = (date: Date) => {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
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
    backgroundColor: "#0F0F10", // đồng bộ dark mode
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
    shadowColor: "#4CB050",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  monthItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DDDDDD",
  },
  selectedMonthText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
