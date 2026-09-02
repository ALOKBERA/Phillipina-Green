import React from 'react';
import ProductCard from './ProductCard';

export const ProductSection = ({ section, products, quantities, onUpdateQty, disabled, onEditPrices }) => {
  // Filter products that belong to this section
  const sectionProducts = products.filter((p) => section.ids.includes(p.id));

  if (sectionProducts.length === 0) return null;

  // Derive category from the first product in this section
  const category = sectionProducts[0]?.category;

  const handleEdit = () => {
    if (onEditPrices && category) onEditPrices(category);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{section.label}</h3>
        <div style={styles.headerRight}>
          {onEditPrices && (
            <button
              id={`edit-price-btn-${category?.replace(/\s|&/g, '-').toLowerCase()}`}
              style={styles.editBtn}
              onClick={handleEdit}
              title="Edit prices for this category"
            >
              ✏️ ભાવ
            </button>
          )}
          <span style={styles.badge}>{sectionProducts.length} items</span>
        </div>
      </div>
      <div style={styles.list}>
        {sectionProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantities={quantities}
            onUpdateQty={onUpdateQty}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '2.5px solid var(--green-light)',
    marginBottom: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '0.88rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--green-mid)',
  },
  editBtn: {
    fontSize: '0.68rem',
    fontWeight: '700',
    backgroundColor: 'var(--green-mid)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
  badge: {
    fontSize: '0.7rem',
    backgroundColor: 'var(--green-light)',
    color: 'var(--green-dark)',
    padding: '3px 8px',
    borderRadius: '8px',
    fontWeight: '700',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default ProductSection;
