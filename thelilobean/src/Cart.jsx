import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

function getItemKey(item) {
  const sortedSelections = Object.keys(item.selections ?? {})
    .sort()
    .reduce((acc, k) => ({ ...acc, [k]: item.selections[k] }), {});
  return JSON.stringify({
    slug: item.slug,
    size: item.size ?? null,
    selections: sortedSelections,
    shots: item.shots ?? 0,
  });
}

/* ============================================================
   CART PROVIDER
   Wrap your <Routes> (or the whole app) in this once, in
   main.jsx or App.jsx, so every page can read/update the cart.
   ============================================================ */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // item: { slug, name, imageUrl, size, selections, shots, quantity }
  // If an item with the same slug/size/selections/shots already exists,
  // bump its quantity instead of adding a duplicate card.
  const addItem = (item) => {
    setItems((prev) => {
      const key = getItemKey(item);
      const existingIndex = prev.findIndex((i) => getItemKey(i) === key);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity ?? 1),
        };
        return updated;
      }

      return [...prev, { id: crypto.randomUUID(), quantity: 1, ...item }];
    });
  };

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        updateQuantity,
        removeItem,
        clearCart,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a <CartProvider>');
  return ctx;
}
