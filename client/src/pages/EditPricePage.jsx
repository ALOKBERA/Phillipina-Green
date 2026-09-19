import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, SECTIONS } from '../data/products';
import { usePrices } from '../context/PriceContext';

// Find the SECTIONS entry that matches a given category string
const getSectionForCategory = (category) =>
  SECTIONS.find((s) =>
    PRODUCTS.filter((p) => p.category === category).some((p) => s.ids.includes(p.id))
  );

export const EditPricePage = ({ category, onBack }) => {
  const { products, saveCategoryPrices, hasOverride } = usePrices();

  // Products belonging to this category (use merged prices as initial values)
  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category]
  );

  // Local draft state — keys are productId, values are { pouch, bottle }
  const [draft, setDraft] = useState(() => {
    const init = {};
    categoryProducts.forEach((p) => {
      init[p.id] = {
        pouch: p.pouch !== null ? String(p.pouch) : '',
        bottle: p.bottle !== null ? String(p.bottle) : '',
      };
    });
    return init;
  });

  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update draft if remote products change and user hasn't typed anything yet
  useEffect(() => {
    if (!hasUserEdited) {
      const init = {};
      categoryProducts.forEach((p) => {
        init[p.id] = {
          pouch: p.pouch !== null ? String(p.pouch) : '',
          bottle: p.bottle !== null ? String(p.bottle) : '',
        };
      });
      setDraft(init);
    }
  }, [categoryProducts, hasUserEdited]);

  const sectionLabel =
    getSectionForCategory(category)?.label ||
    category;

  const handleChange = (productId, variant, value) => {
    // Allow empty string or positive numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setHasUserEdited(true);
      setDraft((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], [variant]: value },
      }));
      setSaved(false);
      setErrorMsg('');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      const updates = {};
      categoryProducts.forEach((p) => {
        const d = draft[p.id];
        updates[p.id] = {};
        if (p.pouch !== null) {
          updates[p.id].pouch = d.pouch === '' ? 0 : parseFloat(d.pouch) || 0;
        }
        if (p.bottle !== null) {
          updates[p.id].bottle = d.bottle === '' ? 0 : parseFloat(d.bottle) || 0;
        }
      });

      await saveCategoryPrices(updates);
      setSaved(true);
      setHasUserEdited(false);
    } catch (err) {
      console.error('Error saving prices:', err);
      setErrorMsg('ભાવ સેવ કરવામાં ભૂલ આવી. ફરી પ્રયાસ કરો. / Failed to save prices. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack} id="edit-price-back-btn">
          ← પાછા / Back
        </button>
        <div style={styles.headerCenter}>
          <span style={styles.headerTitle}>✏️ ભાવ સંપાદિત કરો</span>
          <span style={styles.headerSub}>Edit Prices</span>
        </div>
        {/* Balanced spacer for centered title (no reset button) */}
        <div style={{ width: '65px' }} />
      </div>

      {/* Category Label */}
      <div style={styles.categoryBanner}>
        <span style={styles.categoryLabel}>{sectionLabel}</span>
      </div>

      {/* Info note */}
      <div style={styles.infoNote}>
        💡 ભાવ બદલ્યા પછી <strong>Save</strong> દબાવો. ભાવ ડેટાબેઝમાં કાયમ માટે સેવ થશે અને બધા ડિવાઇસ પર દેખાશે.
      </div>

      {/* Table header */}
      <div style={styles.tableHeader}>
        <span style={{ flex: 2 }}>પ્રોડક્ટ / Product</span>
        <span style={styles.variantHeader}>પાઉચ ₹</span>
        <span style={styles.variantHeader}>બોટલ ₹</span>
      </div>

      {/* Product rows */}
      <div style={styles.list}>
        {categoryProducts.map((p) => {
          const isOverridden = hasOverride(p.id);
          return (
            <div
              key={p.id}
              style={{ ...styles.row, ...(isOverridden ? styles.overriddenRow : {}) }}
            >
              {/* Product name */}
              <div style={styles.nameCol}>
                <span style={styles.nameGu}>{p.gu}</span>
                <span style={styles.nameEn}>{p.en}</span>
                {isOverridden && <span style={styles.overrideBadge}>✏️ edited</span>}
              </div>

              {/* Pouch price input */}
              <div style={styles.inputCol}>
                {p.pouch !== null ? (
                  <div style={styles.inputWrapper}>
                    <span style={styles.rupee}>₹</span>
                    <input
                      id={`price-pouch-${p.id}`}
                      type="number"
                      min="0"
                      value={draft[p.id]?.pouch ?? ''}
                      onChange={(e) => handleChange(p.id, 'pouch', e.target.value)}
                      style={styles.input}
                      placeholder="—"
                      disabled={isSaving}
                    />
                  </div>
                ) : (
                  <span style={styles.na}>—</span>
                )}
              </div>

              {/* Bottle price input */}
              <div style={styles.inputCol}>
                {p.bottle !== null ? (
                  <div style={styles.inputWrapper}>
                    <span style={styles.rupee}>₹</span>
                    <input
                      id={`price-bottle-${p.id}`}
                      type="number"
                      min="0"
                      value={draft[p.id]?.bottle ?? ''}
                      onChange={(e) => handleChange(p.id, 'bottle', e.target.value)}
                      style={styles.input}
                      placeholder="—"
                      disabled={isSaving}
                    />
                  </div>
                ) : (
                  <span style={styles.na}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save footer */}
      <div style={styles.footer}>
        {errorMsg && (
          <span style={styles.errorMsg}>{errorMsg}</span>
        )}
        {saved && (
          <span style={styles.savedMsg}>✅ ભાવ કાયમ માટે સેવ થઈ ગયા! / Prices permanently saved!</span>
        )}
        <button
          id="edit-price-save-btn"
          style={{
            ...styles.saveBtn,
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '⏳ સેવ થઈ રહ્યું છે... / Saving...' : '💾 Save Prices'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '600px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: 'var(--gray-light)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--green-dark)',
    padding: '14px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '10px',
    padding: '7px 12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.72rem',
    fontWeight: '500',
  },
  categoryBanner: {
    backgroundColor: 'var(--green-mid)',
    padding: '10px 16px',
  },
  categoryLabel: {
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  infoNote: {
    margin: '12px 16px 4px',
    backgroundColor: 'var(--gold-light)',
    border: '1.5px solid #ffe082',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.78rem',
    color: '#7c4f00',
    fontWeight: '500',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: 'var(--green-light)',
    borderBottom: '2px solid var(--green-accent)',
    fontSize: '0.72rem',
    fontWeight: '800',
    color: 'var(--green-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    gap: '8px',
  },
  variantHeader: {
    width: '88px',
    textAlign: 'center',
    flexShrink: 0,
  },
  list: {
    flex: 1,
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    paddingBottom: '110px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1.5px solid var(--gray-border)',
    padding: '12px 14px',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  overriddenRow: {
    borderColor: 'var(--green-accent)',
    backgroundColor: '#f0fdf4',
  },
  nameCol: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  nameGu: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    lineHeight: 1.3,
  },
  nameEn: {
    fontSize: '0.72rem',
    color: 'var(--text-light)',
    marginTop: '1px',
  },
  overrideBadge: {
    fontSize: '0.62rem',
    color: 'var(--green-mid)',
    fontWeight: '700',
    marginTop: '3px',
  },
  inputCol: {
    width: '88px',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--gray-light)',
    border: '1.5px solid var(--gray-border)',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '80px',
  },
  rupee: {
    padding: '0 4px 0 6px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--green-mid)',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    padding: '8px 4px 8px 0',
    fontFamily: 'inherit',
    MozAppearance: 'textfield',
  },
  na: {
    color: '#ccc',
    fontSize: '0.85rem',
    textAlign: 'center',
    width: '100%',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderTop: '2px solid var(--green-light)',
    padding: '14px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 200,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  },
  savedMsg: {
    fontSize: '0.82rem',
    color: 'var(--green-mid)',
    fontWeight: '700',
    animation: 'fadeIn 0.3s ease',
  },
  errorMsg: {
    fontSize: '0.82rem',
    color: '#dc2626',
    fontWeight: '700',
    textAlign: 'center',
  },
  saveBtn: {
    width: '100%',
    backgroundColor: 'var(--green-mid)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '0.95rem',
    fontWeight: '800',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
};

export default EditPricePage;
