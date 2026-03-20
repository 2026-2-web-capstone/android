import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as cartApi from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

function mapCartItems(res) {
  const items = res?.items || [];
  return items.map((item) => ({
    id: item.bookId,
    cartItemId: item.id,
    bookId: item.bookId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
  }));
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCart(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res);
      setCartItems(mapCartItems(res));
    } catch (e) {
      const status = e?.response?.status;
      if (status !== 401 && status !== 403) {
        console.error("Failed to load cart:", e);
      }
      setCartItems([]);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (bookOrBookId, quantity = 1) => {
      const bookId = typeof bookOrBookId === "object" ? bookOrBookId.id : bookOrBookId;
      if (!bookId) return;
      try {
        await cartApi.addCartItem(bookId, quantity);
        await fetchCart();
      } catch (e) {
        throw e;
      }
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(
    async (cartItemIdOrBookId) => {
      const item = cartItems.find(
        (i) => i.cartItemId === cartItemIdOrBookId || i.bookId === cartItemIdOrBookId
      );
      const cartItemId = item ? item.cartItemId : cartItemIdOrBookId;
      try {
        await cartApi.removeCartItem(cartItemId);
        await fetchCart();
      } catch (e) {
        throw e;
      }
    },
    [cartItems, fetchCart]
  );

  const updateQuantity = useCallback(
    async (cartItemIdOrBookId, quantity) => {
      const item = cartItems.find(
        (i) => i.cartItemId === cartItemIdOrBookId || i.bookId === cartItemIdOrBookId
      );
      if (!item) return;
      if (quantity <= 0) {
        await removeFromCart(item.cartItemId);
        return;
      }
      try {
        await cartApi.removeCartItem(item.cartItemId);
        await cartApi.addCartItem(item.bookId, quantity);
        await fetchCart();
      } catch (e) {
        throw e;
      }
    },
    [cartItems, fetchCart, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      for (const item of cartItems) {
        await cartApi.removeCartItem(item.cartItemId);
      }
      await fetchCart();
    } catch (e) {
      throw e;
    }
  }, [cartItems, fetchCart]);

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cartItems,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    getTotalPrice,
    getTotalItems,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
