import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { BookProvider } from "./src/contexts/BookContext";
import { CartProvider } from "./src/contexts/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </CartProvider>
        </BookProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
