"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types/product";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function updateQuantity(
  items: CartItem[],
  productId: number,
  change: number
): CartItem[] {
  return items.map((item) => {
    if (item.product.id !== productId) return item;

    const nextQuantity = item.quantity + change;
    const limited = Math.min(nextQuantity, item.product.stock);
    const safeQuantity = Math.max(limited, 1);

    return { ...item, quantity: safeQuantity };
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems((current) => {
      const alreadyInCart = current.some(
        (item) => item.product.id === product.id
      );

      if (alreadyInCart) return updateQuantity(current, product.id, 1);
      if (product.stock < 1) return current;

      return [...current, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setItems((current) => updateQuantity(current, productId, 1));
  };

  const decreaseQuantity = (productId: number) => {
    setItems((current) => updateQuantity(current, productId, -1));
  };

  const removeFromCart = (productId: number) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== productId)
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }

  return context;
}