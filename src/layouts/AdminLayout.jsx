import { Outlet, Link, useNavigate } from 'react-router-dom';
import mnuBlanco from '../assets/MNU-BLANCO.webp';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => { await signOut(); navigate('/admin/login', { replace: true }); };
  return (
    <div className="bg-neutral-950 text-white min-h-screen font-sans antialiased flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={mnuBlanco} alt="mnü" className="h-6 object-contain" />
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] bg-neutral-800 px-2.5 py-1 rounded-full text-amber-400">
            Admin Panel
          </span>
        </div>
        <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <Link to="/admin/cotizaciones" className="text-neutral-300 hover:text-amber-400 transition-colors">
            Cotizaciones
          </Link>
          <span className="hidden md:inline text-neutral-500 normal-case tracking-normal font-normal">{user?.email}</span>
          <button onClick={handleSignOut} className="text-neutral-300 hover:text-amber-400 transition-colors">Salir</button>
          <Link to="/" className="text-neutral-500 hover:text-white transition-colors text-[10px] tracking-widest">
            ← Sitio Web
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-900 py-6 px-6 text-center text-neutral-500 text-[10px] uppercase tracking-widest">
        mnü digital · administración de propuestas
      </footer>
    </div>
  );
}
