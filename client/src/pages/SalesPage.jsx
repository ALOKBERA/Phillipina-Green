import React, { useState } from 'react';
import { usePrices } from '../context/PriceContext';
import { useSales } from '../hooks/useSales';
import Header from '../components/layout/Header';
import BottomBar from '../components/layout/BottomBar';
import ProductList from '../components/products/ProductList';
import CategoryPage from './CategoryPage';
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

  const [activeTab, setActiveTab] = useState('category');
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
          id="tab-btn-category"
          onClick={() => setActiveTab('category')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'category' ? styles.activeTabBtn : {}),
          }}
        >
          📁 કેટેગરી
        </button>
        <button
          id="tab-btn-products"
          onClick={() => setActiveTab('products')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'products' ? styles.activeTabBtn : {}),
          }}
        >
          🛒 બધા ઉત્પાદનો
        </button>
        <button
          id="tab-btn-bill"
          onClick={() => setActiveTab('bill')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'bill' ? styles.activeTabBtn : {}),
          }}
        >
          🧾 બિલ
        </button>
        <button id="tab-btn-history" onClick={onViewHistory} style={styles.historyTabBtn}>
          📅 ઇતિહાસ
        </button>
      </div>

      <main style={styles.main}>
        {error && <div style={styles.errorAlert}>{error}</div>}

        {/* Tab 1: Category Grid & Filtered Scoped View */}
        <div style={{ display: activeTab === 'category' ? 'block' : 'none', width: '100%', boxSizing: 'border-box' }}>
          <div style={styles.statusBar}>
            <button
              id="refresh-prices-btn-cat"
              onClick={handleRefreshAll}
              style={styles.refreshBtn}
              title="રીફ્રેશ ભાવ અને બિલ / Refresh Prices & Bill"
              disabled={refreshing || pricesLoading}
            >
              {refreshing ? '⏳ સિંક થાય છે...' : '🔄 રીફ્રેશ / Refresh'}
            </button>
          </div>

          <CategoryPage
            products={products}
            quantities={quantities}
            onUpdateQty={updateQuantity}
            disabled={false}
            onEditPrices={(category) => setEditingCategory(category)}
          />
        </div>

        {/* Tab 2: All Products (Full Scrolling Catalog) */}
        <div style={{ display: activeTab === 'products' ? 'block' : 'none', width: '100%', boxSizing: 'border-box' }}>
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

        {/* Tab 3: Bill Table & Totals */}
        <div style={{ display: activeTab === 'bill' ? 'block' : 'none', width: '100%', boxSizing: 'border-box' }}>
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
    width: '100%',
    maxWidth: '768px',
    margin: '0 auto',
    backgroundColor: 'var(--white)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
    boxSizing: 'border-box',
  },
  tabHeader: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '2.5px solid var(--gray-border)',
    position: 'sticky',
    top: 0,
    zIndex: 95,
    boxSizing: 'border-box',
  },
  tabBtn: {
    flex: '1 1 0',
    minWidth: 0,
    padding: '11px 2px',
    border: 'none',
    background: 'none',
    fontSize: 'clamp(0.65rem, 2.7vw, 0.78rem)',
    fontWeight: '700',
    color: 'var(--text-light)',
    cursor: 'pointer',
    textAlign: 'center',
    borderBottom: '3.5px solid transparent',
    outline: 'none',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  activeTabBtn: {
    color: 'var(--green-dark)',
    borderBottom: '3.5px solid var(--green-dark)',
    fontWeight: '800',
  },
  historyTabBtn: {
    flex: '1 1 0',
    minWidth: 0,
    padding: '11px 2px',
    border: 'none',
    background: 'none',
    fontSize: 'clamp(0.65rem, 2.7vw, 0.78rem)',
    fontWeight: '700',
    color: 'var(--gold)',
    cursor: 'pointer',
    textAlign: 'center',
    borderBottom: '3.5px solid transparent',
    outline: 'none',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    width: '100%',
    padding: '12px 10px 100px',
    backgroundColor: 'var(--gray-light)',
    boxSizing: 'border-box',
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
