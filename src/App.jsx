import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatLayout from './components/ChatLayout';
import { loadToken, saveToken, clearToken } from './auth';

export default function App() {
  const [token, setToken] = useState(loadToken);
  const [view, setView] = useState('login');

  useEffect(() => {
    function handleAuthExpired() { setToken(null); }
    window.addEventListener('authExpired', handleAuthExpired);
    return () => window.removeEventListener('authExpired', handleAuthExpired);
  }, []);

  function handleLogin(t, remember) {
    saveToken(t, remember);
    setToken(t);
  }

  function handleLogout() {
    clearToken();
    setToken(null);
  }

  if (token) {
    return <ChatLayout token={token} onLogout={handleLogout} />;
  }

  if (view === 'register') {
    return <RegisterForm onGoLogin={() => setView('login')} />;
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onGoRegister={() => setView('register')}
    />
  );
}
