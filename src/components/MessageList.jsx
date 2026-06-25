import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getMessages } from '../api';

export default function MessageList({ token, threadId, messagesRefreshKey, isTyping, pendingMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const lastScrolledThreadId = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMessages(token, threadId)
      .then(setMessages)
      .catch(() => setError('Mesajlar yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [threadId, messagesRefreshKey, retryKey]);

  useEffect(() => {
    if (loading || !bottomRef.current) return;

    const isFirstLoad = lastScrolledThreadId.current !== threadId;
    lastScrolledThreadId.current = threadId;

    if (isFirstLoad) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'instant' });
      });
      return;
    }

    const list = listRef.current;
    if (!list) return;
    const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 150;
    if (nearBottom) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages, threadId, isTyping, loading]);

  return (
    <div className="message-list" ref={listRef}>
      {loading && <p className="list-hint">Yükleniyor…</p>}

      {!loading && error && (
        <div className="chat-error">
          <span>{error}</span>
          <button onClick={() => setRetryKey(k => k + 1)}>Tekrar dene</button>
        </div>
      )}

      {!loading && !error && messages.length === 0 && !pendingMessage && (
        <p className="list-hint">Bu sohbette henüz mesaj yok.</p>
      )}

      {messages.map(msg => (
        <div key={msg.id} className={`message-bubble ${msg.role}`}>
          {msg.role === 'assistant'
            ? <ReactMarkdown>{msg.content}</ReactMarkdown>
            : msg.content
          }
        </div>
      ))}

      {pendingMessage && (
        <div className="message-bubble user">{pendingMessage}</div>
      )}
      {isTyping && (
        <div className="message-bubble assistant typing-indicator">
          <span /><span /><span />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
