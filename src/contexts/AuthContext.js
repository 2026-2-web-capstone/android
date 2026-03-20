import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authApi from "../api/auth";
import { getStoredAccessToken } from "../api/client";

const USER_STORAGE_KEY = "user";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

function userFromResponse(res) {
  if (!res) return null;
  return {
    id: res.id,
    email: res.email,
    username: res.username,
    name: res.name,
    phone: res.phone || "",
    role: (res.role || "").toLowerCase(),
    status: res.status,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = await getStoredAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      setUser(userFromResponse(me));
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userFromResponse(me)));
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 401 && status !== 403) {
        console.error("Failed to load user:", err);
      }
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const result = await authApi.signin(email, password);
    const inner = result.data || result;
    const u = inner.user ? userFromResponse(inner.user) : userFromResponse(inner);
    setUser(u);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    return { success: true, user: u };
  };

  const register = async (email, password, name, username, phone) => {
    await authApi.signup({
      email,
      password,
      name,
      username: username || email?.split("@")[0] || name,
      phone: phone || "010-0000-0000",
    });
    const result = await authApi.signin(email, password);
    const inner = result.data || result;
    const u = inner.user ? userFromResponse(inner.user) : userFromResponse(inner);
    setUser(u);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    return { success: true, user: u };
  };

  const logout = async () => {
    try {
      await authApi.signout();
    } catch (e) {
      console.warn("Signout error:", e);
    }
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateUser = async (userData) => {
    const updated = await authApi.updateMe({
      name: userData.name,
      phone: userData.phone ?? user?.phone,
    });
    const u = userFromResponse(updated);
    setUser(u);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
  };

  const deleteMe = async () => {
    await authApi.deleteMe();
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    deleteMe,
    loadUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
