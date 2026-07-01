import { Navigate } from 'react-router-dom';

// Token yoksa korumalı içeriği göstermeyip /login'e yönlendirir.
// `replace`: geçmişe /chat eklenmez, böylece geri tuşu login↔chat döngüsüne düşmez.
export default function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
