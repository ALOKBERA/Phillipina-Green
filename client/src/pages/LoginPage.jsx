import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../assets/phillipinalogo.png';

export const LoginPage = ({ onGoToRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('કૃપા કરી યુઝરનેમ અને પાસવર્ડ દાખલ કરો.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(username, password);

    if (!res.success) {
      setError(res.message || 'ખોટું યુઝરનેમ અથવા પાસવર્ડ.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src={logoImg} alt="Alok Liquid Shop Logo" style={styles.logo} />
          <h2 style={styles.title}>Phillipina Green</h2>
          <p style={styles.subtitle}>વેચાણ નોંધણી લૉગિન</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>યુઝરનેમ (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username enter karo"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>પાસવર્ડ (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'પ્રવેશ પ્રક્રિયા ચાલુ છે...' : 'પ્રવેશ કરો (Login)'}
          </button>
        </form>

        <div style={styles.footer}>
          <button onClick={onGoToRegister} style={styles.registerBtn} disabled={loading}>
            નવું એકાઉન્ટ બનાવો (Register)
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--gray-light)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: 'var(--shadow-lg)',
    border: '1.5px solid var(--gray-border)',
    animation: 'fadeIn 0.5s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'block',
    margin: '0 auto 10px auto',
    objectFit: 'cover',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--green-dark)',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    marginTop: '4px',
    fontWeight: '500',
  },
  errorAlert: {
    backgroundColor: 'var(--red-light)',
    color: 'var(--red)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '20px',
    border: '1px solid #ffcdd2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-mid)',
  },
  input: {
    border: '1.5px solid var(--gray-border)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  submitBtn: {
    backgroundColor: 'var(--green-mid)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '0.95rem',
    fontWeight: '750',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(29, 124, 55, 0.25)',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  registerBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--green-dark)',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginPage;
