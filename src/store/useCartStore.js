import { create } from "zustand";

const getCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  cartItems: getCartFromStorage(),
  addToCart: (item) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (c) => c.id === item.id
    );
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((c) =>
        c.id === item.id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cartItems: updatedCart });
  },

  removeFromCart: (item) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (c) => c.id === item.id
    );
    if (!existingItem) return;

    let updatedCart;
    if (existingItem.quantity > 1) {
      updatedCart = cartItems.map((c) =>
        c.id === item.id
          ? { ...c, quantity: c.quantity - 1 }
          : c
      );
    } else {
      updatedCart = cartItems.filter(
        (c) => c.id !== item.id
      );
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cartItems: updatedCart });
  },

  
  removeItem: (item) => {
    const { cartItems } = get();

    const updatedCart = cartItems.filter(
      (c) => c.id !== item.id
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cartItems: updatedCart });
  },

  clearCart: () => {
    localStorage.setItem("cart", JSON.stringify([]));
    set({ cartItems: [] });
  },
}));
