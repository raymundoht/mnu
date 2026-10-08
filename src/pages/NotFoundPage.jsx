import { Link } from 'react-router-dom';
import { brand } from '../data/assets';
import { ArrowLeft } from '../components/icons';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-6 md:p-12">
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-6 border-b border-neutral-100">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 text-amber-500" /> Volver al sitio principal
        </Link>
        <img src={brand.mnuNegro} alt="mnü" className="h-6 object-contain opacity-70" />
      </header>

      <main className="max-w-xl w-full mx-auto my-auto py-16 text-center space-y-6">
        <span className="text-8xl md:text-9xl font-black text-amber-500 tracking-tighter">404</span>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900">
          Página no encontrada
        </h1>
        <p className="text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
          La ruta que estás buscando no existe o fue movida a otra dirección dentro del sitio de mnü marketing.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all shadow-lg hover:scale-105 duration-300"
          >
            Volver al inicio
          </Link>
        </div>
      </main>

      <footer className="max-w-4xl w-full mx-auto text-center py-6 border-t border-neutral-100 text-[9px] uppercase font-bold tracking-[0.3em] text-neutral-400">
        © 2026 MNÜ DIGITAL · AGENCIA DE MARKETING ESTRATÉGICO
      </footer>
    </div>
  );
}
