import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import api from '../api/axios';

const STORAGE_KEY = 'phillipina_price_overrides';

// Load overrides from localStorage as immediate cache
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
      pouch: o.pouch !== undefined && o.pouch !== null ? o.pouch : p.pouch,
      bottle: o.bottle !== undefined && o.bottle !== null ? o.bottle : p.bottle,
    };
  });

export const PriceContext = createContext(null);

export const PriceProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(loadOverrides);
  const [loading, setLoading] = useState(false);

  // Derived merged products list
  const products = mergeProducts(overrides);

  // Fetch prices permanently stored in database and auto-sync any device-local overrides
  const fetchPrices = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await api.get('/api/prices');
      if (res.data?.success && res.data?.prices) {
        const serverPrices = res.data.prices;
        const localOverrides = loadOverrides();

        // Check if this device has custom prices in local storage not yet in database (e.g. friend's phone)
        const pendingSync = {};
        let hasLocalChanges = false;

        Object.entries(localOverrides).forEach(([id, localPrice]) => {
          if (!localPrice || typeof localPrice !== 'object') return;
          const serverPrice = serverPrices[id];

          if (!serverPrice) {
            pendingSync[id] = localPrice;
            hasLocalChanges = true;
          } else {
            const pouchDiff =
              localPrice.pouch !== undefined &&
              localPrice.pouch !== null &&
              localPrice.pouch !== serverPrice.pouch;
            const bottleDiff =
              localPrice.bottle !== undefined &&
              localPrice.bottle !== null &&
              localPrice.bottle !== serverPrice.bottle;

            if (pouchDiff || bottleDiff) {
              pendingSync[id] = { ...serverPrice, ...localPrice };
              hasLocalChanges = true;
            }
          }
        });

        if (hasLocalChanges && Object.keys(pendingSync).length > 0) {
          try {
            // Auto-upload the phone's custom prices to MongoDB so they reflect everywhere
            const syncRes = await api.put('/api/prices', { updates: pendingSync });
            if (syncRes.data?.success && syncRes.data?.prices) {
              const finalMerged = syncRes.data.prices;
              setOverrides(finalMerged);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(finalMerged));
              return;
            }
          } catch (syncErr) {
            console.warn('Auto-sync of local overrides to server failed:', syncErr);
          }
        }

        // Update state and cache with database prices
        setOverrides(serverPrices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverPrices));
      }
    } catch (err) {
      console.warn('Could not fetch prices from server, using cached prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Permanently save all price changes for a category to the MongoDB database
  const saveCategoryPrices = useCallback(async (updates) => {
    // updates: { [productId]: { pouch?: number, bottle?: number } }
    try {
      const res = await api.put('/api/prices', { updates });
      if (res.data?.success && res.data?.prices) {
        const permanentPrices = res.data.prices;
        setOverrides(permanentPrices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(permanentPrices));
        return permanentPrices;
      }
    } catch (error) {
      console.error('Failed to permanently save prices to database:', error);
      throw error;
    }
  }, []);

  // Check if a product has any custom price override
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
        fetchPrices,
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
