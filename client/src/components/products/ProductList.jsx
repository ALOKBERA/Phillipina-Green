import React from 'react';
import { SECTIONS } from '../../data/products';
import ProductSection from './ProductSection';

export const ProductList = ({
  products,
  quantities,
  onUpdateQty,
  disabled,
  onEditPrices,
  filterCategory,
}) => {
  const sectionsToRender = filterCategory
    ? SECTIONS.filter(
        (section) =>
          section.id === filterCategory ||
          section.label.toLowerCase().includes(filterCategory.toLowerCase())
      )
    : SECTIONS;

  return (
    <div style={styles.container}>
      {sectionsToRender.map((section) => (
        <ProductSection
          key={section.label}
          section={section}
          products={products}
          quantities={quantities}
          onUpdateQty={onUpdateQty}
          disabled={disabled}
          onEditPrices={onEditPrices}
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
