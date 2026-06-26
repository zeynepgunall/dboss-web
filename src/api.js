import { API_URL } from './config';
import { clearToken } from './auth';

function checkStatus(res, errorMsg) {
  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent('authExpired'));
    throw new Error('Session sona erdi.');
  }
  if (!res.ok) throw new Error(errorMsg);
}

export async function getModels() {
  const res = await fetch(`${API_URL}/models`);
  if (!res.ok) throw new Error('Model listesi alınamadı.');
  return res.json();
}

export async function getThreads(token) {
  const res = await fetch(`${API_URL}/threads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  checkStatus(res, 'Thread listesi alınamadı.');
  return res.json();
}

export async function getMessages(token, threadId) {
  const res = await fetch(`${API_URL}/threads/${threadId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  checkStatus(res, 'Mesajlar alınamadı.');
  return res.json();
}

export async function sendChat(token, threadId, content, model) {
  const res = await fetch(`${API_URL}/threads/${threadId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, ...(model ? { model } : {}) }),
  });
  checkStatus(res, 'Mesaj gönderilemedi.');
  return res.json();
}

export async function deleteThread(token, threadId) {
  const res = await fetch(`${API_URL}/threads/${threadId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  checkStatus(res, 'Sohbet silinemedi.');
}

export async function createThread(token) {
  const res = await fetch(`${API_URL}/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  checkStatus(res, 'Yeni sohbet oluşturulamadı.');
  return res.json();
}
