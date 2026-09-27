import React from 'react';

export const CategoryCard = ({ category, itemCount = 0, onClick }) => {
  return (
    <button
      id={`cat-card-${category.id}`}
      style={styles.card}
      onClick={() => onClick && onClick(category)}
      type="button"
    >
      <div style={styles.topRow}>
        <span style={styles.badge}>{itemCount} items</span>
      </div>

      <div style={styles.iconContainer}>
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.nameEn}
            style={styles.image}
          />
        ) : (
          <span style={styles.emoji}>{category.icon || '📦'}</span>
        )}
      </div>

      <div style={styles.textContainer}>
        <span style={styles.nameGu}>{category.nameGu}</span>
        <span style={styles.nameEn}>{category.nameEn}</span>
      </div>
    </button>
  );
};

const styles = {
  card: {
    aspectRatio: '1.3 / 1',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--gray-border)',
    borderRadius: '14px',
    padding: '8px 8px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
    boxShadow: 'var(--shadow-sm)',
    outline: 'none',
    fontFamily: 'inherit',
    textAlign: 'center',
    userSelect: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  topRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  badge: {
    fontSize: '0.6rem',
    backgroundColor: 'var(--green-light)',
    color: 'var(--green-dark)',
    padding: '1px 6px',
    borderRadius: '6px',
    fontWeight: '700',
    letterSpacing: '0.1px',
    lineHeight: 1.2,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1px 0',
  },
  emoji: {
    fontSize: '1.75rem',
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
  },
  image: {
    width: '34px',
    height: '34px',
    objectFit: 'contain',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '0 4px',
    boxSizing: 'border-box',
  },
  nameGu: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  nameEn: {
    fontSize: '0.62rem',
    fontWeight: '600',
    color: 'var(--text-light)',
    marginTop: '1px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
};

export default CategoryCard;
