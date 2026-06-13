import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findMenuItem } from '../services/menuService';
import { getRewardPoints } from '../services/currencyService';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'boehm-cart';
const TAX_RATE = 0.05;
const SERVICE_FEE = 18;
const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 799;

const readStoredCart = () => {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    return parsedCart
      .map((item) => {
        const currentMenuItem = findMenuItem(item.id);
        return currentMenuItem ? { ...currentMenuItem, quantity: item.quantity } : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    const nextQuantity = Number(quantity);

    if (nextQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.min(nextQuantity, 12) } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee =
      subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const serviceFee = subtotal > 0 ? SERVICE_FEE : 0;
    const total = subtotal + tax + deliveryFee + serviceFee;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const rewardPoints = getRewardPoints(subtotal);

    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      tax,
      deliveryFee,
      serviceFee,
      total,
      itemCount,
      rewardPoints,
      freeDeliveryRemaining: Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
