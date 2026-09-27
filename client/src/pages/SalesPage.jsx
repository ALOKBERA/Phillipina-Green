import React, { useState } from 'react';
import { usePrices } from '../context/PriceContext';
import { useSales } from '../hooks/useSales';
import Header from '../components/layout/Header';
import BottomBar from '../components/layout/BottomBar';
import ProductList from '../components/products/ProductList';
import BillTable from '../components/bill/BillTable';
import GrandTotal from '../components/bill/GrandTotal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EditPricePage from './EditPricePage';
import api from '../api/axios';

export const SalesPage = ({ sessionInfo, onViewHistory }) => {
  const { products, overrides, fetchPrices, getProductPrice, loading: pricesLoading } = usePrices();

  const {
    salesRecord,
    quantities,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearAll,
    refreshRecord,
  } = useSales(sessionInfo, getProductPrice);

  const [activeTab, setActiveTab] = useState('products');
  const [editingCategory, setEditingCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchPrices(), refreshRecord()]);
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getActiveItemCount = () => {
    let count = 0;
    Object.values(quantities).forEach((variantMap) => {
      if (variantMap.pouch > 0) count++;
      if (variantMap.bottle > 0) count++;
    });
    return count;
  };

  const handleClearAll = async () => {
    if (window.confirm('શું તમે બધો વેચાણ ડેટા સાફ કરવા માંગો છો?')) {
      await clearAll();
    }
  };

  const handleDownloadPdf = async () => {
    if (!salesRecord) return;
    try {
      const dateStr = salesRecord.date;
      const res = await api.get(`/api/sales/pdf?date=${dateStr}&t=${Date.now()}`, { responseType: 'blob' });
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `sales-${dateStr}.pdf`;
      link.click();
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('પીડીએફ ડાઉનલોડ થઈ શકી નથી.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show edit price page when a category is being edited
  if (editingCategory) {
    return (
      <EditPricePage
        category={editingCategory}
        onBack={() => setEditingCategory(null)}
      />
    );
  }

  const grandTotal = salesRecord?.grandTotal || 0;
  const morningTotal = salesRecord?.morningTotal || 0;
  const eveningTotal = salesRecord?.eveningTotal || 0;
  const recordItems = salesRecord?.items || [];

  return (
    <div style={styles.container}>
      <Header sessionInfo={sessionInfo} grandTotal={grandTotal} />

      <div style={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'products' ? styles.activeTabBtn : {}),
          }}
        >
          🛒 ઉત્પાદનો (Products)
        </button>
        <button
          onClick={() => setActiveTab('bill')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'bill' ? styles.activeTabBtn : {}),
          }}
        >
          🧾 બિલ (Bill)
        </button>
        <button onClick={onViewHistory} style={styles.historyTabBtn}>
          📅 ઇતિહાસ (History)
        </button>
      </div>

      <main style={styles.main}>
        {error && <div style={styles.errorAlert}>{error}</div>}

        <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
          <div style={styles.statusBar}>
            <button
              id="refresh-prices-btn"
              onClick={handleRefreshAll}
              style={styles.refreshBtn}
              title="રીફ્રેશ ભાવ અને બિલ / Refresh Prices & Bill"
              disabled={refreshing || pricesLoading}
            >
              {refreshing ? '⏳ સિંક થાય છે...' : '🔄 રીફ્રેશ / Refresh'}
            </button>
          </div>

          <ProductList
            products={products}
            quantities={quantities}
            onUpdateQty={updateQuantity}
            disabled={false}
            onEditPrices={(category) => setEditingCategory(category)}
          />
        </div>

        <div style={{ display: activeTab === 'bill' ? 'block' : 'none' }}>
          <BillTable
            items={recordItems}
            onRemoveItem={(item) => removeItem(item, item.variant)}
            disabled={false}
          />
          {recordItems.length > 0 && (
            <GrandTotal
              morningTotal={morningTotal}
              eveningTotal={eveningTotal}
              grandTotal={grandTotal}
            />
          )}
        </div>
      </main>

      <BottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itemCount={getActiveItemCount()}
        onClearAll={handleClearAll}
        onDownloadPdf={handleDownloadPdf}
        isClosed={!sessionInfo.active}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'var(--white)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
  },
  tabHeader: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderBottom: '2.5px solid var(--gray-border)',
    position: 'sticky',
    top: 0,
    zIndex: 95,
  },
  tabBtn: {
    flex: 1,
    padding: '14px 10px',
    border: 'none',
    background: 'none',
    fontSize: '0.86rem',
    fontWeight: '600',
    color: 'var(--text-light)',
    cursor: 'pointer',
    textAlign: 'center',
    borderBottom: '3.5px solid transparent',
    outline: 'none',
    transition: 'all 0.2s',
  },
  activeTabBtn: {
    color: 'var(--green-dark)',
    borderBottom: '3.5px solid var(--green-dark)',
    fontWeight: '800',
  },
  historyTabBtn: {
    flex: 1,
    padding: '14px 10px',
    border: 'none',
    background: 'none',
    fontSize: '0.86rem',
    fontWeight: '600',
    color: 'var(--gold)',
    cursor: 'pointer',
    textAlign: 'center',
    borderBottom: '3.5px solid transparent',
    outline: 'none',
  },
  main: {
    flex: 1,
    padding: '16px 16px 100px',
    backgroundColor: 'var(--gray-light)',
  },
  errorAlert: {
    backgroundColor: 'var(--red-light)',
    color: 'var(--red)',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '14px',
    border: '1px solid #ffcdd2',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '12px',
  },
  refreshBtn: {
    backgroundColor: '#E6F4EA',
    color: 'var(--green-dark)',
    border: '1.5px solid var(--green-accent)',
    borderRadius: '10px',
    padding: '6px 14px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },
};

export default SalesPage;
