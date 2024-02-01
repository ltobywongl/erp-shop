"use client";
import React, { useContext, createContext, useState } from "react";

const CartContext = createContext<{
  cart: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
} | null>(null);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Item[]>(
    JSON.parse(localStorage.getItem("ERP-Shop-Cart") ?? "[]")
  );

  const addToCart = (item: Item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("ERP-Shop-Cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("ERP-Shop-Cart", JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  return useContext(CartContext);
};
