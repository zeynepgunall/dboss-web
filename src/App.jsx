import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatLayout from './components/ChatLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { loadToken, saveToken, clearToken } from './auth';

export default function App() {
  const [token, setToken] = useState(loadToken);
  const navigate = useNavigate();

  useEffect(() => {
    // api.js 401'de clearToken() yapıp bu event'i fırlatır.
    // Burada token state'ini boşaltıp login'e yönlendiriyoruz.
    function handleAuthExpired() {
      setToken(null);
      navigate('/login');
    }
    window.addEventListener('authExpired', handleAuthExpired);
    return () => window.removeEventListener('authExpired', handleAuthExpired);
  }, [navigate]);

  function handleLogin(t, remember) {
    saveToken(t, remember);
    setToken(t);
    navigate('/chat');
  }

  function handleLogout() {
    clearToken();
    setToken(null);
    navigate('/login');
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginForm onLogin={handleLogin} onGoRegister={() => navigate('/register')} />
        }
      />
      <Route
        path="/register"
        element={<RegisterForm onGoLogin={() => navigate('/login')} />}
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute token={token}>
            <ChatLayout token={token} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:threadId"
        element={
          <ProtectedRoute token={token}>
            <ChatLayout token={token} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={token ? '/chat' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
