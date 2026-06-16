import React from 'react';
import ProductCard from './ProductCard';

export const ProductSection = ({ section, products, quantities, onUpdateQty, disabled }) => {
  // Filter products that belong to this section
  const sectionProducts = products.filter((p) => section.ids.includes(p.id));

  if (sectionProducts.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{section.label}</h3>
        <span style={styles.badge}>{sectionProducts.length} items</span>
      </div>
      <div style={styles.list}>
        {sectionProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantities={quantities[product.id]}
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
  title: {
    fontSize: '0.88rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--green-mid)',
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
