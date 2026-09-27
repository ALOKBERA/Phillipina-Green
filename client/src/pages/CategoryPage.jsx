import React, { useState } from 'react';
import { categories } from '../data/categories';
import { SECTIONS } from '../data/products';
import CategoryCard from '../components/category/CategoryCard';
import ProductList from '../components/products/ProductList';

export const CategoryPage = ({
  products = [],
  quantities = {},
  onUpdateQty,
  disabled = false,
  onEditPrices,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Compute live item count for a category from the products catalog
  const getCategoryItemCount = (cat) => {
    const section = SECTIONS.find((s) => s.id === cat.id);
    if (section) {
      return products.filter((p) => section.ids.includes(p.id)).length;
    }
    return products.filter((p) => p.category === cat.nameEn).length;
  };

  if (selectedCategory) {
    return (
      <div style={styles.container}>
        {/* Navigation back bar */}
        <div style={styles.filteredHeader}>
          <button
            id="category-back-btn"
            onClick={() => setSelectedCategory(null)}
            style={styles.backBtn}
            type="button"
          >
            ← પાછા (Categories)
          </button>
          <div style={styles.categoryInfo}>
            <span style={styles.categoryEmoji}>{selectedCategory.icon}</span>
            <div>
              <div style={styles.categoryNameGu}>{selectedCategory.nameGu}</div>
              <div style={styles.categoryNameEn}>{selectedCategory.nameEn}</div>
            </div>
          </div>
        </div>

        {/* Reusable ProductList scoped to this category */}
        <ProductList
          products={products}
          quantities={quantities}
          onUpdateQty={onUpdateQty}
          disabled={disabled}
          onEditPrices={onEditPrices}
          filterCategory={selectedCategory.id}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            itemCount={getCategoryItemCount(cat)}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '4px 0',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    padding: '4px 0 16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  filteredHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--green-accent)',
    borderRadius: '14px',
    padding: '10px 14px',
    marginBottom: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    gap: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  backBtn: {
    backgroundColor: 'var(--green-light)',
    color: 'var(--green-dark)',
    border: '1px solid var(--green-accent)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.18s ease',
    flexShrink: 0,
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'right',
  },
  categoryEmoji: {
    fontSize: '1.4rem',
    lineHeight: 1,
  },
  categoryNameGu: {
    fontSize: '0.88rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    lineHeight: 1.2,
  },
  categoryNameEn: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--text-light)',
  },
};

export default CategoryPage;
