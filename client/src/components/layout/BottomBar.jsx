import React from 'react';

export const BottomBar = ({
  activeTab,
  setActiveTab,
  itemCount = 0,
  onClearAll,
  onDownloadPdf,
  isClosed = false,
}) => {
  if (activeTab === 'products') {
    return (
      <div style={styles.bar}>
        <button onClick={() => setActiveTab('bill')} style={styles.primaryBtn}>
          🧾 બિલ જુઓ ({itemCount} આઇટમ)
        </button>
      </div>
    );
  }

  return (
    <div style={styles.bar}>
      <button onClick={onClearAll} style={styles.dangerBtn}>
        🗑 સાફ કરો
      </button>

      <button onClick={onDownloadPdf} style={styles.goldBtn}>
        📄 પીડીએફ રિપોર્ટ
      </button>

      <button onClick={() => setActiveTab('products')} style={styles.primaryBtn}>
        + ઉમેરો
      </button>
    </div>
  );
};

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderTop: '2px solid var(--gray-border)',
    padding: '16px 20px',
    display: 'flex',
    gap: '12px',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
    zIndex: 90,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: 'var(--green-mid)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '0.9rem',
    fontWeight: '750',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(29, 124, 55, 0.2)',
  },
  dangerBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'var(--red)',
    border: '2px solid var(--red)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  goldBtn: {
    flex: 1.5,
    backgroundColor: '#ff9800',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '0.85rem',
    fontWeight: '750',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
  },
};

export default BottomBar;
