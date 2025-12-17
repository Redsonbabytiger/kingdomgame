import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { GameSetupPage } from './pages/GameSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { getCivilization } from './services/civilizationService';
import { supabase } from '../lib/supabase';

type AppState =
  | 'login'
  | 'register'
  | 'reset-password'
  | 'setup'
  | 'game';

function AppContent() {
  const { user, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>('login');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Detect Supabase password recovery flow
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAppState('reset-password');
        setChecking(false);
      }
    });
  }, []);

  useEffect(() => {
    async function checkExistingCivilization() {
      if (!user) {
        setAppState('login');
        setChecking(false);
        return;
      }

      try {
        const civ = await getCivilization(user.id);
        if (civ) {
          setAppState('game');
        } else {
          setAppState('setup');
        }
      } catch {
        setAppState('setup');
      } finally {
        setChecking(false);
      }
    }

    if (!loading && appState !== 'reset-password') {
      checkExistingCivilization();
    }
  }, [user, loading, appState]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  switch (appState) {
    case 'login':
      return (
        <LoginPage
          onLoginSuccess={() => setAppState('setup')}
          onSwitchToRegister={() => setAppState('register')}
        />
      );

    case 'register':
      return (
        <RegisterPage
          onRegisterSuccess={() => setAppState('setup')}
          onSwitchToLogin={() => setAppState('login')}
        />
      );

    case 'reset-password':
      return (
        <ResetPasswordPage
          onResetComplete={() => setAppState('login')}
        />
      );

    case 'setup':
      return (
        <GameSetupPage
          userId={user!.id}
          onSetupComplete={() => setAppState('game')}
        />
      );

    case 'game':
      return <DashboardPage userId={user!.id} />;

    default:
      return null;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
