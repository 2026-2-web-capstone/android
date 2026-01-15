import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AsyncStorage에서 사용자 정보 불러오기
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    // 간단한 Mock 로그인 (실제로는 API 호출)
    const mockUser = {
      id: 1,
      email,
      name: email.split("@")[0],
      role: email === "admin@example.com" ? "admin" : "user",
    };
    setUser(mockUser);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const register = async (email, password, name) => {
    // 간단한 Mock 회원가입
    const newUser = {
      id: Date.now(),
      email,
      name,
      role: "user",
    };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateUser = async (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
