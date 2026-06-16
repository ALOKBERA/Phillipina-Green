import React from 'react';

export const QtyControl = ({ quantity = 0, onIncrease, onDecrease, disabled = false }) => {
  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.btn, ...styles.minus, ...(disabled ? styles.disabledBtn : {}) }}
        onClick={onDecrease}
        disabled={disabled || quantity <= 0}
      >
        −
      </button>
      <span style={{ ...styles.num, ...(quantity > 0 ? styles.activeNum : {}) }}>
        {quantity}
      </span>
      <button
        style={{ ...styles.btn, ...styles.plus, ...(disabled ? styles.disabledBtn : {}) }}
        onClick={onIncrease}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--gray-border)',
    borderRadius: '10px',
    padding: '2px',
    boxShadow: 'var(--shadow-sm)',
  },
  btn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  minus: {
    backgroundColor: '#fff0f0',
    color: 'var(--red)',
  },
  plus: {
    backgroundColor: 'var(--green-light)',
    color: 'var(--green-dark)',
  },
  num: {
    minWidth: '28px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '800',
    color: 'var(--text-light)',
  },
  activeNum: {
    color: 'var(--text-dark)',
  },
  disabledBtn: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
};

export default QtyControl;
