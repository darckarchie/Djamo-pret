import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoanApplication from './components/LoanApplication';
import AuthFlow from './components/AuthFlow';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { ToastContainer } from './lib/toast';
import { adminAuth } from './lib/adminAuth';
import type { LoanData } from './components/LoanApplication';

type AppScreen = 'landing' | 'loan' | 'auth' | 'done';

function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
      setAdminLoggedIn(adminAuth.checkSession());
    }
  }, []);

  const handleLoanComplete = (data: LoanData) => {
    setLoanData(data);
    setScreen('auth');
  };

  if (isAdmin) {
    if (!adminLoggedIn) {
      return <AdminLogin onSuccess={() => setAdminLoggedIn(true)} />;
    }
    return <AdminPanel onLogout={() => setAdminLoggedIn(false)} />;
  }

  return (
    <>
      {screen === 'landing' && (
        <LandingPage onGetStarted={() => setScreen('loan')} />
      )}

      {screen === 'loan' && (
        <LoanApplication
          onCancel={() => setScreen('landing')}
          onComplete={handleLoanComplete}
        />
      )}

      {screen === 'auth' && loanData && (
        <AuthFlow
          loanData={loanData}
          onComplete={() => setScreen('done')}
          onCancel={() => setScreen('loan')}
        />
      )}

      {screen === 'done' && (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Demande confirmée !</h1>
          <p className="text-gray-400 text-lg mb-2">Votre dossier est en cours de traitement.</p>
          <p className="text-gray-500">Vous recevrez vos fonds sous 7 jours ouvrés.</p>
        </div>
      )}

      <ToastContainer />
    </>
  );
}

export default App;
