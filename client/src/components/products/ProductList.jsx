import React from 'react';
import { SECTIONS } from '../../data/products';
import ProductSection from './ProductSection';

export const ProductList = ({ products, quantities, onUpdateQty, disabled }) => {
  return (
    <div style={styles.container}>
      {SECTIONS.map((section) => (
        <ProductSection
          key={section.label}
          section={section}
          products={products}
          quantities={quantities}
          onUpdateQty={onUpdateQty}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '4px 0',
  },
};

export default ProductList;
