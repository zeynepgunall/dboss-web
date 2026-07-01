import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import { createThread, sendChat } from '../api';

export default function ChatLayout({ token, onLogout }) {
  // URL kaynak: /chat/:threadId → seçili thread; /chat → taslak (yeni sohbet).
  const { threadId } = useParams();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = useState(0);
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sendError, setSendError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  function handleDeleteThread() {
    // Açık olan thread silindiyse taslağa dön.
    navigate('/chat');
  }

  async function handleSend(content) {
    setSendError(null);
    setPendingMessage(content);
    setSending(true);
    try {
      let id = threadId;
      if (!id) {
        // Taslaktan gönderim: önce yeni thread oluştur, sonra URL'i ona taşı.
        const thread = await createThread(token);
        id = thread.id;
        setRefreshKey((k) => k + 1);
        navigate(`/chat/${id}`);
      }
      await sendChat(token, id, content, selectedModel);
      setInputText('');
      setMessagesRefreshKey((k) => k + 1);
      setRefreshKey((k) => k + 1);
    } catch {
      setSendError('Mesaj gönderilemedi. Tekrar dene.');
    } finally {
      setPendingMessage(null);
      setSending(false);
    }
  }

  return (
    <div className="chat-layout">
      <Sidebar
        token={token}
        selectedThreadId={threadId ?? null}
        onSelectThread={(id) => navigate(`/chat/${id}`)}
        onNewThread={() => navigate('/chat')}
        onDeleteThread={handleDeleteThread}
        refreshKey={refreshKey}
      />
      <main className="chat-main">
        {threadId ? (
          <MessageList
            token={token}
            threadId={threadId}
            messagesRefreshKey={messagesRefreshKey}
            isTyping={sending}
            pendingMessage={pendingMessage}
          />
        ) : (
          <p className="chat-hint">Merhaba! Nasıl yardımcı olabilirim?</p>
        )}
        <MessageInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
          disabled={sending}
          error={sendError}
          topSlot={<ModelSelector value={selectedModel} onChange={setSelectedModel} />}
        />
        <button className="logout-btn" onClick={onLogout}>
          Çıkış Yap
        </button>
      </main>
    </div>
  );
}
