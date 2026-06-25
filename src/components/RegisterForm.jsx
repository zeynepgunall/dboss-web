import { useState } from 'react';
import { API_URL } from '../config';

export default function RegisterForm({ onGoLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'Kayıt başarısız. Tekrar deneyin.');
        return;
      }
      setSuccess(true);
      setTimeout(onGoLogin, 1500);
    } catch {
      setError('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="centered">
      <div className="form-card">
        <h2>Kayıt Ol</h2>
        {success ? (
          <p style={{ color: '#16a34a' }}>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Kullanıcı Adı
              <input value={username} onChange={e => setUsername(e.target.value)}
                required autoFocus />
            </label>
            <label>
              E-posta
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              Şifre
              <input type="password" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>
        )}
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Zaten hesabın var mı?{' '}
          <button className="link-btn" onClick={onGoLogin}>Giriş yap</button>
        </p>
      </div>
    </div>
  );
}
