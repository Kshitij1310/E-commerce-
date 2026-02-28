
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });


const addToCart = (item) => {
  setCartItems((cart) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItem) {
      return cart.map((cartItem) =>
        cartItem.id === item.id  
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    }
    return [...cart, { ...item, quantity: 1 }];
  });
};

const removefromCart = (item) => {
  setCartItems((cart) => {
    const cartItem = cart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (!cartItem) return cart;

    if (cartItem.quantity > 1) {
      return cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    }
    return cart.filter(
      (cartItem) => cartItem.id !== item.id
    );
  });
};

const removeItem = (item) => {
  setCartItems((cart) =>
    cart.filter((cartItem) => cartItem.id !== item.id)
  );
};


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);





  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removefromCart, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};



export default CartProvider;



