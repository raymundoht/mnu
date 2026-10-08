import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import mnuBlanco from '../../assets/MNU-BLANCO.webp';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { signIn, signOut, session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && session && isAdmin) navigate(location.state?.from || '/admin/cotizaciones', { replace: true });
    if (!loading && session && !isAdmin) {
      const timer = window.setTimeout(() => signOut(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [loading, session, isAdmin, navigate, location.state, signOut]);

  const displayedError = (!loading && session && !isAdmin)
    ? 'Esta cuenta no tiene acceso administrativo.'
    : error;

  const handleSubmit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('');
    const { error: authError } = await signIn(email.trim(), password);
    if (authError) setError('El correo o la contraseña no son correctos.');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* ─── Animated Floating Orbs ─── */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-amber-500/[.08] blur-[100px] animate-float-orb" />
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-amber-600/[.06] blur-[120px] animate-float-orb-alt" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/[.03] blur-[160px] animate-float-orb" style={{ animationDelay: '-8s' }} />

      {/* ─── Subtle Grid Pattern ─── */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* ─── Card ─── */}
      <div className="max-w-md w-full glass rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/50 space-y-8 relative z-10 anim-fade-in-up">

        {/* Logo with Glow */}
        <div className="flex justify-center anim-fade-in-up anim-delay-1">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-amber-500/20 scale-150 rounded-full" />
            <img src={mnuBlanco} alt="mnü" className="h-9 object-contain relative" />
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center anim-fade-in-up anim-delay-2">
          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-amber-400 mb-4">
            <span className="w-6 h-px bg-amber-400/60" />
            Área privada
            <span className="w-6 h-px bg-amber-400/60" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight">
            Acceso<br />administrativo
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-3 max-w-xs mx-auto">
            Gestiona y publica propuestas comerciales de MNU.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="anim-fade-in-up anim-delay-3">
            <label htmlFor="admin-email" className="block text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1),0_0_20px_rgba(245,158,11,0.06)] transition-all duration-300"
                placeholder="correo@empresa.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="anim-fade-in-up anim-delay-4">
            <label htmlFor="admin-password" className="block text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1),0_0_20px_rgba(245,158,11,0.06)] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error */}
          {displayedError && (
            <p role="alert" className="text-xs text-red-300 bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-center gap-2 anim-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {displayedError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="anim-fade-in-up anim-delay-5 w-full py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl btn-shimmer disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Verificando...
              </span>
            ) : (
              <>
                Ingresar al panel
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 anim-fade-in-up anim-delay-6">
          <span className="flex-1 h-px bg-neutral-800" />
          <span className="text-[9px] uppercase tracking-widest text-neutral-600">o</span>
          <span className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Back Link */}
        <Link to="/" className="block text-center text-[10px] uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors anim-fade-in-up anim-delay-6">
          ← Volver al sitio web
        </Link>
      </div>
    </div>
  );
}
