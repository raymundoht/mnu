import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute() {
  const { loading, session, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-xs uppercase tracking-widest">Validando acceso...</div>;
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
