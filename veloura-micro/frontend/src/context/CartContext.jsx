import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const CartContext = createContext(null);

function getOrCreateCartId() {
  let id = localStorage.getItem("veloura_cart_id");
  if (!id) {
    id =
      crypto.randomUUID?.() ||
      `cart_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("veloura_cart_id", id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [cartId] = useState(getOrCreateCartId);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cart/${cartId}`);
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart:", err.message);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, size, quantity = 1) => {
    const { data } = await api.post(`/cart/${cartId}/add`, { productId, size, quantity });
    setCart(data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${cartId}/update`, { itemId, quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${cartId}/remove/${itemId}`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete(`/cart/${cartId}/clear`);
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal =
    cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        loading,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
