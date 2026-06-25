import { useState } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { createThread, sendChat } from '../api';

export default function ChatLayout({ token, onLogout }) {
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);
  const [sending, setSending] = useState(false);

  function handleNewThread() {
    setSelectedThreadId(null);
    setIsDraft(true);
  }

  function handleSelectThread(id) {
    setSelectedThreadId(id);
    setIsDraft(false);
  }

  async function handleSend(content) {
    setSending(true);
    try {
      let threadId = selectedThreadId;
      if (isDraft) {
        const thread = await createThread(token);
        threadId = thread.id;
        setSelectedThreadId(threadId);
        setIsDraft(false);
        setRefreshKey(k => k + 1);
      }
      await sendChat(token, threadId, content);
      setMessagesRefreshKey(k => k + 1);
      setRefreshKey(k => k + 1);
    } catch {
      // ileride hata mesajı eklenebilir
    } finally {
      setSending(false);
    }
  }

  const showInput = isDraft || selectedThreadId !== null;

  return (
    <div className="chat-layout">
      <Sidebar
        token={token}
        selectedThreadId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        refreshKey={refreshKey}
      />
      <main className="chat-main">
        {isDraft
          ? <p className="chat-hint">Yeni sohbet — bir mesaj yazarak başla.</p>
          : selectedThreadId
            ? <MessageList
                token={token}
                threadId={selectedThreadId}
                messagesRefreshKey={messagesRefreshKey}
              />
            : <p className="chat-hint">Bir sohbet seç veya yeni başlat.</p>
        }
        {sending && <p className="sending-hint">Yanıt bekleniyor…</p>}
        {showInput && <MessageInput onSend={handleSend} disabled={sending} />}
        <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
      </main>
    </div>
  );
}
