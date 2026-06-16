import React from 'react';

export const GrandTotal = ({ morningTotal = 0, eveningTotal = 0, grandTotal = 0 }) => {
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <span style={styles.label}>સવારનું સત્ર વેચાણ (Morning Session):</span>
        <span style={styles.value}>₹{morningTotal}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>સાંજનું સત્ર વેચાણ (Evening Session):</span>
        <span style={styles.value}>₹{eveningTotal}</span>
      </div>
      <div style={styles.divider}></div>
      <div style={styles.grandBox}>
        <span style={styles.grandLabel}>ગ્રાન્ડ ટોટલ / Grand Total:</span>
        <span style={styles.grandValue}>₹{grandTotal}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--gray-border)',
    padding: '16px',
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: 'var(--shadow-sm)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-mid)',
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--green-light)',
    margin: '4px 0',
  },
  grandBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--green-light)',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid var(--green-accent)',
  },
  grandLabel: {
    fontWeight: '800',
    color: 'var(--green-dark)',
    fontSize: '0.92rem',
  },
  grandValue: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: 'var(--green-dark)',
  },
};

export default GrandTotal;
