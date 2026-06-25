import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getMessages } from '../api';

export default function MessageList({ token, threadId, messagesRefreshKey }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMessages(token, threadId)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [threadId, messagesRefreshKey]);

  if (loading) return <p className="chat-hint">Yükleniyor…</p>;

  if (messages.length === 0) {
    return <p className="chat-hint">Bu sohbette henüz mesaj yok.</p>;
  }

  return (
    <div className="message-list">
      {messages.map(msg => (
        <div key={msg.id} className={`message-bubble ${msg.role}`}>
          {msg.role === 'assistant'
            ? <ReactMarkdown>{msg.content}</ReactMarkdown>
            : msg.content
          }
        </div>
      ))}
    </div>
  );
}
