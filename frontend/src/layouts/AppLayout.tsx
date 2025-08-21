import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export default function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/app/restaurants">Restaurants</Link>
        {user?.role === 'admin' && <Link to="/app/admin/users">Admin</Link>}
        <span className="flex-1" />
        {user && (
          <button onClick={logout} className="underline">
            Logout
          </button>
        )}
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
