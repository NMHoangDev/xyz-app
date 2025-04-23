import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("sessionToken");
      setIsLoggedIn(!!token);
    };

    checkLogin();
  }, []);

  return { isLoggedIn: false };
};
