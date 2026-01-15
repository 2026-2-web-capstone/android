import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // AsyncStorage에서 장바구니 불러오기
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // 장바구니 변경 시 AsyncStorage에 저장
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem("cart", JSON.stringify(cartItems)).catch((error) => {
        console.error("Failed to save cart:", error);
      });
    }
  }, [cartItems, isLoading]);

  const addToCart = (book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...book, quantity }];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
