import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getMessages } from '../api';

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const isInline = inline || !String(children).includes('\n');
    return isInline ? (
      <code className="md-inline-code" {...props}>
        {children}
      </code>
    ) : (
      <code className={`md-block-code ${className || ''}`} {...props}>
        {children}
      </code>
    );
  },
  pre({ children }) {
    return <pre className="md-pre">{children}</pre>;
  },
};

export default function MessageList({
  token,
  threadId,
  messagesRefreshKey,
  isTyping,
  pendingMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const lastScrolledThreadId = useRef(null);

  useEffect(() => {
    let ignore = false;
    // React'in resmi veri-çekme deseni: yeni istek başlarken durumu sıfırla.
    // Bu senkron setState'ler kasıtlı (yükleniyor göster, eski hatayı temizle).
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    getMessages(token, threadId)
      .then((data) => {
        if (!ignore) setMessages(data);
      })
      .catch(() => {
        if (!ignore) setError('Mesajlar yüklenemedi.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    // Cleanup: thread hızlı değişirse, eski thread'in geç gelen mesajları
    // yeni thread'in üzerine yazmasın (yarış koşulu koruması).
    return () => {
      ignore = true;
    };
  }, [token, threadId, messagesRefreshKey, retryKey]);

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
          <button onClick={() => setRetryKey((k) => k + 1)}>Tekrar dene</button>
        </div>
      )}

      {!loading && !error && messages.length === 0 && !pendingMessage && (
        <p className="list-hint">Bu sohbette henüz mesaj yok.</p>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`message-bubble ${msg.role}`}>
          {msg.role === 'assistant' ? (
            <>
              <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
              {msg.model && (
                <span className="msg-model-label">
                  {msg.model.includes('/') ? msg.model.split('/').pop() : msg.model}
                </span>
              )}
            </>
          ) : (
            msg.content
          )}
        </div>
      ))}

      {pendingMessage && <div className="message-bubble user">{pendingMessage}</div>}
      {isTyping && (
        <div className="message-bubble assistant typing-indicator">
          <span />
          <span />
          <span />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
