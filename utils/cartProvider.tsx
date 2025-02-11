"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import { useModal } from "@/utils/modalProvider";
import { useToast } from "@/hooks/use-toast";

const cartContext = createContext<{
  cart: Item[];
  setcart: (cart: Item[]) => void;
  addQuantity: (item: Item) => void;
  reduceQuantity: (item: Item) => void;
}>({
  cart: [],
  setcart: () => {},
  addQuantity: () => {},
  reduceQuantity: () => {},
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { showModal } = useModal();
  const { toast } = useToast();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") ?? "[]");
    if (cartData) {
      setCart(cartData);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const checkAndUpdateCart = async () => {
      const nextCheckTime = localStorage.getItem("nextCheckTime");
      const currentTime = new Date().getTime();

      if (!nextCheckTime || currentTime > Number(nextCheckTime)) {
        try {
          const validatedCart = await validateCart(cart);
          setCart(validatedCart);
          localStorage.setItem(
            "nextCheckTime",
            String(currentTime + 10 * 60 * 1000) // 10 mins
          );
        } catch (error) {
          console.error("Failed to validate cart:", error);
        }
      }
    };
    if (typeof window !== "undefined" && loaded) {
      checkAndUpdateCart();
    }
  }, [loaded, cart]);

  useEffect(() => {
    if (typeof window !== "undefined" && loaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const validateCart = async (cart: Item[]) => {
    const response = await fetch("/api/validate-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (response.ok) {
      const validatedCart = await response.json();
      return validatedCart.body;
    } else {
      throw new Error("Failed to validate cart");
    }
  };

  const addQuantity = React.useCallback(
    (item: Item) => {
      let added = false;
      setCart((c) => {
        const existingItem = c.find((i) => i.id === item.id);
        if (existingItem) {
          return c.map((i) => {
            if (i.id === item.id) {
              if (i.useStock && i.quantity + 1 > i.stock) {
                return i;
              }
              added = true;
              return { ...i, quantity: (i.quantity || 1) + 1 };
            } else return i;
          });
        } else {
          item.image = item.image ? item.image : "/images/fallback.png";
          added = true;
          return [...c, { ...item, quantity: 1 }];
        }
      });
      toast({
        title: added ? "已添加至購物車" : "無法添加商品",
        variant: added ? "default" : "destructive",
      });
    },
    [toast]
  );

  const reduceQuantity = React.useCallback(
    (item: Item) => {
      const c = [...cart];
      const existingItem = c.find((i) => i.id === item.id);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          showModal("Remove Item?", "", true, () =>
            setCart([...c].filter((i) => i.id !== item.id))
          );
        } else {
          setCart(
            c.map((i) =>
              i.id === item.id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
            )
          );
        }
      } else {
        return c;
      }
    },
    [cart, showModal]
  );

  const value = React.useMemo(
    () => ({
      cart: cart,
      setcart: setCart,
      addQuantity: addQuantity,
      reduceQuantity: reduceQuantity,
    }),
    [addQuantity, cart, reduceQuantity]
  );

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
};

export default CartProvider;

export const useCart = () => {
  return useContext(cartContext);
};
