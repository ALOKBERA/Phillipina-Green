import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import api from '../api/axios';

const STORAGE_KEY = 'phillipina_price_overrides';

// Load overrides from localStorage as immediate cache for instant rendering
const loadOverrides = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Merge static PRODUCTS with database / cached overrides
const mergeProducts = (overrides) =>
  PRODUCTS.map((p) => {
    const o = overrides[p.id];
    if (!o) return p;
    return {
      ...p,
      pouch: o.pouch !== undefined && o.pouch !== null ? Number(o.pouch) : p.pouch,
      bottle: o.bottle !== undefined && o.bottle !== null ? Number(o.bottle) : p.bottle,
    };
  });

export const PriceContext = createContext(null);

export const PriceProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(loadOverrides);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Derived merged products list
  const products = mergeProducts(overrides);

  // Directly get the active unit price for a given product and variant
  const getProductPrice = useCallback(
    (productId, variant) => {
      const o = overrides[productId];
      if (o) {
        const val = variant === 'pouch' ? o.pouch : o.bottle;
        if (val !== undefined && val !== null) {
          return Number(val);
        }
      }
      const p = PRODUCTS.find((x) => x.id === productId);
      if (!p) return 0;
      const fallback = variant === 'pouch' ? p.pouch : p.bottle;
      return fallback !== null && fallback !== undefined ? Number(fallback) : 0;
    },
    [overrides]
  );

  // Fetch latest prices directly from MongoDB database (MongoDB is the Single Source of Truth)
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent aggressive browser/HTTP caching on mobile browsers
      const res = await api.get(`/api/prices?_t=${Date.now()}`);
      if (res.data?.success && res.data?.prices) {
        const serverPrices = res.data.prices;
        setOverrides(serverPrices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverPrices));
        setLastUpdated(Date.now());
      }
    } catch (err) {
      console.warn('Could not fetch prices from server, using cached prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial fetch on mount
    fetchPrices();

    // 2. Re-fetch when user switches back to this tab/app on mobile phone
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPrices();
      }
    };
    const handleFocus = () => {
      fetchPrices();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPrices]);

  // Permanently save price changes for a category to the MongoDB database
  const saveCategoryPrices = useCallback(async (updates) => {
    try {
      const res = await api.put('/api/prices', { updates });
      if (res.data?.success && res.data?.prices) {
        const permanentPrices = res.data.prices;
        setOverrides(permanentPrices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(permanentPrices));
        setLastUpdated(Date.now());
        return permanentPrices;
      }
    } catch (error) {
      console.error('Failed to permanently save prices to database:', error);
      throw error;
    }
  }, []);

  // Check if a product has any custom price in database
  const hasOverride = useCallback(
    (productId) => {
      const o = overrides[productId];
      return !!(o && (o.pouch !== null || o.bottle !== null));
    },
    [overrides]
  );

  return (
    <PriceContext.Provider
      value={{
        products,
        overrides,
        loading,
        lastUpdated,
        fetchPrices,
        getProductPrice,
        saveCategoryPrices,
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
