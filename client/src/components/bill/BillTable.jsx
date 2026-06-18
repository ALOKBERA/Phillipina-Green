import React from 'react';

export const BillTable = ({ items = [], onRemoveItem, disabled = false }) => {
  if (items.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <svg
          style={styles.emptyIcon}
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
        <p style={styles.emptyText}>હજી કોઈ ઉત્પાદન ઉમેર્યું નથી</p>
        <span style={styles.emptySubText}>ઉમેરવા માટે પ્રોડક્ટ ટૅબનો ઉપયોગ કરો</span>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>ઉત્પાદન</th>
            <th style={styles.th}>પ્રકાર</th>
            <th style={styles.th}>ભાવ</th>
            <th style={styles.th}>નંગ</th>
            <th style={styles.th}>કુલ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const subtotal = item.quantity * item.unitPrice;
            const isPouch = item.variant === 'pouch';

            return (
              <tr key={`${item.productId}_${item.variant}_${item.flavour || ''}`} style={styles.row}>
                <td style={styles.td}>
                  <div style={styles.prodName}>{item.nameGu}</div>
                  <div style={styles.prodSub}>{item.nameEn}</div>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: isPouch ? 'var(--green-light)' : '#e8f0fa',
                      color: isPouch ? 'var(--green-dark)' : '#1e5ba8',
                    }}
                  >
                    {isPouch ? 'પાઉચ' : 'બોટલ'}
                  </span>
                </td>
                <td style={styles.td}>₹{item.unitPrice}</td>
                <td style={{ ...styles.td, fontWeight: '700' }}>{item.quantity}</td>
                <td style={{ ...styles.td, fontWeight: '750', color: 'var(--green-dark)' }}>
                  ₹{subtotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--border-radius)',
    border: '1.5px dashed var(--gray-border)',
    textAlign: 'center',
  },
  emptyIcon: {
    color: 'var(--text-light)',
    opacity: 0.4,
    marginBottom: '14px',
  },
  emptyText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
  },
  emptySubText: {
    fontSize: '0.8rem',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  tableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--gray-border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    textAlign: 'left',
  },
  headerRow: {
    backgroundColor: 'var(--green-dark)',
  },
  th: {
    padding: '12px 16px',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  row: {
    borderBottom: '1px solid var(--green-light)',
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '12px 16px',
    color: 'var(--text-dark)',
    verticalAlign: 'middle',
  },
  prodName: {
    fontWeight: '600',
  },
  prodSub: {
    fontSize: '0.7rem',
    color: 'var(--text-light)',
    marginTop: '1px',
  },
  typeBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--red)',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'all 0.15s',
  },
  disabledBtn: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
};

export default BillTable;
