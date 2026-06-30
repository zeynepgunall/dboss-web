import { useState, useEffect } from 'react';
import { getModels } from '../api';

export default function ModelSelector({ value, onChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Model listesini yalnızca mount'ta bir kez çek.
  useEffect(() => {
    getModels()
      .then(setModels)
      .catch(() => {
        /* sessiz hata: dropdown boş kalır */
      })
      .finally(() => setLoading(false));
  }, []);

  // Liste gelince, henüz seçim yoksa ilk modeli varsayılan yap.
  // value seçilince effect tekrar koşar ama `!value` artık false → no-op (döngü yok).
  // onChange = setSelectedModel (kararlı state setter), bu yüzden deps güvenli.
  useEffect(() => {
    if (models.length > 0 && !value) onChange(models[0].id);
  }, [models, value, onChange]);

  if (loading)
    return <span className="model-selector-loading">Modeller yükleniyor…</span>;
  if (models.length === 0) return null;

  return (
    <select
      className="model-selector"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {models.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
    </select>
  );
}
