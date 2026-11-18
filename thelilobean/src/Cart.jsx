import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabaseClient';

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

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const userIdRef = useRef(null);
  const lastSavedRef = useRef('[]'); // avoids re-saving what we just loaded

  // LOAD: only if the visitor already has a session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          userIdRef.current = session.user.id;
          const { data } = await supabase
            .from('carts')
            .select('items')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (!cancelled && data?.items) {
            lastSavedRef.current = JSON.stringify(data.items);
            setItems(data.items);
          }
        }
      } catch (e) {
        console.error('Cart load failed', e);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // SAVE: debounced, and only after the load has finished
  useEffect(() => {
    if (!loaded) return;
    const serialized = JSON.stringify(items);
    if (serialized === lastSavedRef.current) return;

    const timer = setTimeout(async () => {
      try {
        let uid = userIdRef.current;
        if (!uid) {
          if (items.length === 0) return; // don't create a user for an empty cart
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          uid = data.user.id;
          userIdRef.current = uid;
        }
        const { error } = await supabase.from('carts').upsert({
          user_id: uid,
          items,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        lastSavedRef.current = serialized;
      } catch (e) {
        console.error('Cart save failed', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [items, loaded]);

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
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;

      const updated = { ...target, ...updates };
      const key = getItemKey(updated);

      // Different card that is now identical
      const twin = prev.find((i) => i.id !== id && getItemKey(i) === key);

      // No twin: just update the card in place
      if (!twin) {
        return prev.map((i) => (i.id === id ? updated : i));
      }

      // Twin found: add the twin's quantity, remove the twin
      return prev
        .filter((i) => i.id !== twin.id)
        .map((i) =>
          i.id === id ? { ...updated, quantity: updated.quantity + twin.quantity } : i
        );
    });
  };

  const updateQuantity = (id, quantity) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items, loaded,
        addItem, updateItem, updateQuantity, removeItem, clearCart,
        paymentMethod, setPaymentMethod,
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