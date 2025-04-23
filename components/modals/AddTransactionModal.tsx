import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as Haptics from "expo-haptics";

// Thêm export vào trước const
export const EXPENSE_CATEGORIES = [
  { id: "Ăn uống", label: "Ăn uống" },
  {
    id: "Tiện ích (điện, nước, internet)",
    label: "Tiện ích (điện, nước, internet)",
  },
  { id: "Tiền nhà", label: "Tiền nhà" },
  { id: "Di chuyển", label: "Di chuyển" },
  { id: "Mua sắm", label: "Mua sắm" },
  { id: "Giải trí", label: "Giải trí" },
  { id: "Sức khỏe", label: "Sức khỏe" },
  { id: "Giáo dục", label: "Giáo dục" },
  { id: "Khác", label: "Khác" },
];

type AddTransactionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    amount: number,
    category: string | null,
    userId: number
  ) => Promise<void>;
  type: "expense" | "income";
  userId: number;
};

export function AddTransactionModal({
  isVisible,
  onClose,
  onSubmit,
  type,
  userId,
}: AddTransactionModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSE_CATEGORIES[0].label
  );
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    console.log("Type:", type);
    console.log("Is expense section visible:", type === "expense");
  }, [type]);

  useEffect(() => {
    if (isVisible) {
      setError("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setName("");
      setAmount("");
      setSelectedCategory(EXPENSE_CATEGORIES[0].label);
      fadeAnim.setValue(0);
      slideAnim.setValue(100);
    }
  }, [isVisible]);

  const validate = () => {
    if (!name.trim()) {
      setError("Vui lòng nhập tên giao dịch");
      return false;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return false;
    }
    if (type === "expense") {
      if (!selectedCategory) {
        setError("Vui lòng chọn loại chi tiêu");
        return false;
      }
      if (selectedCategory === "other" && !customCategory.trim()) {
        setError("Vui lòng nhập tên loại chi tiêu");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (validate()) {
      const finalCategory =
        selectedCategory === "other" ? customCategory.trim() : selectedCategory;
      onSubmit(name.trim(), Number(amount), finalCategory, Number(userId));
      setName("");
      setAmount("");
      setSelectedCategory(EXPENSE_CATEGORIES[0].label);
      setCustomCategory("");
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedText style={styles.title}>
                {`Thêm khoản ${type === "income" ? "thu nhập" : "chi tiêu"}`}
              </ThemedText>

              {type === "expense" && (
                <>
                  <ThemedView style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue) =>
                        setSelectedCategory(itemValue)
                      }
                      style={[
                        styles.picker,
                        Platform.OS === "ios" && styles.pickerIOS,
                      ]}
                      dropdownIconColor="#fff"
                      mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                      itemStyle={
                        Platform.OS === "ios" ? styles.pickerItemIOS : undefined
                      }
                    >
                      {EXPENSE_CATEGORIES.map((category) => (
                        <Picker.Item
                          key={category.id}
                          label={category.label}
                          value={category.id}
                        />
                      ))}
                    </Picker>
                  </ThemedView>

                  {selectedCategory === "other" && (
                    <ThemedView style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Nhập tên loại chi tiêu mới"
                        value={customCategory}
                        onChangeText={setCustomCategory}
                        placeholderTextColor="#999"
                      />
                    </ThemedView>
                  )}
                </>
              )}

              <ThemedView style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên giao dịch"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số tiền"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </ThemedView>

              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}

              <ThemedView style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <ThemedText style={styles.buttonText}>Hủy</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <ThemedText
                    style={[styles.buttonText, styles.submitButtonText]}
                  >
                    Xác nhận
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "85%",
    maxWidth: 350,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#FFFFFF",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#262626",
  },
  input: {
    fontSize: 16,
    padding: 16,
    color: "#FFFFFF",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#333333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  submitButtonText: {
    color: "#FFFFFF",
  },
  pickerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    backgroundColor: "#262626",
    overflow: "hidden",
    minHeight: 0,
    justifyContent: "center",
  },
  picker: {
    color: "#FFFFFF",
    height: 50,
    width: "100%",
    backgroundColor: "#262626",
    marginLeft: -8,
    marginRight: -8,
  },
  pickerIOS: {
    height: 100,
  },
  pickerItemIOS: {
    fontSize: 18,
    height: 120,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
