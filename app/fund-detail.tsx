import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, View, FlatList, Modal, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { format, addDays, isAfter, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Format ngày tháng
const formatDate = (date: Date): string => {
  // Trong date-fns v4, format có thể chỉ nhận 2 tham số
  return format(date, 'dd/MM/yyyy');
};



// Thêm ngày
const tomorrow = addDays(new Date(), 1);

// So sánh ngày
const isLater = isAfter(tomorrow, new Date()); // true

// Tính số ngày giữa hai ngày
const daysBetween = differenceInDays(
  new Date(2025, 0, 14), // 14/01/2025
  new Date(2024, 0, 14)  // 14/01/2024
); // 366 (vì 2024 là năm nhuận)

// Định nghĩa kiểu dữ liệu cho quỹ
type Fund = {
  id: string;
  name: string;
  type: string;
  icon: IconSymbolName;
  iconColor: string;
  targetAmount: number;
  createdAt: Date;
};

// Định nghĩa kiểu dữ liệu cho hoạt động
type Activity = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: Date;
};

// Định nghĩa kiểu dữ liệu cho thành viên
type Member = {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: Date;
};

// ActivityItem Component - Hiển thị một hoạt động trong danh sách
function ActivityItem({ activity }: { activity: Activity }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <ThemedView style={styles.activityItem}>
      <View style={[
        styles.avatarContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#E5E5E5' }
      ]}>
        <IconSymbol 
          name="person.fill" 
          size={20} 
          color={colorScheme === 'dark' ? '#AEAEB2' : '#757575'} 
        />
      </View>
      
      <ThemedView style={styles.activityContent}>
        <ThemedText style={styles.activityUser}>{activity.userName}</ThemedText>
        {activity.type === 'withdraw' && (
          <ThemedText style={styles.activityDescription}>rút quỹ tiêu</ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.activityRight}>
        <ThemedText style={styles.activityDate}>{formatDate(activity.date)}</ThemedText>
        <ThemedText 
          style={[
            styles.activityAmount, 
            activity.type === 'deposit' 
              ? styles.depositAmount 
              : styles.withdrawAmount
          ]}
        >
          {activity.type === 'deposit' ? '+ ' : '- '}
          {Math.abs(activity.amount).toLocaleString()}đ
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

// MemberItem Component - Hiển thị một thành viên trong danh sách
function MemberItem({ member }: { member: Member }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <ThemedView style={styles.memberItem}>
      <View style={[
        styles.avatarContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#E5E5E5' }
      ]}>
        <IconSymbol 
          name="person.fill" 
          size={20} 
          color={colorScheme === 'dark' ? '#AEAEB2' : '#757575'} 
        />
      </View>
      
      <ThemedView style={styles.memberContent}>
        <ThemedText style={styles.memberName}>{member.name}</ThemedText>
        <ThemedText style={styles.memberRole}>
          {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.memberRight}>
        <ThemedText style={styles.memberJoinDate}>
          Tham gia: {formatDate(member.joinedAt)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

export default function FundDetailScreen() {
  const params = useLocalSearchParams();
  const fundId = params.id as string;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  // State cho thông tin quỹ
  const [fund, setFund] = useState<Fund | null>(null);
  const [currentAmount, setCurrentAmount] = useState(40000);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState('activities');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  
  // Thêm state mới cho dialog góp quỹ
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const [contributeError, setContributeError] = useState('');
  
  // Thêm state để theo dõi trạng thái nút
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  // Giả lập dữ liệu
  useEffect(() => {
    // Trong thực tế, bạn sẽ lấy dữ liệu từ API hoặc cơ sở dữ liệu
    const mockFund: Fund = {
      id: fundId || '1',
      name: 'Đà Lạr Phiêu Lưu Ký',
      type: 'friends',
      icon: 'airplane.circle.fill',
      iconColor: '#4A90E2',
      targetAmount: 20000000,
      createdAt: new Date(2023, 11, 1)
    };
    
    const mockActivities: Activity[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Nguyễn Thúc Thùy Tiên',
        amount: 20000,
        type: 'deposit',
        date: new Date(2025, 4, 24)
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Nguyễn Quang Linh',
        amount: 10000,
        type: 'deposit',
        date: new Date(2025, 4, 24)
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Trấn Thành',
        amount: 10000,
        type: 'deposit',
        date: new Date(2024, 4, 24)
      }
    ];
    
    const mockMembers: Member[] = [
      {
        id: 'user1',
        name: 'Bạn',
        role: 'admin',
        joinedAt: new Date(2023, 24, 5)
      }
    ];
    
    setFund(mockFund);
    setActivities(mockActivities);
    setMembers(mockMembers);
  }, [fundId]);
  
  // Xử lý khi người dùng nhấn nút góp quỹ
  const handleContribute = () => {
    if (isButtonDisabled) return;
    
    console.log('Button pressed, showing modal');
    
    // Đặt disabled trước để tránh double-press
    // setIsButtonDisabled(true);
    
    // Đặt state modal trước tiên, đảm bảo UI cập nhật ngay lập tức
    setShowContributeModal(true);
    
    // Reset các state khác sau đó
    setContributeAmount('');
    setContributeError('');
    
    // Reset disabled state sau 500ms
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 500);
  };

  // Thêm hàm xử lý khi người dùng xác nhận góp quỹ
  const handleConfirmContribute = () => {
    // Kiểm tra số tiền hợp lệ
    if (!contributeAmount.trim()) {
      setContributeError('Vui lòng nhập số tiền');
      return;
    }
    
    const amount = Number(contributeAmount.replace(/\D/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setContributeError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    // Đóng dialog trước để UI phản hồi nhanh hơn
    setShowContributeModal(false);
    
    // Sử dụng setTimeout để tách việc cập nhật state ra khỏi việc đóng modal
    setTimeout(() => {
      // Cập nhật số tiền hiện tại
      setCurrentAmount(prev => prev + amount);
      
      // Thêm hoạt động mới
      const newActivity: Activity = {
        id: Date.now().toString(),
        userId: 'currentUser',
        userName: 'Bạn',
        amount: amount,
        type: 'deposit',
        date: new Date()
      };
      
      setActivities(prev => [newActivity, ...prev]);
    }, 50);
  };

  // Định dạng số tiền khi người dùng nhập
  const formatAmount = (text: string) => {
    // Chỉ giữ lại các ký tự số
    const numericValue = text.replace(/\D/g, '');
    
    // Định dạng số với dấu phân cách hàng nghìn - cách tối ưu hơn
    setContributeAmount(numericValue ? Number(numericValue).toLocaleString('vi-VN') : '');
  };
  
  // Xử lý khi người dùng nhấn nút rút quỹ
  const handleWithdraw = () => {
    console.log('Rút quỹ');
    // Hiển thị dialog nhập số tiền rút
  };
  
  // Xử lý khi người dùng nhấn nút chia sẻ
  // const handleShare = () => {
  //   console.log('Chia sẻ');
  //   // Hiển thị options chia sẻ
  // };
  
  // Xử lý khi người dùng nhấn nút thêm thành viên
  const handleAddMember = () => {
    if (newMemberName.trim() === '') return;
    
    const newMember: Member = {
      id: `user${members.length + 2}`,
      name: newMemberName.trim(),
      role: 'member',
      joinedAt: new Date()
    };
    
    setMembers([...members, newMember]);
    setNewMemberName('');
    setShowAddMemberModal(false);
  };
  
  if (!fund) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Chi tiết quỹ',
          headerShown: true,
        }} 
      />
      
      {fund && (
        <ScrollView>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.fundName}>{fund.name}</ThemedText>
            <ThemedView style={styles.fundInfo}>
              <IconSymbol name={fund.icon} size={20} color={fund.iconColor} />
              <ThemedText style={styles.fundType}>
                {getFundTypeLabel(fund.type)}
              </ThemedText>
            </ThemedView>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressText}>
                <ThemedText style={styles.amountText}>{currentAmount.toLocaleString()}đ</ThemedText>
                <ThemedText style={styles.amountText}>{fund.targetAmount.toLocaleString()}đ</ThemedText>
              </View>
              
              <View style={[
                styles.progressBarContainer, 
                { backgroundColor: colorScheme === 'dark' ? '#333333' : '#E5E5E5' }
              ]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${Math.min(100, (currentAmount / fund.targetAmount) * 100)}%`,
                      backgroundColor: '#2563EB' 
                    }
                  ]} 
                />
              </View>
            </View>
            
            <ThemedView style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.withdrawButton, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F5' }]}
                onPress={handleWithdraw}
              >
                <IconSymbol name="cart.fill" size={16} color={colors.text} />
                <ThemedText style={styles.buttonText}>Rút quỹ</ThemedText>
              </TouchableOpacity>
              
              {/* Đảm bảo không có component nào đè lên nút này */}
              <Pressable 
                style={({pressed}) => [
                  styles.button, 
                  styles.contributeButton,
                  pressed && {opacity: 0.8}
                ]}
                onPress={handleContribute}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} // Tăng vùng nhận touch
              >
                <IconSymbol name="dollarsign.circle.fill" size={16} color="#FFFFFF" />
                <ThemedText style={[styles.buttonText, styles.contributeButtonText]}>
                  Góp quỹ
                </ThemedText>
              </Pressable>
            </ThemedView>
            
            {/* Nút chia sẻ đã bị xóa */}
          </ThemedView>
          
          <ThemedView style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'activities' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('activities')}
            >
              <ThemedText 
                style={[
                  styles.tabButtonText, 
                  activeTab === 'activities' && styles.activeTabButtonText
                ]}
              >
                Hoạt động
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'members' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('members')}
            >
              <ThemedText 
                style={[
                  styles.tabButtonText, 
                  activeTab === 'members' && styles.activeTabButtonText
                ]}
              >
                Thành viên
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {activeTab === 'activities' && (
            <ThemedView style={styles.contentContainer}>
              {activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              
              {/* Nút xem thêm đơn giản hóa */}
              <TouchableOpacity 
                style={[
                  styles.viewMoreButton,
                  { 
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F5',
                    borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5' 
                  }
                ]}
                onPress={() => console.log('Xem thêm hoạt động')}
                activeOpacity={0.7}
              >
                <ThemedView style={styles.viewMoreButtonContent}>
                  <ThemedText style={styles.viewMoreButtonText}>Xem thêm</ThemedText>
                  <IconSymbol 
                    name="chevron.right" 
                    size={16} 
                    color={colorScheme === 'dark' ? '#AEAEB2' : '#757575'} 
                  />
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          )}
          
          {activeTab === 'members' && (
            <ThemedView style={styles.membersContainer}>
              {members.map(member => (
                <MemberItem key={member.id} member={member} />
              ))}
              
              <TouchableOpacity 
                style={styles.addMemberButton}
                onPress={() => {
                  console.log('Add member button pressed');
                  setShowAddMemberModal(true);
                }}
              >
                <IconSymbol name="plus" size={16} color="#FFFFFF" />
                <ThemedText style={styles.addMemberButtonText}>
                  Thêm thành viên
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ScrollView>
      )}
      
      {/* Modal thêm thành viên */}
      <Modal
        visible={showAddMemberModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Thêm thành viên</ThemedText>
            
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5',
                  color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF'
                }
              ]}
              placeholder="Nhập tên thành viên..."
              placeholderTextColor={colorScheme === 'dark' ? '#AEAEB2' : '#A9A9A9'}
              value={newMemberName}
              onChangeText={setNewMemberName}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddMemberModal(false)}
              >
                <ThemedText style={styles.buttonText}>Hủy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  if (newMemberName.trim() === '') return;
                  
                  const newMember: Member = {
                    id: `user${members.length + 2}`,
                    name: newMemberName.trim(),
                    role: 'member',
                    joinedAt: new Date()
                  };
                  
                  setMembers([...members, newMember]);
                  setNewMemberName('');
                  setShowAddMemberModal(false);
                }}
              >
                <ThemedText style={[styles.buttonText, styles.addButtonText]}>
                  Thêm
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>

      {/* Modal dialog góp quỹ - đảm bảo nó luôn được render */}
      <Modal
        visible={showContributeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          console.log('Modal closed via back button');
          setShowContributeModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Góp quỹ</ThemedText>
            
            <ThemedText style={styles.modalSubtitle}>
              Nhập số tiền bạn muốn góp vào quỹ
            </ThemedText>
            
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
                placeholder="Nhập số tiền..."
                placeholderTextColor={colorScheme === 'dark' ? '#AEAEB2' : '#A9A9A9'}
                value={contributeAmount}
                onChangeText={formatAmount}
                keyboardType="numeric"
                autoFocus={true} // Tự động focus vào input
              />
              <ThemedText style={styles.currencyText}>đ</ThemedText>
            </View>
            
            {contributeError ? (
              <ThemedText style={styles.errorText}>{contributeError}</ThemedText>
            ) : null}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowContributeModal(false)}
              >
                <ThemedText style={styles.buttonText}>Hủy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmContribute}
              >
                <ThemedText style={[styles.buttonText, styles.confirmButtonText]}>
                  Xác nhận
                </ThemedText>
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
  },
  header: {
    padding: 16,
  },
  fundName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fundType: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  contributeButton: {
    marginLeft: 8,
    backgroundColor: '#2563EB',
  },
  withdrawButton: {
    backgroundColor: '#F0F0F5',
  },
  buttonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  contributeButtonText: {
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabButtonText: {
    fontWeight: '500',
  },
  activeTabButtonText: {
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityRight: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  activityDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  depositAmount: {
    color: '#4CAF50',
  },
  withdrawAmount: {
    color: '#FF6B6B',
  },
  membersContainer: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 12,
    opacity: 0.7,
  },
  memberRight: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  memberJoinDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  addMemberButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  addMemberButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    // Không cần chỉ định backgroundColor ở đây vì ThemedView sẽ tự động
    // sử dụng màu nền từ theme thông qua useThemeColor
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#2563EB',
  },
  addButtonText: {
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 46,
  },
  amountInput: {
    flex: 1,
    height: '100%',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontWeight: '600',
    marginTop: 4,
  },
  activitiesContainer: {
    padding: 16,
  },
  viewMoreButton: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  viewMoreButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  viewMoreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  fundDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  simpleButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  simpleButtonText: {
    fontWeight: '500',
  },
});

// Thêm hàm helper để lấy tên loại quỹ
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





