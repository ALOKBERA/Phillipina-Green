import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import SessionBadge from '../session/SessionBadge';
import logoImg from '../../assets/phillipinalogo.png';

export const Header = ({ sessionInfo, grandTotal }) => {
  const { isAuthenticated, username, logout } = useAuth();

  const getFormattedDate = () => {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('gu-IN', opts);
  };

  return (
    <header style={styles.header}>
      <div style={styles.topRow}>
        <div style={styles.branding}>
          <img src={logoImg} alt="Alok Liquid Shop Logo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Welcome {username}</h1>
            <p style={styles.subtitle}>દૈનિક વેચાણ નોંધણી</p>
          </div>
        </div>
        
        {isAuthenticated && (
          <button onClick={logout} style={styles.logoutBtn}>
            લૉગઆઉટ
          </button>
        )}
      </div>

      <div style={styles.metaRow}>
        <div style={styles.infoGroup}>
          <div style={styles.dateLabel}>{getFormattedDate()}</div>
          <SessionBadge sessionInfo={sessionInfo} />
        </div>

        <div style={styles.totalBadge}>
          <div style={styles.totalLabel}>આજનું કુલ વેચાણ</div>
          <div style={styles.totalAmount}>₹{grandTotal}</div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
    color: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: 'var(--shadow)',
    borderBottom: '2px solid var(--green-accent)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '0.75rem',
    opacity: 0.8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '10px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dateLabel: {
    fontSize: '0.82rem',
    opacity: 0.9,
    fontWeight: '500',
  },
  totalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1.5px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '14px',
    padding: '8px 16px',
    textAlign: 'right',
    minWidth: '120px',
    backdropFilter: 'blur(4px)',
  },
  totalLabel: {
    fontSize: '0.65rem',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#a8ffb2',
    lineHeight: '1.2',
    marginTop: '2px',
  },
};

export default Header;
