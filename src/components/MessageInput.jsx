export default function MessageInput({ value, onChange, onSend, disabled, error, topSlot }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
  }

  return (
    <div className="message-input-area">
      {topSlot && <div className="model-selector-row">{topSlot}</div>}
      {error && (
        <p className="send-error">{error}</p>
      )}
      <div className="message-input-row">
        <textarea
          rows={1}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir mesaj yaz… (Enter = gönder, Shift+Enter = yeni satır)"
          disabled={disabled}
        />
        <button onClick={submit} disabled={disabled || !value.trim()}>
          Gönder
        </button>
      </div>
    </div>
  );
}
