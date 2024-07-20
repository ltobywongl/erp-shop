"use client";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
} from "react";

const cartContext = createContext<{
  cart: Item[];
  setcart: (cart: Item[]) => void;
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
  addQuantity: (item: Item) => void;
  reduceQuantity: (item: Item) => void;
}>({
  cart: [],
  setcart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  addQuantity: () => {},
  reduceQuantity: () => {},
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") ?? "[]");
    if (cartData) {
      setCart(cartData);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && loaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const addQuantity = (item: Item) => {
    setCart((c) => {
      const existingItem = c.find((i) => i.id === item.id);
      if (existingItem) {
        return c.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        return [...c, { ...item, quantity: 1 }];
      }
    });
  };

  const reduceQuantity = (item: Item) => {
    setCart((c) => {
      const existingItem = c.find((i) => i.id === item.id);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          return [...c].filter((i) => i.id !== item.id);
        }
        return [...c].map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
      } else {
        return [...c];
      }
    });
  };

  const addToCart = (item: Item) => {
    item.image = item.image ? item.image : "/images/fallback.png";
    setCart((c) => {
      const existingItem = c.find((i) => i.id === item.id);
      if (existingItem) {
        return c.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        return [...c, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item: Item) => {
    setCart((c) => c.filter((i) => i.id !== item.id));
  };

  return (
    <cartContext.Provider
      value={{
        cart: cart,
        setcart: setCart,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        addQuantity: addQuantity,
        reduceQuantity: reduceQuantity,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  return useContext(cartContext);
};
