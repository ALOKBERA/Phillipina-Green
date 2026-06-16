import React, { useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SalesPage from './pages/SalesPage';
import HistoryPage from './pages/HistoryPage';
import { useSession } from './hooks/useSession';

const AppContent = () => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  const sessionInfo = useSession();
  const [viewHistory, setViewHistory] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isRegistering) {
      return <RegisterPage onBackToLogin={() => setIsRegistering(false)} />;
    }
    return <LoginPage onGoToRegister={() => setIsRegistering(true)} />;
  }

  if (viewHistory) {
    return <HistoryPage onBack={() => setViewHistory(false)} />;
  }

  return (
    <div className="app-container">
      <SalesPage
        sessionInfo={sessionInfo}
        onViewHistory={() => setViewHistory(true)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--gray-light)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--green-light)',
    borderTop: '4px solid var(--green-mid)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default App;
