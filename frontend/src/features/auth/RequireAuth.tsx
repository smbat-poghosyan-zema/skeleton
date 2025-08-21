import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
