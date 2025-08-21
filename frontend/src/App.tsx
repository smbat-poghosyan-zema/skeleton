import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './features/auth/RequireAuth';
import RequireAdmin from './features/auth/RequireAdmin';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import RestaurantsList from './features/restaurants/RestaurantsList';
import RestaurantDetail from './features/restaurants/RestaurantDetail';
import MenuItems from './features/menu/MenuItems';
import UsersAdmin from './features/admin/UsersAdmin';
import RestaurantsAdmin from './features/admin/RestaurantsAdmin';
import MenuAdmin from './features/admin/MenuAdmin';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth />} path="/app">
        <Route element={<AppLayout />}>
          <Route path="restaurants" element={<RestaurantsList />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="restaurants/:id/menu" element={<MenuItems />} />
          <Route element={<RequireAdmin />} path="admin">
            <Route path="users" element={<UsersAdmin />} />
            <Route path="restaurants" element={<RestaurantsAdmin />} />
            <Route path="restaurants/:id/menu" element={<MenuAdmin />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
