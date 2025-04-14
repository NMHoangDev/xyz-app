import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;  // Thêm trường category
};

interface EditTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string, amount: number, category: string) => void;
  onDelete: (id: string) => void;
  transaction: Transaction | null;
  type: 'income' | 'expense';
}

export function EditTransactionModal({
  isVisible,
  onClose,
  onSubmit,
  onDelete,
  transaction,
  type
}: EditTransactionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (transaction) {
      setName(transaction.name);
      setAmount(transaction.amount.toString());
    }
  }, [transaction]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleSubmit = () => {
    if (transaction && name && amount) {
      onSubmit(
        transaction.id, 
        name, 
        parseFloat(amount.replace(/\D/g, '')),
        transaction.category // Thêm category vào đây
      );
      onClose();
    }
  };

  const handleDelete = () => {
    if (transaction) {
      onDelete(transaction.id);
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View 
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          >
            <ThemedText style={styles.title}>
              {`Sửa khoản ${type === 'income' ? 'thu nhập' : 'chi tiêu'}`}
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Tên giao dịch</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên giao dịch"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Số tiền</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Nhập số tiền"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={handleDelete}
              >
                <ThemedText style={styles.buttonText}>Xóa</ThemedText>
              </TouchableOpacity>

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
                <ThemedText style={styles.buttonText}>Cập nhật</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#636366',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});




