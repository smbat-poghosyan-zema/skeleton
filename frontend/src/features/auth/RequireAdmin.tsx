import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAdmin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <div className="p-4">Forbidden</div>;
  return <Outlet />;
}
