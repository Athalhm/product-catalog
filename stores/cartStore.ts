import { create } from "zustand";
import type { CartItem, Product } from "@/types/product";

export interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

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

export const useCartStore = create<CartState>()((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const alreadyInCart = state.items.some(
        (item) => item.product.id === product.id
      );

      if (alreadyInCart) {
        return { items: updateQuantity(state.items, product.id, 1) };
      }
      if (product.stock < 1) return state;

      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  increaseQuantity: (productId) =>
    set((state) => ({
      items: updateQuantity(state.items, productId, 1),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      items: updateQuantity(state.items, productId, -1),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
}));

export const selectTotalItems = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state: CartState): number =>
  state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );