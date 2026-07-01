import { useState, useEffect } from 'react';
import { getThreads, deleteThread } from '../api';

export default function Sidebar({
  token,
  selectedThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  refreshKey,
}) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    // React'in resmi veri-çekme deseni: yeni istek başlarken durumu sıfırla.
    // Bu senkron setState'ler kasıtlı (yükleniyor göster, eski hatayı temizle).
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    getThreads(token)
      .then((data) => {
        if (!ignore) setThreads(data);
      })
      .catch(() => {
        if (!ignore) setError('Sohbetler yüklenemedi.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    // Cleanup: token/anahtar değişip yeni istek başlarsa, eski isteğin
    // geç gelen cevabı yeni state'in üzerine yazmasın (yarış koşulu koruması).
    return () => {
      ignore = true;
    };
  }, [token, refreshKey, retryKey]);

  async function handleDelete(e, threadId) {
    e.stopPropagation();
    if (!window.confirm('Bu sohbet silinsin mi?')) return;
    try {
      await deleteThread(token, threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      // selectedThreadId URL'den string gelir; id'ler sayı olabilir → string karşılaştır.
      if (String(threadId) === String(selectedThreadId)) onDeleteThread(threadId);
    } catch {
      // sessiz başarısızlık
    }
  }

  return (
    <aside className="sidebar">
      <button className="new-thread-btn" onClick={onNewThread}>
        + Yeni Sohbet
      </button>

      {loading && <p className="sidebar-hint">Yükleniyor…</p>}

      {error && (
        <div className="sidebar-error">
          <span>{error}</span>
          <button onClick={() => setRetryKey((k) => k + 1)}>Tekrar dene</button>
        </div>
      )}

      {!loading && !error && threads.length === 0 && (
        <p className="sidebar-hint">Henüz sohbet yok.</p>
      )}

      <ul className="thread-list">
        {threads.map((t) => (
          <li
            key={t.id}
            className={`thread-item${String(t.id) === String(selectedThreadId) ? ' active' : ''}`}
            onClick={() => onSelectThread(t.id)}
          >
            <span className="thread-title">{t.title || 'Yeni sohbet'}</span>
            <button
              className="delete-btn"
              onClick={(e) => handleDelete(e, t.id)}
              title="Sohbeti sil"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
