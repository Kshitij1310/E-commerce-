import { create } from "zustand";

export const useCartStore = create((set, get) => ({

  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
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
}));
