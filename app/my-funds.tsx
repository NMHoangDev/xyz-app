import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';

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
  targetAmount: number; // Thêm targetAmount để phù hợp với Fund Detail
  createdAt: Date;
};

// FundListItem Component - Hiển thị một quỹ trong danh sách
function FundListItem({ fund, onPress }: { fund: Fund; onPress?: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Định nghĩa các hàm helper ngay trong component
  const getFundTypeLabel = (type: string): string => {
    switch (type) {
      case 'couple': return 'Quỹ với người yêu';
      case 'personal': return 'Quỹ cá nhân';
      case 'friends': return 'Quỹ với bạn bè';
      case 'colleagues': return 'Quỹ với đồng nghiệp';
      case 'dining': return 'Quỹ ăn uống';
      case 'shopping': return 'Quỹ mua sắm';
      case 'savings': return 'Quỹ tiết kiệm';
      default: return 'Quỹ khác';
    }
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  return (
    <TouchableOpacity 
      style={[styles.fundListItem, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F5' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedView style={[styles.fundIconContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }]}>
        <IconSymbol name={fund.icon} size={24} color={fund.iconColor} />
      </ThemedView>
      <ThemedView style={styles.fundTextContainer}>
        <ThemedText style={styles.fundTitle}>{fund.name}</ThemedText>
        <ThemedText style={[styles.fundDescription, { color: colorScheme === 'dark' ? '#AEAEB2' : '#757575' }]}>
          {getFundTypeLabel(fund.type)} • {formatDate(fund.createdAt)}
        </ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme].icon} />
    </TouchableOpacity>
  );
}

export default function MyFundsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  
  // State cho danh sách quỹ
  const [myFunds, setMyFunds] = useState<Fund[]>([
    // Dữ liệu mẫu
    {
      id: '1',
      name: 'Đà Lạt Phiêu Lưu Ký',
      type: 'friends',
      icon: 'person.2.fill',
      iconColor: '#4A90E2',
      targetAmount: 15000000,
      createdAt: new Date(2025, 5, 15)
    },
    {
      id: '2',
      name: 'Quỹ tiết kiệm mua nhà',
      type: 'couple',
      icon: 'heart.fill',
      iconColor: '#FF6B6B',
      targetAmount: 500000000,
      createdAt: new Date(2025, 3, 10)
    },
    {
      id: '3',
      name: 'Nhậu đeeeeee',
      type: 'dining',
      icon: 'fork.knife',
      iconColor: '#FF6B6B',
      targetAmount: 3000000,
      createdAt: new Date(2025, 3, 1)
    }
  ]);
  
  // Xử lý khi người dùng nhấn vào một quỹ trong danh sách
  const handleFundItemPress = (fund: Fund) => {
    console.log(`Mở quỹ: ${fund.name}`);
    router.push(`/fund-detail?id=${fund.id}`);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Quỹ của tôi',
          headerShown: true,
        }} 
      />
      
      {myFunds.length > 0 ? (
        <FlatList
          data={myFunds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FundListItem 
              fund={item} 
              onPress={() => handleFundItemPress(item)}
            />
          )}
          contentContainerStyle={styles.fundListContent}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="star.fill" size={48} color="#AEAEB2" />
          <ThemedText style={styles.emptyStateText}>
            Bạn chưa có quỹ nào. Hãy tạo quỹ đầu tiên!
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  fundListContent: {
    padding: 16,
  },
  fundListItem: {
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
    marginTop: 16,
  },
});
