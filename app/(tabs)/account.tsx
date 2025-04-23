import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Platform, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AccountScreen() {
  // Khai báo state để lưu thông tin người dùng
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "https://i.pravatar.cc/150?img=3", // Mặc định là avatar mẫu
  });

  // Lấy dữ liệu người dùng từ AsyncStorage khi màn hình được render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData({
            fullName: user.name || "Người dùng", // Nếu không có tên thì hiển thị "Người dùng"
            email: user.email || "Chưa có email",
            phone: user.phone || "Chưa có số điện thoại",
            avatar: user.avatar || "https://i.pravatar.cc/150?img=3", // Nếu không có avatar thì dùng ảnh mẫu
          });
        }
      } catch (e) {
        console.error("Failed to load user data:", e);
      }
    };

    loadUserData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Tài khoản</ThemedText>
      </ThemedView>

      {/* Avatar */}
      <ThemedView style={styles.avatarContainer}>
        <Image
          source={{ uri: userData.avatar }} // Hiển thị ảnh avatar từ dữ liệu
          style={styles.avatar}
        />
      </ThemedView>

      {/* Account Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Họ và tên</ThemedText>
          <ThemedText style={styles.accountValue}>
            {userData.fullName}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Email</ThemedText>
          <ThemedText style={styles.accountValue}>{userData.email}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.accountItem}>
          <ThemedText style={styles.accountLabel}>Số điện thoại</ThemedText>
          <ThemedText style={styles.accountValue}>{userData.phone}</ThemedText>
        </ThemedView>

        <TouchableOpacity style={styles.button}>
          <ThemedText
            style={styles.buttonText}
            onPress={() => {
              router.replace("/(auths)/sign-in"); // Đăng xuất và chuyển hướng về trang đăng nhập
            }}
          >
            Đăng xuất
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  accountItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  accountLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
