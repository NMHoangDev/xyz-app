import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, Modal, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Định nghĩa kiểu dữ liệu cho quỹ
type Fund = {
  id: string;
  name: string;
  type: string;
  icon: IconSymbolName;
  iconColor: string;
  targetAmount: number;  // Đổi từ initialAmount thành targetAmount
  createdAt: Date;
};

// FundOption Component
export function FundOption({ 
  icon, 
  title, 
  description, 
  backgroundColor = '#1E1E1E',
  iconColor,
  onPress
}: { 
  icon: IconSymbolName; 
  title: string; 
  description: string; 
  backgroundColor?: string;
  iconColor?: string;
  onPress?: () => void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <TouchableOpacity 
      style={[styles.fundOption, { backgroundColor: colorScheme === 'dark' ? backgroundColor : '#F0F0F5' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedView style={[styles.fundIconContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }]}>
        <IconSymbol name={icon} size={24} color={iconColor || '#2563EB'} />
      </ThemedView>
      <ThemedView style={styles.fundTextContainer}>
        <ThemedText style={styles.fundTitle}>{title}</ThemedText>
        <ThemedText style={[styles.fundDescription, { color: colorScheme === 'dark' ? '#AEAEB2' : '#757575' }]}>
          {description}
        </ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={20} color={colors.icon} />
    </TouchableOpacity>
  );
}

// GoalOption Component
export function GoalOption({
  icon,
  title,
  iconColor,
  iconBackgroundColor,
  onPress
}: {
  icon: IconSymbolName;
  title: string;
  iconColor: string;
  iconBackgroundColor: string;
  onPress?: () => void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const goalBgColor = colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5';
  
  return (
    <TouchableOpacity 
      style={[styles.goalItem, {backgroundColor: goalBgColor}]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedView style={[styles.goalIconContainer, {backgroundColor: iconBackgroundColor}]}>
        <IconSymbol name={icon} size={24} color={iconColor} />
      </ThemedView>
      <ThemedText style={[styles.goalText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Main Screen Component
export default function GroupScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  
  // State cho dialog tạo quỹ
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [selectedFundType, setSelectedFundType] = useState('');
  const [selectedFundTitle, setSelectedFundTitle] = useState('');
  const [error, setError] = useState('');
  
  // Xử lý khi người dùng nhấn vào một quỹ
  const handleFundPress = (fundType: string, title: string) => {
    setSelectedFundType(fundType);
    setSelectedFundTitle(title);
    setFundName(''); // Reset tên quỹ
    setFundAmount(''); // Reset số tiền
    setError(''); // Reset lỗi
    setIsDialogVisible(true);
  };

  // Xử lý khi người dùng nhấn vào một mục tiêu
  const handleGoalPress = (goalType: string, title: string) => {
    setSelectedFundType(goalType);
    setSelectedFundTitle(title);
    setFundName(''); // Reset tên quỹ
    setFundAmount(''); // Reset số tiền
    setError(''); // Reset lỗi
    setIsDialogVisible(true);
  };

  // Xác thực dữ liệu nhập vào
  const validateInput = (): boolean => {
    if (!fundName.trim()) {
      setError('Vui lòng nhập tên quỹ');
      return false;
    }
    
    if (!fundAmount.trim()) {
      setError('Vui lòng nhập số tiền ban đầu');
      return false;
    }
    
    const amount = Number(fundAmount.replace(/\D/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }
    
    setError('');
    return true;
  };

  // Xử lý khi người dùng tạo quỹ
  const handleCreateFund = () => {
    if (!validateInput()) {
      return;
    }
    
    // Tạo quỹ mới
    const amount = Number(fundAmount.replace(/\D/g, ''));
    const newFund: Fund = {
      id: Date.now().toString(),
      name: fundName.trim(),
      type: selectedFundType,
      icon: getIconForFundType(selectedFundType),
      iconColor: getColorForFundType(selectedFundType),
      targetAmount: amount,  // Đổi từ initialAmount thành targetAmount
      createdAt: new Date()
    };
    
    console.log(`Tạo quỹ: ${fundName} (Loại: ${selectedFundType}, Số tiền mục tiêu: ${amount})`);
    // router.push(`/fund-detail?id=${newFund.id}`);
    
    setIsDialogVisible(false);
  };
  
  // Chuyển hướng đến màn hình Quỹ của tôi
  const navigateToMyFunds = () => {
    router.push('/my-funds');
  };
  
  // Hàm lấy icon dựa trên loại quỹ
  const getIconForFundType = (type: string): IconSymbolName => {
    switch (type) {
      case 'couple': return 'heart.fill';
      case 'personal': return 'star.fill';
      case 'friends': return 'person.2.fill';
      case 'colleagues': return 'briefcase.fill';
      case 'dining': return 'fork.knife';
      case 'shopping': return 'cart.fill';
      case 'savings': return 'dollarsign.circle.fill';
      default: return 'star.fill';
    }
  };
  
  // Hàm lấy màu dựa trên loại quỹ
  const getColorForFundType = (type: string): string => {
    switch (type) {
      case 'couple': return '#FF6B6B';
      case 'personal': return '#F5A623';
      case 'friends': return '#4A90E2';
      case 'colleagues': return '#34C759';
      case 'dining': return '#FF6B6B';
      case 'shopping': return '#4A90E2';
      case 'savings': return '#F5A623';
      default: return '#4A90E2';
    }
  };

  // Định dạng số tiền khi người dùng nhập
  const formatAmount = (text: string) => {
    // Chỉ giữ lại các ký tự số
    const numericValue = text.replace(/\D/g, '');
    
    // Định dạng số với dấu phân cách hàng nghìn
    if (numericValue) {
      const formattedValue = Number(numericValue).toLocaleString('vi-VN');
      setFundAmount(formattedValue);
    } else {
      setFundAmount('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header với nút hiển thị danh sách quỹ */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Quỹ nhóm</ThemedText>
        <TouchableOpacity 
          style={styles.myFundsButton}
          onPress={navigateToMyFunds}
        >
          <ThemedText style={styles.myFundsButtonText}>Quỹ của tôi</ThemedText>
          <IconSymbol name="chevron.right" size={16} color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Nội dung không thay đổi */}
        <ThemedText style={styles.sectionTitle}>Các gợi ý tạo quỹ</ThemedText>
        
        <FundOption 
          icon="heart.fill" 
          title="Mở quỹ với người yêu" 
          description="Cùng nhau tích lũy, cùng vun đắp cho tương lai."
          backgroundColor={colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5'}
          iconColor="#FF6B6B"
          onPress={() => handleFundPress('couple', 'Mở quỹ với người yêu')}
        />
        
        <FundOption 
          icon="star.fill" 
          title="Mở quỹ cá nhân" 
          description="Tạo quỹ cho những khoản chi tiêu và tiết kiệm của riêng bạn."
          backgroundColor={colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5'}
          iconColor="#F5A623"
          onPress={() => handleFundPress('personal', 'Mở quỹ cá nhân')}
        />
        
        <FundOption 
          icon="person.2.fill" 
          title="Mở quỹ với bạn bè" 
          description="Cùng góp quỹ, tận hưởng trải nghiệm đáng nhớ."
          backgroundColor={colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5'}
          iconColor="#4A90E2"
          onPress={() => handleFundPress('friends', 'Mở quỹ với bạn bè')}
        />
        
        <FundOption 
          icon="briefcase.fill" 
          title="Mở quỹ với đồng nghiệp" 
          description="Minh bạch chi tiêu, thắt chặt tình đồng nghiệp."
          backgroundColor={colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5'}
          iconColor="#34C759"
          onPress={() => handleFundPress('colleagues', 'Mở quỹ với đồng nghiệp')}
        />
        
        <ThemedText style={styles.sectionTitle}>Chọn một mục tiêu và mở Quỹ để hiện thực ước mơ</ThemedText>
        
        <ThemedView style={styles.goalsContainer}>
          <GoalOption 
            icon="fork.knife" 
            title="Ăn sang ở nhà hàng" 
            iconColor="#FF6B6B"
            iconBackgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#FFEFEF'}
            onPress={() => handleGoalPress('dining', 'Ăn sang ở nhà hàng')}
          />
          
          <GoalOption 
            icon="cart.fill" 
            title="Mua món đồ mơ ước" 
            iconColor="#4A90E2"
            iconBackgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#EBF5FF'}
            onPress={() => handleGoalPress('shopping', 'Mua món đồ mơ ước')}
          />
          
          <GoalOption 
            icon="dollarsign.circle.fill" 
            title="Dự phòng tài chính" 
            iconColor="#F5A623"
            iconBackgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#FFF8E6'}
            onPress={() => handleGoalPress('savings', 'Dự phòng tài chính')}
          />
        </ThemedView>
      </ScrollView>

      {/* Dialog để nhập tên quỹ và số tiền */}
      <Modal
        visible={isDialogVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDialogVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.dialogContainer}>
            <ThemedText style={styles.dialogTitle}>{selectedFundTitle}</ThemedText>
            <ThemedText style={styles.dialogSubtitle}>Hãy đặt tên và số tiền mục tiêu cho quỹ của bạn</ThemedText>
            
            {/* Input tên quỹ */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5',
                  color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF'
                }
              ]}
              placeholder="Nhập tên quỹ..."
              placeholderTextColor={colorScheme === 'dark' ? '#AEAEB2' : '#A9A9A9'}
              value={fundName}
              onChangeText={setFundName}
            />
            
            {/* Input số tiền */}
            <View style={[
              styles.amountInputContainer,
              {
                borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5',
                backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF'
              }
            ]}>
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                  }
                ]}
                placeholder="Nhập số tiền mục tiêu..."
                placeholderTextColor={colorScheme === 'dark' ? '#AEAEB2' : '#A9A9A9'}
                value={fundAmount}
                onChangeText={formatAmount}
                keyboardType="numeric"
              />
              <ThemedText style={styles.currencyText}>đ</ThemedText>
            </View>
            
            {/* Hiển thị lỗi nếu có */}
            {error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : null}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsDialogVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Hủy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateFund}
              >
                <ThemedText style={[styles.buttonText, styles.createButtonText]}>Tạo quỹ</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  myFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  myFundsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  fundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fundIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  fundTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  fundTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fundDescription: {
    fontSize: 14,
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 80,
  },
  goalItem: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  goalText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  // Styles cho dialog
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  currencyText: {
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  createButton: {
    marginLeft: 8,
    backgroundColor: '#2563EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#AEAEB2',
  },
});




