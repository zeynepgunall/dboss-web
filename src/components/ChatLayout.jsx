import { useState } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import { createThread, sendChat } from '../api';

export default function ChatLayout({ token, onLogout }) {
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sendError, setSendError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  function handleNewThread() {
    setSelectedThreadId(null);
    setIsDraft(true);
  }

  function handleSelectThread(id) {
    setSelectedThreadId(id);
    setIsDraft(false);
  }

  function handleDeleteThread(id) {
    if (selectedThreadId === id) {
      setSelectedThreadId(null);
      setIsDraft(false);
    }
  }

  async function handleSend(content) {
    setSendError(null);
    setPendingMessage(content);
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
      await sendChat(token, threadId, content, selectedModel);
      setInputText('');
      setMessagesRefreshKey(k => k + 1);
      setRefreshKey(k => k + 1);
    } catch {
      setSendError('Mesaj gönderilemedi. Tekrar dene.');
    } finally {
      setPendingMessage(null);
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
        onDeleteThread={handleDeleteThread}
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
                isTyping={sending}
                pendingMessage={pendingMessage}
              />
            : <p className="chat-hint">Bir sohbet seç veya yeni başlat.</p>
        }
        {showInput && (
          <MessageInput
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            disabled={sending}
            error={sendError}
            topSlot={<ModelSelector value={selectedModel} onChange={setSelectedModel} />}
          />
        )}
        <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
      </main>
    </div>
  );
}
