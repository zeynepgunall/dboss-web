import { useState, useEffect } from 'react';
import { getThreads } from '../api';

export default function Sidebar({ token, selectedThreadId, onSelectThread, onNewThread, refreshKey }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getThreads(token)
      .then(setThreads)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <aside className="sidebar">
      <button className="new-thread-btn" onClick={onNewThread}>+ Yeni Sohbet</button>

      {loading && <p className="sidebar-hint">Yükleniyor…</p>}

      {!loading && threads.length === 0 && (
        <p className="sidebar-hint">Henüz sohbet yok.</p>
      )}

      <ul className="thread-list">
        {threads.map(t => (
          <li
            key={t.id}
            className={`thread-item${t.id === selectedThreadId ? ' active' : ''}`}
            onClick={() => onSelectThread(t.id)}
          >
            {t.title || 'Yeni sohbet'}
          </li>
        ))}
      </ul>
    </aside>
  );
}
