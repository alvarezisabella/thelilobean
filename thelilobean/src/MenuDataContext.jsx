// src/MenuDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchDrinks, fetchCustomizeCategories } from './drinks';

const MenuDataContext = createContext(null);

/* ============================================================
   MENU DATA PROVIDER
   Fetches the menu (drinks) and the customization dropdowns from
   Supabase ONCE when the app loads, then shares them with every
   page. Wrap your <Routes> in this, next to <CartProvider>.
   ============================================================ */
export function MenuDataProvider({ children }) {
  const [drinks, setDrinks] = useState({});
  const [customizeCategories, setCustomizeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchDrinks(), fetchCustomizeCategories()])
      .then(([drinksData, categoriesData]) => {
        if (cancelled) return;
        setDrinks(drinksData);
        setCustomizeCategories(categoriesData);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load menu data:', err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MenuDataContext.Provider value={{ drinks, customizeCategories, loading, error }}>
      {children}
    </MenuDataContext.Provider>
  );
}

export function useMenuData() {
  const ctx = useContext(MenuDataContext);
  if (!ctx) throw new Error('useMenuData must be used within a <MenuDataProvider>');
  return ctx;
}
