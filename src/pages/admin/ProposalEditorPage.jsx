import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, GripVertical, Save, Globe, ExternalLink, FileText, Image, Briefcase, LayoutList, AlignLeft, DollarSign, Upload, X, Images } from 'lucide-react';
import { getProposalForAdmin, saveProposal, uploadProposalAsset } from '../../services/proposalsService';
import { getProposalMedia, getProposalMediaByCategory, proposalDefaults } from '../../data/proposalMedia';

const iconOptions = [['camera', 'Cámara'], ['video', 'Video'], ['megaphone', 'Campañas'], ['palette', 'Diseño'], ['location', 'Ubicación'], ['chart', 'Resultados'], ['target', 'Objetivo'], ['sparkles', 'Estrategia']];
const emptyService = () => ({ title: '', description: '', icon: 'sparkles' });
const initialForm = { client_name: '', name: '', slug: '', title: '', status: 'draft', category: 'empresarial', heroImage: proposalDefaults.empresarial.hero, featureImage: proposalDefaults.empresarial.feature, clientLogo: '', gallery: [], eyebrow: 'Propuesta comercial', summary: '', objective: '', servicesTitle: 'Estrategia de trabajo', servicesIntro: '', services: [emptyService()], strategyTitle: 'Plan de trabajo', strategyBody: '', highlights: [''], price: '', currency: 'MXN', period: 'mensual', priceNote: 'Inversión más IVA.', whatsappMessage: 'Hola, revisé la propuesta y me interesa avanzar. ¿Podemos platicar?' };
const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const MAX_ASSET_SIZE = 8 * 1024 * 1024;
const makeFolderId = () => globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const sectionIcons = {
  1: Briefcase,
  2: FileText,
  3: Image,
  4: LayoutList,
  5: AlignLeft,
  6: DollarSign,
};

function Input({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="editor-label">{label}</span>
      <input {...props} className="editor-input-premium" />
    </label>
  );
}

function Textarea({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="editor-label">{label}</span>
      <textarea {...props} className="editor-input-premium resize-y min-h-24" />
    </label>
  );
}

