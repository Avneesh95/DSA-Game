import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * Wraps a route element and redirects to /login when there is no
 * valid token. Doesn't re-verify the token with the server on every
 * render (that happens via the 401 interceptor) — this is purely a
 * client-side gate for UX.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
