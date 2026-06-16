import React from 'react';

export const SessionBadge = ({ sessionInfo }) => {
  const getBadgeStyle = () => {
    if (sessionInfo.session === 'morning' || sessionInfo.session === 'evening') {
      return styles.active;
    }
    if (sessionInfo.labelGu.includes('અહેવાલ')) {
      return styles.downloadAvailable;
    }
    return styles.closed;
  };

  return (
    <div style={{ ...styles.badge, ...getBadgeStyle() }}>
      <span style={styles.dot}></span>
      <div>
        <div style={styles.labelGu}>{sessionInfo.labelGu}</div>
        <div style={styles.labelEn}>{sessionInfo.labelEn}</div>
      </div>
    </div>
  );
};

const styles = {
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-sm)',
    border: '1.5px solid transparent',
  },
  active: {
    backgroundColor: '#e8f5ec',
    color: 'var(--green-dark)',
    borderColor: '#cce6d3',
  },
  downloadAvailable: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
    borderColor: '#ffe0b2',
  },
  closed: {
    backgroundColor: '#ffeaea',
    color: 'var(--red)',
    borderColor: '#ffd1d1',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    animation: 'pulse 2s infinite',
  },
  labelGu: {
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  labelEn: {
    fontSize: '0.7rem',
    opacity: 0.8,
    marginTop: '1px',
  },
};

export default SessionBadge;
