import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Trash2, ExternalLink, Pencil, FileText, Globe, FileEdit } from 'lucide-react';
import { deleteProposal, listProposals } from '../../services/proposalsService';

const statusConfig = {
  draft: { classes: 'bg-neutral-800/80 text-neutral-300 border border-neutral-700', label: 'Borrador', dotColor: 'bg-neutral-400' },
  published: { classes: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50', label: 'Publicada', dotColor: 'bg-emerald-400' },
  archived: { classes: 'bg-amber-950/40 text-amber-300 border border-amber-900/50', label: 'Archivada', dotColor: 'bg-amber-400' },
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [proposalToDelete, setProposalToDelete] = useState(null); const [deleting, setDeleting] = useState(false);
  const load = async () => { setLoading(true); setError(''); const { data, error: queryError } = await listProposals(); if (queryError) setError('No fue posible cargar las cotizaciones.'); setProposals(data ?? []); setLoading(false); };
  useEffect(() => {
    let active = true;
    listProposals().then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) setError('No fue posible cargar las cotizaciones.');
      setProposals(data ?? []);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  const totals = useMemo(() => ({ total: proposals.length, published: proposals.filter((p) => p.status === 'published').length, draft: proposals.filter((p) => p.status === 'draft').length }), [proposals]);
  const handleDelete = async () => {
    if (!proposalToDelete) return;
    setDeleting(true); setError('');
    const { error: deleteError } = await deleteProposal(proposalToDelete.id);
    setDeleting(false);
    if (deleteError) { setError(`No fue posible eliminar: ${deleteError.message}`); setProposalToDelete(null); return; }
    setProposals((current) => current.filter((proposal) => proposal.id !== proposalToDelete.id));
    setProposalToDelete(null);
  };

  const statCards = [
    { label: 'Total', value: totals.total, icon: FileText, gradient: 'from-neutral-800 to-neutral-900', iconColor: 'text-amber-400' },
    { label: 'Publicadas', value: totals.published, icon: Globe, gradient: 'from-emerald-950/50 to-neutral-900', iconColor: 'text-emerald-400' },
    { label: 'Borradores', value: totals.draft, icon: FileEdit, gradient: 'from-amber-950/30 to-neutral-900', iconColor: 'text-amber-400' },
  ];

  return (
    <div className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto space-y-8">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div>
          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-amber-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 status-pulse-dot" />
            Panel de control
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Cotizaciones</h1>
          <p className="text-sm text-neutral-500 mt-2 font-light">Crea, organiza y publica propuestas comerciales.</p>
        </div>
        <Link to="/admin/cotizaciones/nueva" className="px-6 py-3.5 bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest btn-shimmer flex items-center gap-2 group w-fit">
          <Plus size={14} className="group-hover:rotate-90 transition-transform" />
          Nueva cotización
        </Link>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, iconColor }) => (
          <div key={label} className={`bg-gradient-to-br ${gradient} border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 group`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold">{label}</span>
              <Icon size={16} className={`${iconColor} opacity-40 group-hover:opacity-80 transition-opacity`} />
            </div>
            <p className="text-4xl font-black mt-3 tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* ─── Proposals Table ─── */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            Propuestas comerciales
          </h2>
          <button onClick={load} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors flex items-center gap-2 group">
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-800 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-xs text-neutral-500">Cargando cotizaciones...</p>
          </div>
        ) : error && proposals.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-red-300 mb-4">{error}</p>
            <button onClick={load} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Intentar nuevamente</button>
          </div>
        ) : proposals.length === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto mb-5 flex items-center justify-center text-amber-400">
              <Plus size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Aún no hay cotizaciones</h3>
            <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">Crea la primera propuesta y publícala como una landing personalizada.</p>
            <Link to="/admin/cotizaciones/nueva" className="inline-flex items-center gap-2 mt-5 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors group">
              Crear cotización <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80">
            {error && <p className="p-4 text-xs text-red-300 bg-red-950/20">{error}</p>}
            {proposals.map((p) => {
              const config = statusConfig[p.status] || statusConfig.draft;
              return (
                <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-800/20 transition-all duration-300 group/row relative">
                  {/* Hover accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                  <div className="pl-2">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1">{p.client_name}</p>
                    <h3 className="font-black uppercase tracking-tight group-hover/row:text-amber-400 transition-colors">{p.name}</h3>
                    <p className="text-xs text-neutral-600 mt-1 font-mono">/cotizacion/{p.slug}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pl-2 md:pl-0">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest ${config.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${p.status === 'published' ? 'status-pulse-dot' : ''}`} />
                      {config.label}
                    </span>
                    <Link to={`/admin/cotizaciones/${p.id}/editar`} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                      <Pencil size={12} /> Editar
                    </Link>
                    {p.status === 'published' && (
                      <Link to={`/cotizacion/${p.slug}`} target="_blank" className="text-[10px] uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <ExternalLink size={12} /> Ver
                      </Link>
                    )}
                    <button onClick={() => setProposalToDelete(p)} className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-red-400 transition-colors flex items-center gap-1.5">
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Delete Modal ─── */}
      {proposalToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="w-full max-w-md glass rounded-3xl p-7 shadow-2xl shadow-black/50 anim-fade-in-up">
            <span className="text-[9px] font-black uppercase tracking-[.3em] text-red-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Acción permanente
            </span>
            <h2 id="delete-title" className="text-2xl font-black uppercase tracking-tight mt-3">¿Eliminar cotización?</h2>
            <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
              Se eliminará <strong className="text-white">{proposalToDelete.name}</strong> y su enlace dejará de funcionar.
            </p>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setProposalToDelete(null)} disabled={deleting} className="px-5 py-3 rounded-full border border-neutral-700 text-[9px] font-black uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={deleting} className="px-5 py-3 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-red-400 transition-colors flex items-center gap-2">
                {deleting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Eliminando...</>
                ) : (
                  'Sí, eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
