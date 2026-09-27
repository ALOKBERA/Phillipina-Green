import React, { useState } from 'react';
import { usePrices } from '../../context/PriceContext';
import QtyControl from '../ui/QtyControl';

export const ProductCard = ({ product, quantities = {}, onUpdateQty, disabled = false }) => {
  const { products: mergedProducts } = usePrices();
  // Use merged product (with any price overrides applied)
  const mergedProduct = mergedProducts.find((p) => p.id === product.id) || product;

  const [selectedFlavour, setSelectedFlavour] = useState(
    product.flavours ? product.flavours[0].id : ''
  );

  const key = product.flavours ? `${product.id}_${selectedFlavour}` : product.id;
  const flavourQuantities = quantities[key] || {};

  const pouchQty = flavourQuantities.pouch || 0;
  const bottleQty = flavourQuantities.bottle || 0;
  const hasQty = pouchQty > 0 || bottleQty > 0;

  const hasPouch = mergedProduct.pouch !== null;
  const hasBottle = mergedProduct.bottle !== null;

  return (
    <div style={{ ...styles.card, ...(hasQty ? styles.activeCard : {}) }}>
      <div style={styles.details}>
        <span style={styles.nameGu}>{product.gu}</span>
        <span style={styles.nameEn}>
          {product.en}
          {product.note && <span style={styles.note}> · {product.note}</span>}
        </span>

        {/* Flavour dropdown for products with multiple flavours */}
        {product.flavours && (
          <div style={styles.flavourSelectContainer}>
            <label style={styles.flavourLabel}>ફ્લેવર / Flavour:</label>
            <select
              value={selectedFlavour}
              onChange={(e) => setSelectedFlavour(e.target.value)}
              style={styles.flavourSelect}
              disabled={disabled}
            >
              {product.flavours.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.gu} / {f.en}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={styles.variants}>
        {hasPouch && (
          <div style={styles.row}>
            <span style={{ ...styles.label, color: 'var(--green-mid)' }}>પાઉચ</span>
            <span style={{ ...styles.price, backgroundColor: 'var(--green-light)', color: 'var(--green-dark)' }}>
              ₹{mergedProduct.pouch}
            </span>
            <QtyControl
              quantity={pouchQty}
              onIncrease={() => onUpdateQty(product, 'pouch', 1, selectedFlavour)}
              onDecrease={() => onUpdateQty(product, 'pouch', -1, selectedFlavour)}
              disabled={disabled}
            />
          </div>
        )}

        {hasBottle && (
          <div style={styles.row}>
            <span style={{ ...styles.label, color: '#1e5ba8' }}>બોટલ</span>
            <span style={{ ...styles.price, backgroundColor: '#e8f0fa', color: '#1e5ba8' }}>
              ₹{mergedProduct.bottle}
            </span>
            <QtyControl
              quantity={bottleQty}
              onIncrease={() => onUpdateQty(product, 'bottle', 1, selectedFlavour)}
              onDecrease={() => onUpdateQty(product, 'bottle', -1, selectedFlavour)}
              disabled={disabled}
            />
          </div>
        )}

        {!hasPouch && !hasBottle && (
          <span style={styles.noPrice}>ભાવ ઉપલબ્ધ નથી</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--gray-border)',
    padding: '12px 10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.25s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  activeCard: {
    borderColor: 'var(--green-accent)',
    boxShadow: 'var(--shadow)',
    transform: 'scale(1.01)',
  },
  details: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  nameGu: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    lineHeight: '1.25',
    wordBreak: 'break-word',
  },
  nameEn: {
    fontSize: '0.72rem',
    color: 'var(--text-light)',
    marginTop: '2px',
    lineHeight: '1.2',
  },
  note: {
    color: 'var(--gold)',
    fontWeight: '600',
  },
  flavourSelectContainer: {
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  flavourLabel: {
    fontSize: '0.68rem',
    fontWeight: '750',
    color: 'var(--text-light)',
  },
  flavourSelect: {
    padding: '3px 6px',
    fontSize: '0.74rem',
    fontWeight: '750',
    color: 'var(--green-dark)',
    backgroundColor: 'var(--green-light)',
    border: '1px solid var(--green-accent)',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
    maxWidth: '100%',
  },
  variants: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flexShrink: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: '0.68rem',
    fontWeight: '700',
    width: '28px',
    textAlign: 'center',
  },
  price: {
    fontSize: '0.74rem',
    fontWeight: '700',
    borderRadius: '6px',
    padding: '3px 6px',
    minWidth: '38px',
    textAlign: 'center',
  },
  noPrice: {
    fontSize: '0.72rem',
    color: '#aaa',
    fontStyle: 'italic',
  },
};

export default ProductCard;
