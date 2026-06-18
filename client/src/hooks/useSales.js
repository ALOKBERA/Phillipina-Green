import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export const useSales = (sessionInfo) => {
  const [salesRecord, setSalesRecord] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimers = useRef({});

  // Fetch today's sales record
  const fetchTodayRecord = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/sales/today');
      setSalesRecord(res.data);
      
      // Initialize quantities map
      const qtyMap = {};
      res.data.items.forEach((item) => {
        const key = item.flavour ? `${item.productId}_${item.flavour}` : item.productId;
        if (!qtyMap[key]) {
          qtyMap[key] = { pouch: 0, bottle: 0 };
        }
        qtyMap[key][item.variant] = item.quantity;
      });
      setQuantities(qtyMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching today record:', err);
      setError('વેચાણ માહિતી મેળવવામાં તકલીફ પડી.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayRecord();
    
    // Clear debounce timers on unmount
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Modify quantity locally & trigger debounced server update
  const updateQuantity = (product, variant, delta, flavour) => {
    const pId = product.id;
    const selectedFlavour = flavour || '';
    const key = selectedFlavour ? `${pId}_${selectedFlavour}` : pId;
    const currentQty = quantities[key]?.[variant] || 0;
    const newQty = Math.max(0, currentQty + delta);

    // 1. Update local quantities immediately for high-responsiveness
    setQuantities((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [variant]: newQty,
      },
    }));

    // 2. Debounce backend PATCH request
    const debounceKey = `${key}_${variant}`;
    if (debounceTimers.current[debounceKey]) {
      clearTimeout(debounceTimers.current[debounceKey]);
    }

    debounceTimers.current[debounceKey] = setTimeout(async () => {
      try {
        const unitPrice = variant === 'pouch' ? product.pouch : product.bottle;
        const flavourObj = product.flavours?.find((f) => f.id === selectedFlavour);
        const nameGu = flavourObj ? `${product.gu} (${flavourObj.gu})` : product.gu;
        const nameEn = flavourObj ? `${product.en} (${flavourObj.en})` : product.en;

        const payload = {
          productId: pId,
          nameGu,
          nameEn,
          variant,
          unitPrice,
          quantity: newQty,
          session: sessionInfo.session || 'evening', // default fallback for safety
          flavour: selectedFlavour,
        };

        const res = await api.patch('/api/sales/today', payload);
        
        // Update database state
        setSalesRecord(res.data);
        setError(null);
      } catch (err) {
        console.error('Error saving quantity to server:', err);
        setError('સર્વર પર માહિતી સંગ્રહ થઈ શકી નથી.');
        // Revert local quantities on failure
        fetchTodayRecord();
      }
    }, 300);
  };

  // Remove an item entirely from the bill (sets quantity to 0 immediately)
  const removeItem = async (item, variant) => {
    const pId = item.productId || item.id;
    const selectedFlavour = item.flavour || '';
    const key = selectedFlavour ? `${pId}_${selectedFlavour}` : pId;
    const debounceKey = `${key}_${variant}`;
    if (debounceTimers.current[debounceKey]) {
      clearTimeout(debounceTimers.current[debounceKey]);
    }

    // Update locally
    setQuantities((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [variant]: 0,
      },
    }));

    try {
      const payload = {
        productId: pId,
        nameGu: item.nameGu,
        nameEn: item.nameEn,
        variant,
        unitPrice: item.unitPrice,
        quantity: 0,
        session: sessionInfo.session || 'evening',
        flavour: selectedFlavour,
      };
      const res = await api.patch('/api/sales/today', payload);
      setSalesRecord(res.data);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('આઇટમ દૂર કરી શકાઈ નથી.');
      fetchTodayRecord();
    }
  };

  // Clear all quantities in today's record (confirm action first on client)
  const clearAll = async () => {
    setLoading(true);
    try {
      // Loop over items and set their quantities to 0
      if (salesRecord && salesRecord.items.length > 0) {
        for (const item of salesRecord.items) {
          const payload = {
            productId: item.productId,
            nameGu: item.nameGu,
            nameEn: item.nameEn,
            variant: item.variant,
            unitPrice: item.unitPrice,
            quantity: 0,
            session: item.session,
            flavour: item.flavour || '',
          };
          await api.patch('/api/sales/today', payload);
        }
      }
      await fetchTodayRecord();
    } catch (err) {
      console.error('Error clearing record:', err);
      setError('બધો ડેટા સાફ થઈ શક્યો નથી.');
      setLoading(false);
    }
  };

  return {
    salesRecord,
    quantities,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearAll,
    refreshRecord: fetchTodayRecord,
  };
};
