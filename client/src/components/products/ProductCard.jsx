import React, { useState } from 'react';
import QtyControl from '../ui/QtyControl';

export const ProductCard = ({ product, quantities = {}, onUpdateQty, disabled = false }) => {
  const [selectedFlavour, setSelectedFlavour] = useState(
    product.flavours ? product.flavours[0].id : ''
  );

  const key = product.flavours ? `${product.id}_${selectedFlavour}` : product.id;
  const flavourQuantities = quantities[key] || {};

  const pouchQty = flavourQuantities.pouch || 0;
  const bottleQty = flavourQuantities.bottle || 0;
  const hasQty = pouchQty > 0 || bottleQty > 0;

  const hasPouch = product.pouch !== null;
  const hasBottle = product.bottle !== null;

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
              ₹{product.pouch}
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
              ₹{product.bottle}
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
    padding: '16px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.25s ease',
  },
  activeCard: {
    borderColor: 'var(--green-accent)',
    boxShadow: 'var(--shadow)',
    transform: 'scale(1.01)',
  },
  details: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  nameGu: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
  },
  nameEn: {
    fontSize: '0.78rem',
    color: 'var(--text-light)',
    marginTop: '2px',
  },
  note: {
    color: 'var(--gold)',
    fontWeight: '600',
  },
  flavourSelectContainer: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  flavourLabel: {
    fontSize: '0.7rem',
    fontWeight: '750',
    color: 'var(--text-light)',
  },
  flavourSelect: {
    padding: '4px 8px',
    fontSize: '0.78rem',
    fontWeight: '750',
    color: 'var(--green-dark)',
    backgroundColor: 'var(--green-light)',
    border: '1px solid var(--green-accent)',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
  },
  variants: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: '700',
    width: '32px',
    textAlign: 'center',
  },
  price: {
    fontSize: '0.78rem',
    fontWeight: '700',
    borderRadius: '6px',
    padding: '4px 8px',
    minWidth: '42px',
    textAlign: 'center',
  },
  noPrice: {
    fontSize: '0.75rem',
    color: '#aaa',
    fontStyle: 'italic',
  },
};

export default ProductCard;
