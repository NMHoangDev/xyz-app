import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    if (!username || !name || !email || !password) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập đầy đủ.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        Alert.alert("🎉 Thành công", "Tạo tài khoản thành công!");
        router.replace("/sign-in");
      } else {
        Alert.alert("❌", data.error || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("❌", "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>🚀 Đăng ký tài khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#777"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>✨ Tạo tài khoản</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Đã có tài khoản?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/sign-in")}
          >
            Đăng nhập ngay
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0C0C0F",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#F4F4F5",
    marginBottom: 28,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1A1A1D",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2E2E33",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    backgroundColor: "#4C8BF5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4C8BF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 10,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: "#3B73D8",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footerText: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 15,
    color: "#AAAAAA",
  },
  footerLink: {
    color: "#4C8BF5",
    fontWeight: "700",
  },
});
