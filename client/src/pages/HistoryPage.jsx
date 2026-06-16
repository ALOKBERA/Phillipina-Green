import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatIstDate } from '../utils/sessionUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const HistoryPage = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/sales/history');
      setHistory(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('વેચાણ ઇતિહાસ મેળવવામાં નિષ્ફળતા.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadPdf = async (dateStr) => {
    try {
      const res = await api.get(`/api/sales/pdf?date=${dateStr}`, { responseType: 'blob' });
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `sales-${dateStr}.pdf`;
      link.click();
    } catch (err) {
      console.error('Error downloading historical PDF:', err);
      alert('પીડીએફ ડાઉનલોડ કરવામાં ખામી સર્જાઈ.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          ← પાછા જાઓ
        </button>
        <h2 style={styles.title}>📅 વેચાણ ઇતિહાસ</h2>
        <p style={styles.subtitle}>ભૂતકાળના દૈનિક અહેવાલો</p>
      </header>

      <main style={styles.main}>
        {error && <div style={styles.errorAlert}>{error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : history.length === 0 ? (
          <div style={styles.noHistory}>
            <p>હજી સુધી કોઈ વેચાણ ઇતિહાસ ઉપલબ્ધ નથી.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {history.map((record) => (
              <div key={record.date} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.date}>{formatIstDate(record.date)}</span>
                  <button
                    onClick={() => handleDownloadPdf(record.date)}
                    style={styles.pdfBtn}
                  >
                    📄 ડાઉનલોડ PDF
                  </button>
                </div>

                <div style={styles.breakdown}>
                  <div style={styles.row}>
                    <span>સવારનું સત્ર:</span>
                    <span>₹{record.morningTotal}</span>
                  </div>
                  <div style={styles.row}>
                    <span>સાંજનું સત્ર:</span>
                    <span>₹{record.eveningTotal}</span>
                  </div>
                  <div style={{ ...styles.row, ...styles.grandTotalRow }}>
                    <span>કુલ દૈનિક વેચાણ:</span>
                    <span>₹{record.grandTotal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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
  header: {
    background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
    color: '#ffffff',
    padding: '20px',
    borderBottom: '2px solid var(--green-accent)',
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '0.78rem',
    opacity: 0.8,
    marginTop: '2px',
  },
  main: {
    flex: 1,
    padding: '20px',
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
  noHistory: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-light)',
    fontSize: '0.9rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--gray-border)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--green-light)',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  date: {
    fontWeight: '800',
    fontSize: '1rem',
    color: 'var(--text-dark)',
  },
  pdfBtn: {
    backgroundColor: 'var(--green-light)',
    color: 'var(--green-dark)',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.82rem',
    color: 'var(--text-mid)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  grandTotalRow: {
    fontWeight: '800',
    color: 'var(--green-dark)',
    fontSize: '0.9rem',
    borderTop: '1px solid var(--gray-border)',
    paddingTop: '6px',
    marginTop: '4px',
  },
};

export default HistoryPage;
