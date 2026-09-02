import React, { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS } from '../data/products';

const STORAGE_KEY = 'phillipina_price_overrides';

// Load overrides from localStorage
const loadOverrides = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Merge static PRODUCTS with overrides
const mergeProducts = (overrides) =>
  PRODUCTS.map((p) => {
    const o = overrides[p.id];
    if (!o) return p;
    return {
      ...p,
      pouch: o.pouch !== undefined ? o.pouch : p.pouch,
      bottle: o.bottle !== undefined ? o.bottle : p.bottle,
    };
  });

export const PriceContext = createContext(null);

export const PriceProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(loadOverrides);

  // Derived merged products list
  const products = mergeProducts(overrides);

  // Update price for a single product variant ('pouch' | 'bottle')
  const updatePrice = useCallback((productId, variant, newPrice) => {
    setOverrides((prev) => {
      const parsed = parseFloat(newPrice);
      const value = isNaN(parsed) || parsed < 0 ? 0 : parsed;
      const next = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [variant]: value,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Save all price changes for a category at once (batch)
  const saveCategoryPrices = useCallback((updates) => {
    // updates: { [productId]: { pouch?: number, bottle?: number } }
    setOverrides((prev) => {
      const next = { ...prev };
      Object.entries(updates).forEach(([productId, prices]) => {
        next[productId] = { ...prev[productId], ...prices };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Reset a single product to default prices
  const resetProductPrice = useCallback((productId) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[productId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Reset all products in a category to defaults
  const resetCategoryPrices = useCallback((categoryIds) => {
    setOverrides((prev) => {
      const next = { ...prev };
      categoryIds.forEach((id) => delete next[id]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Check if a product has any price override
  const hasOverride = useCallback(
    (productId) => !!overrides[productId],
    [overrides]
  );

  return (
    <PriceContext.Provider
      value={{
        products,
        overrides,
        updatePrice,
        saveCategoryPrices,
        resetProductPrice,
        resetCategoryPrices,
        hasOverride,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

// Convenience hook
export const usePrices = () => {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error('usePrices must be used inside PriceProvider');
  return ctx;
};
