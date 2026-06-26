import { useState, useEffect } from 'react';
import { getModels } from '../api';

export default function ModelSelector({ value, onChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels()
      .then(data => {
        setModels(data);
        // İlk model id'sini yukarı bildir ki ChatLayout'taki state dolsun
        if (data.length > 0 && !value) onChange(data[0].id);
      })
      .catch(() => {/* sessiz hata: dropdown boş kalır */})
      .finally(() => setLoading(false));
  }, []); // [] → sadece mount'ta çalışır, her render'da değil

  if (loading) return <span className="model-selector-loading">Modeller yükleniyor…</span>;
  if (models.length === 0) return null;

  return (
    <select
      className="model-selector"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    >
      {models.map(m => (
        <option key={m.id} value={m.id}>{m.label}</option>
      ))}
    </select>
  );
}