export default function ProposalEditorPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [form, setForm] = useState(initialForm); const [loading, setLoading] = useState(Boolean(id)); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [assetError, setAssetError] = useState(''); const [uploadingAsset, setUploadingAsset] = useState(''); const [draggingImages, setDraggingImages] = useState(false); const [slugEdited, setSlugEdited] = useState(Boolean(id)); const [assetFolderId] = useState(() => id || makeFolderId());
  useEffect(() => {
    if (!id) return;
    let active = true;
    getProposalForAdmin(id).then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) { setError('No fue posible cargar la cotización.'); setLoading(false); return; }
      const sections = [...(data.proposal_sections ?? [])].sort((a, b) => a.order_index - b.order_index);
      const hero = sections.find((s) => s.section_type === 'hero')?.content ?? {}; const services = sections.find((s) => s.section_type === 'services'); const strategy = sections.find((s) => s.section_type === 'text'); const pricing = sections.find((s) => s.section_type === 'pricing')?.content ?? {};
      const category = hero.category ?? 'empresarial';
      setForm({ ...initialForm, client_name: data.client_name, name: data.name, slug: data.slug, title: data.title, status: data.status, category, heroImage: hero.heroImage ?? proposalDefaults[category]?.hero, featureImage: hero.featureImage ?? proposalDefaults[category]?.feature, clientLogo: hero.clientLogo ?? '', gallery: Array.isArray(hero.gallery) ? hero.gallery : [], eyebrow: hero.eyebrow ?? initialForm.eyebrow, summary: hero.summary ?? '', objective: hero.objective ?? '', servicesTitle: services?.title ?? initialForm.servicesTitle, servicesIntro: services?.content?.intro ?? '', services: services?.content?.items?.length ? services.content.items : [emptyService()], strategyTitle: strategy?.title ?? initialForm.strategyTitle, strategyBody: strategy?.content?.body ?? '', highlights: strategy?.content?.highlights?.length ? strategy.content.highlights : [''], price: pricing.price ?? '', currency: pricing.currency ?? 'MXN', period: pricing.period ?? 'mensual', priceNote: pricing.note ?? initialForm.priceNote, whatsappMessage: pricing.whatsappMessage ?? initialForm.whatsappMessage });
      setLoading(false);
    });
    return () => { active = false; };
  }, [id]);
  const publicUrl = useMemo(() => `/cotizacion/${form.slug || 'nombre-del-cliente'}`, [form.slug]);
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateService = (index, key, value) => setForm((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const updateHighlight = (index, value) => setForm((current) => ({ ...current, highlights: current.highlights.map((item, itemIndex) => itemIndex === index ? value : item) }));
  const handleName = (value) => setForm((current) => ({ ...current, name: value, slug: slugEdited ? current.slug : slugify(value) }));
  const handleCategory = (category) => setForm((current) => ({ ...current, category, heroImage: proposalDefaults[category].hero, featureImage: proposalDefaults[category].feature }));
  const validateAsset = (file, kind) => {
    if (kind === 'logo' && file.type !== 'image/png') return 'El logo debe ser un archivo PNG.';
    if (kind === 'gallery' && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'Las imágenes deben ser PNG, JPG o WebP.';
    if (file.size > MAX_ASSET_SIZE) return 'Cada imagen debe pesar máximo 8 MB.';
    return '';
  };
  const uploadLogo = async (file) => {
    if (!file) return;
    const validationError = validateAsset(file, 'logo');
    if (validationError) { setAssetError(validationError); return; }
    setAssetError(''); setUploadingAsset('logo');
    const { data, error: uploadError } = await uploadProposalAsset(assetFolderId, file, 'logo');
    setUploadingAsset('');
    if (uploadError) { setAssetError(`No se pudo subir el logo. ${uploadError.message}`); return; }
    setValue('clientLogo', data.url);
  };
  const uploadGallery = async (files) => {
    const selected = [...files];
    if (!selected.length) return;
    if (form.gallery.length + selected.length > 8) { setAssetError('La galería admite hasta 8 imágenes.'); return; }
    const validationError = selected.map((file) => validateAsset(file, 'gallery')).find(Boolean);
    if (validationError) { setAssetError(validationError); return; }
    setAssetError(''); setUploadingAsset('gallery');
    const results = await Promise.all(selected.map((file) => uploadProposalAsset(assetFolderId, file, 'gallery')));
    setUploadingAsset('');
    const uploaded = results.filter((result) => !result.error).map((result) => result.data.url);
    if (uploaded.length) setForm((current) => ({ ...current, gallery: [...current.gallery, ...uploaded] }));
    if (results.some((result) => result.error)) setAssetError('Algunas imágenes no se pudieron subir. Revisa la configuración de Storage e inténtalo de nuevo.');
  };
  const handleSave = async (status) => {
    if (!form.client_name.trim() || !form.name.trim() || !form.slug.trim() || !form.title.trim()) { setError('Completa cliente, nombre interno, enlace y título principal.'); return; }
    if (uploadingAsset) return;
    setSaving(true); setError('');
    const sections = [
      { section_type: 'hero', title: form.title, content: { category: form.category, heroImage: form.heroImage, featureImage: form.featureImage, clientLogo: form.clientLogo, gallery: form.gallery, eyebrow: form.eyebrow, summary: form.summary, objective: form.objective } },
      { section_type: 'services', title: form.servicesTitle, content: { intro: form.servicesIntro, items: form.services.filter((item) => item.title.trim()) } },
      { section_type: 'text', title: form.strategyTitle, content: { body: form.strategyBody, highlights: form.highlights.filter(Boolean) } },
      { section_type: 'pricing', title: 'Inversión', content: { price: form.price, currency: form.currency, period: form.period, note: form.priceNote, whatsappMessage: form.whatsappMessage } },
    ];
    const { data, error: saveError } = await saveProposal({ id, proposal: { ...form, status }, sections });
    setSaving(false);
    if (saveError) { setError(saveError.code === '23505' ? 'Ese enlace ya está siendo utilizado.' : `No fue posible guardar: ${saveError.message}`); return; }
    setForm((current) => ({ ...current, status })); navigate(`/admin/cotizaciones/${data.id}/editar`, { replace: true });
  };

  if (loading) return (
    <div className="flex-1 grid place-items-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-neutral-800 border-t-amber-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-neutral-500">Cargando editor...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 px-5 py-8 md:p-10 max-w-7xl w-full mx-auto">
      <style>{`.editor-label{display:block;margin-bottom:.5rem;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.18em;color:#737373}`}</style>

      {/* ─── Header ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-7 mb-8 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div>
          <Link to="/admin/cotizaciones" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Cotizaciones
          </Link>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-3">{id ? 'Editar propuesta' : 'Nueva propuesta'}</h1>
          <p className="text-xs text-neutral-500 mt-2">Organiza la propuesta y publícala como una landing personalizada.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleSave('draft')} disabled={saving || Boolean(uploadingAsset)} className="px-5 py-3 rounded-full border border-neutral-700 text-[9px] font-black uppercase tracking-widest hover:border-white hover:bg-white/5 disabled:opacity-50 transition-all flex items-center gap-2 group">
            <Save size={13} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            Guardar borrador
          </button>
          <button onClick={() => handleSave('published')} disabled={saving || Boolean(uploadingAsset)} className="px-5 py-3 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest btn-shimmer disabled:opacity-50 flex items-center gap-2">
            {saving ? (
              <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Guardando...</>
            ) : (
              <><Globe size={13} /> Publicar</>
            )}
          </button>
          {id && form.status === 'published' && (
            <Link to={publicUrl} target="_blank" className="px-5 py-3 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2">
              <ExternalLink size={13} /> Vista pública
            </Link>
          )}
        </div>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div role="alert" className="mb-6 border border-red-900/60 bg-red-950/30 text-red-300 rounded-xl px-4 py-3 text-xs flex items-center gap-2 anim-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </div>
      )}

      {/* ─── Content Grid ─── */}
      <div className="grid xl:grid-cols-[1fr_330px] gap-7 items-start">
        <div className="space-y-6">

          {/* 01 — Datos generales */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">01</span> Datos generales</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Cliente / empresa" value={form.client_name} onChange={(e) => setValue('client_name', e.target.value)} />
              <Input label="Nombre interno" value={form.name} onChange={(e) => handleName(e.target.value)} />
              <Input label="Enlace público" value={form.slug} onChange={(e) => { setSlugEdited(true); setValue('slug', slugify(e.target.value)); }} />
              <label>
                <span className="editor-label">Estilo de la propuesta</span>
                <select value={form.category} onChange={(e) => handleCategory(e.target.value)} className="editor-input-premium">
                  <option value="empresarial">Empresarial</option>
                  <option value="gastronomico">Gastronómico</option>
                  <option value="inmobiliario">Inmobiliario</option>
                </select>
              </label>
            </div>
            <p className="text-[10px] text-neutral-600 mt-3 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              Enlace: {publicUrl}
            </p>
          </section>

          {/* 02 — Portada y objetivo */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">02</span> Portada y objetivo</h2>
            <div className="space-y-4">
              <Input label="Etiqueta superior" value={form.eyebrow} onChange={(e) => setValue('eyebrow', e.target.value)} />
              <Input label="Título principal" value={form.title} onChange={(e) => setValue('title', e.target.value)} />
              <Textarea label="Introducción de la propuesta" value={form.summary} onChange={(e) => setValue('summary', e.target.value)} />
              <Textarea label="Objetivo" value={form.objective} onChange={(e) => setValue('objective', e.target.value)} />
            </div>
          </section>

          {/* 03 — Dirección visual */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">03</span> Dirección visual</h2>
            <p className="text-xs text-neutral-500 -mt-3 mb-6">Elige una fotografía para la portada y otra para el bloque editorial. Las opciones cambian según la especialidad.</p>
            {[['heroImage', 'Imagen de portada'], ['featureImage', 'Imagen editorial']].map(([field, label]) => (
              <div key={field} className="mb-7 last:mb-0">
                <span className="editor-label">{label}</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getProposalMediaByCategory(form.category).map((media) => (
                    <button
                      type="button"
                      key={media.key}
                      onClick={() => setValue(field, media.key)}
                      className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 group ${
                        form[field] === media.key
                          ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
                          : 'border-neutral-800 hover:border-neutral-600 hover:shadow-lg hover:shadow-black/30'
                      }`}
                    >
                      <img src={media.src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <span className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black to-transparent text-[8px] font-black uppercase tracking-wider text-white">{media.label}</span>
                      {form[field] === media.key && <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-black grid place-items-center text-xs font-black shadow-lg">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 04 — Identidad y galería */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">04</span> Identidad y galería</h2>
            <p className="text-xs text-neutral-500 -mt-3 mb-6">Personaliza la propuesta con la marca del cliente y agrega imágenes para mostrar su proyecto.</p>
            <div className="grid md:grid-cols-[190px_1fr] gap-5 items-start">
              <div>
                <span className="editor-label">Logo del cliente · PNG</span>
                <div className="relative min-h-36 rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-4 flex items-center justify-center overflow-hidden">
                  {form.clientLogo ? (
                    <>
                      <div className="w-full h-28 rounded-xl bg-white p-3 grid place-items-center"><img src={form.clientLogo} alt="Logo del cliente" className="max-h-full max-w-full object-contain" /></div>
                      <button type="button" aria-label="Quitar logo del cliente" onClick={() => setValue('clientLogo', '')} className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/10 grid place-items-center text-white hover:text-red-300"><X size={14} /></button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload size={18} className="mx-auto text-amber-400 mb-2" />
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400">Logo MNU por defecto</p>
                      <p className="text-[9px] text-neutral-600 mt-1">Sube el del cliente para reemplazarlo</p>
                    </div>
                  )}
                  <input aria-label="Subir logo PNG del cliente" type="file" accept="image/png" disabled={Boolean(uploadingAsset)} onChange={(event) => { uploadLogo(event.target.files?.[0]); event.target.value = ''; }} className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none" />
                </div>
                <p className="text-[9px] text-neutral-600 mt-2">PNG · máximo 8 MB</p>
                {uploadingAsset === 'logo' && <p className="text-[10px] text-amber-400 mt-2 animate-pulse">Subiendo logo...</p>}
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <span className="editor-label !mb-1">Imágenes de la cotización</span>
                    <p className="text-[10px] text-neutral-600">{form.gallery.length} de 8 · PNG, JPG o WebP</p>
                  </div>
                  <label className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-700 text-[9px] font-black uppercase tracking-widest text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/5 transition-colors ${uploadingAsset ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                    <Images size={13} /> Agregar imágenes
                    <input aria-label="Agregar imágenes a la cotización" type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={Boolean(uploadingAsset) || form.gallery.length >= 8} onChange={(event) => { uploadGallery(event.target.files ?? []); event.target.value = ''; }} className="sr-only" />
                  </label>
                </div>
                {form.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.gallery.map((src, index) => (
                      <div key={`${src}-${index}`} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 group/gallery">
                        <img src={src} alt={`Imagen de galería ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/gallery:scale-105" />
                        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[9px] text-white">{String(index + 1).padStart(2, '0')}</span>
                        <button type="button" aria-label={`Quitar imagen ${index + 1}`} onClick={() => setValue('gallery', form.gallery.filter((_, itemIndex) => itemIndex !== index))} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 border border-white/10 grid place-items-center text-white hover:text-red-300 opacity-0 group-hover/gallery:opacity-100 focus:opacity-100 transition-opacity"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <label onDragOver={(event) => { event.preventDefault(); setDraggingImages(true); }} onDragLeave={() => setDraggingImages(false)} onDrop={(event) => { event.preventDefault(); setDraggingImages(false); uploadGallery(event.dataTransfer.files); }} className={`min-h-36 rounded-2xl border border-dashed ${draggingImages ? 'border-amber-400 bg-amber-500/10' : 'border-neutral-700 bg-neutral-950/60'} flex flex-col items-center justify-center text-center px-5 ${uploadingAsset ? 'opacity-50' : 'cursor-pointer hover:border-amber-500/50 hover:bg-neutral-950'} transition-colors`}>
                    <Images size={22} className="text-neutral-600 mb-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Arrastra o elige tus imágenes</span>
                    <span className="text-[9px] text-neutral-600 mt-2">Hasta 8 archivos · 8 MB por imagen</span>
                    <input aria-label="Seleccionar imágenes para la cotización" type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={Boolean(uploadingAsset)} onChange={(event) => { uploadGallery(event.target.files ?? []); event.target.value = ''; }} className="sr-only" />
                  </label>
                )}
                {uploadingAsset === 'gallery' && <p className="text-[10px] text-amber-400 mt-3 animate-pulse">Subiendo imágenes...</p>}
              </div>
            </div>
            {assetError && <p role="alert" className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-xs text-red-300">{assetError}</p>}
          </section>

          {/* 05 — Servicios con iconos */}
          <section className="editor-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="editor-heading !mb-0"><span className="section-badge">05</span> Servicios con iconos</h2>
              <button onClick={() => setValue('services', [...form.services, emptyService()])} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors group">
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Agregar
              </button>
            </div>
            <div className="space-y-4 mb-5">
              <Input label="Título de sección" value={form.servicesTitle} onChange={(e) => setValue('servicesTitle', e.target.value)} />
              <Textarea label="Introducción breve" value={form.servicesIntro} onChange={(e) => setValue('servicesIntro', e.target.value)} />
            </div>
            <div className="space-y-3">
              {form.services.map((service, index) => (
                <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 grid md:grid-cols-[28px_140px_1fr_1.4fr_28px] gap-3 items-center hover:border-neutral-700 transition-colors group/item">
                  <GripVertical size={17} className="text-neutral-700 hidden md:block group-hover/item:text-neutral-500 transition-colors" />
                  <select aria-label={`Icono del servicio ${index + 1}`} value={service.icon} onChange={(e) => updateService(index, 'icon', e.target.value)} className="editor-input-premium">{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                  <input aria-label={`Nombre del servicio ${index + 1}`} placeholder="Nombre del servicio" value={service.title} onChange={(e) => updateService(index, 'title', e.target.value)} className="editor-input-premium" />
                  <input aria-label={`Descripción del servicio ${index + 1}`} placeholder="Descripción breve" value={service.description} onChange={(e) => updateService(index, 'description', e.target.value)} className="editor-input-premium" />
                  <button aria-label="Eliminar servicio" onClick={() => setValue('services', form.services.filter((_, itemIndex) => itemIndex !== index))} className="text-neutral-600 hover:text-red-400 transition-colors">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 06 — Plan de trabajo */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">06</span> Plan de trabajo</h2>
            <div className="space-y-4">
              <Input label="Título" value={form.strategyTitle} onChange={(e) => setValue('strategyTitle', e.target.value)} />
              <Textarea label="Descripción" value={form.strategyBody} onChange={(e) => setValue('strategyBody', e.target.value)} />
              <div>
                <span className="editor-label">Puntos destacados</span>
                <div className="space-y-2">
                  {form.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <input value={highlight} onChange={(e) => updateHighlight(index, e.target.value)} placeholder="Ej. Estrategia mensual basada en resultados" className="editor-input-premium" />
                      <button aria-label="Eliminar punto" onClick={() => setValue('highlights', form.highlights.filter((_, itemIndex) => itemIndex !== index))} className="px-3 text-neutral-600 hover:text-red-400 transition-colors">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setValue('highlights', [...form.highlights, ''])} className="mt-3 text-[9px] uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Plus size={12} /> Agregar punto
                </button>
              </div>
            </div>
          </section>

          {/* 07 — Inversión y contacto */}
          <section className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">07</span> Inversión y contacto</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Precio" type="number" min="0" value={form.price} onChange={(e) => setValue('price', e.target.value)} />
              <label>
                <span className="editor-label">Moneda</span>
                <select value={form.currency} onChange={(e) => setValue('currency', e.target.value)} className="editor-input-premium">
                  <option>MXN</option>
                  <option>USD</option>
                </select>
              </label>
              <Input label="Periodicidad" value={form.period} onChange={(e) => setValue('period', e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Textarea label="Nota del precio" value={form.priceNote} onChange={(e) => setValue('priceNote', e.target.value)} />
              <Textarea label="Mensaje de WhatsApp" value={form.whatsappMessage} onChange={(e) => setValue('whatsappMessage', e.target.value)} />
            </div>
          </section>
        </div>

        {/* ─── Preview Sidebar ─── */}
        <aside className="xl:sticky xl:top-28 relative rounded-3xl overflow-hidden min-h-[520px] group">
          {/* Background Image */}
          <img src={getProposalMedia(form.heroImage, form.category, 'hero')?.src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s]" />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          {/* Content */}
          <div className="relative min-h-[520px] p-6 flex flex-col justify-end">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-[.3em] text-amber-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Vista rápida
              </span>
              {form.status === 'published' && (
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
                  Publicada
                </span>
              )}
            </div>
            {form.clientLogo && <div className="absolute top-16 left-6 w-24 h-14 rounded-xl bg-white/95 p-2 grid place-items-center shadow-xl"><img src={form.clientLogo} alt="Logo del cliente" className="max-w-full max-h-full object-contain" /></div>}
            <p className="text-xs font-bold uppercase mt-8 text-white/70">{form.client_name || 'Nombre del cliente'}</p>
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-[.9] mt-2 break-words text-white">{form.title || 'Tu propuesta comercial'}</h3>
            <p className="text-sm mt-5 leading-relaxed text-white/70 line-clamp-4">{form.summary || 'Aquí aparecerá la introducción que escribas para el cliente.'}</p>
            <div className="border-t border-white/20 mt-8 pt-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Inversión</p>
              <p className="text-3xl font-black mt-1 text-white">
                {form.price ? `$${Number(form.price).toLocaleString('es-MX')}` : '$—'}
                {' '}<span className="text-xs text-white/60">{form.currency}</span>
              </p>
              {form.gallery.length > 0 && <p className="text-[9px] uppercase tracking-widest text-white/50 mt-3">+ {form.gallery.length} imágenes de galería</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
