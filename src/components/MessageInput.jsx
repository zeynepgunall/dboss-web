import { useState } from 'react';

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <div className="message-input-area">
      <div className="message-input-row">
        <textarea
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir mesaj yaz… (Enter = gönder, Shift+Enter = yeni satır)"
          disabled={disabled}
        />
        <button onClick={submit} disabled={disabled || !text.trim()}>
          Gönder
        </button>
      </div>
    </div>
  );
}
