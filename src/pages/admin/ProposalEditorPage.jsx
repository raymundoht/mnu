import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Globe, ExternalLink, Upload, X, Images, Monitor, Smartphone, CheckCircle2, Camera, Video, Megaphone, Palette, MapPin, ChartNoAxesCombined, Target, Sparkles } from 'lucide-react';
import { getProposalForAdmin, saveProposal, uploadProposalAsset } from '../../services/proposalsService';
import { getProposalMedia, getProposalMediaByCategory, proposalDefaults } from '../../data/proposalMedia';
import mnuBlanco from '../../assets/MNU-BLANCO.webp';

const emptyService = () => ({ title: '', description: '', icon: 'sparkles' });
const emptyCustomSection = () => ({ title: '', intro: '', items: [] });
const iconOptions = [['camera', 'Cámara'], ['video', 'Video'], ['megaphone', 'Campañas'], ['palette', 'Diseño'], ['location', 'Ubicación'], ['chart', 'Resultados'], ['target', 'Objetivo'], ['sparkles', 'Estrategia']];
const serviceIcons = { camera: Camera, video: Video, megaphone: Megaphone, palette: Palette, location: MapPin, chart: ChartNoAxesCombined, target: Target, sparkles: Sparkles };
const isUploadedImage = (value) => typeof value === 'string' && /^https?:/.test(value);
const getEditorImage = (value, category, slot) => isUploadedImage(value) ? value : getProposalMedia(value, category, slot)?.src;
const getDescriptionLines = (description) => String(description ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
  const bullet = /^(?:·|•|▪|\*|-)\s*/.test(line);
  return { text: line.replace(/^(?:·|•|▪|\*|-)\s*/, ''), bullet };
});
const initialForm = { client_name: '', name: '', slug: '', title: '', status: 'draft', category: 'empresarial', heroImage: proposalDefaults.empresarial.hero, featureImage: proposalDefaults.empresarial.feature, clientLogo: '', gallery: [], eyebrow: 'Propuesta comercial', summary: '', objective: '', servicesTitle: 'Lo que incluye', servicesIntro: '', services: [emptyService()], additionalSections: [], strategyTitle: 'Plan de trabajo', strategyBody: '', highlights: [''], investment: '', price: '', currency: 'MXN', period: 'mensual', priceNote: '', whatsappMessage: 'Hola, revisé la propuesta y me interesa avanzar. ¿Podemos platicar?' };
const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const makeProposalSlug = (clientName, title, folderId) => {
  const base = slugify([clientName, title].filter(Boolean).join(' '));
  return base ? `${base}-${folderId.slice(-4)}` : `borrador-${folderId.slice(-8)}`;
};
const MAX_ASSET_SIZE = 8 * 1024 * 1024;
const makeFolderId = () => globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function Input({ label, className = '', previewArea, ...props }) {
  return (
    <label data-preview-area={previewArea} className={`block ${className}`}>
      <span className="editor-label">{label}</span>
      <input {...props} className="editor-input-premium" />
    </label>
  );
}

function Textarea({ label, className = '', previewArea, ...props }) {
  return (
    <label data-preview-area={previewArea} className={`block ${className}`}>
      <span className="editor-label">{label}</span>
      <textarea {...props} className="editor-input-premium resize-y min-h-24" />
    </label>
  );
}

export default function ProposalEditorPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [form, setForm] = useState(initialForm); const [loading, setLoading] = useState(Boolean(id)); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [assetError, setAssetError] = useState(''); const [uploadingAsset, setUploadingAsset] = useState(''); const [draggingImages, setDraggingImages] = useState(false); const [previewMode, setPreviewMode] = useState('desktop'); const [activePreviewArea, setActivePreviewArea] = useState(''); const [slugEdited, setSlugEdited] = useState(Boolean(id)); const [assetFolderId] = useState(() => id || makeFolderId());
  useEffect(() => {
    if (!id) return;
    let active = true;
    getProposalForAdmin(id).then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) { setError('No fue posible cargar la cotización.'); setLoading(false); return; }
      const sections = [...(data.proposal_sections ?? [])].sort((a, b) => a.order_index - b.order_index);
      const hero = sections.find((s) => s.section_type === 'hero')?.content ?? {}; const services = sections.find((s) => s.section_type === 'services'); const strategy = sections.find((s) => s.section_type === 'text'); const pricing = sections.find((s) => s.section_type === 'pricing')?.content ?? {};
      const category = hero.category ?? 'empresarial';
      const draftMissingFields = Array.isArray(hero.draftMissingFields) ? hero.draftMissingFields : [];
      const draftValue = (field, value) => data.status === 'draft' && draftMissingFields.includes(field) ? '' : value;
      setSlugEdited(data.status === 'published');
      const oldInvestment = pricing.price ? `$${Number(pricing.price).toLocaleString('es-MX')} ${pricing.currency ?? 'MXN'}${pricing.period ? ` · ${pricing.period}` : ''}` : '';
      const additionalSections = Array.isArray(services?.content?.additionalSections) ? services.content.additionalSections.map((section) => ({ title: section.title ?? '', intro: section.intro ?? '', items: Array.isArray(section.items) ? section.items : [] })) : [];
      setForm({ ...initialForm, client_name: draftValue('client_name', data.client_name), name: draftValue('name', data.name), slug: draftValue('slug', data.slug), title: draftValue('title', data.title), status: data.status, category, heroImage: hero.heroImage ?? proposalDefaults[category]?.hero, featureImage: hero.featureImage ?? proposalDefaults[category]?.feature, clientLogo: hero.clientLogo ?? '', gallery: Array.isArray(hero.gallery) ? hero.gallery : [], eyebrow: hero.eyebrow ?? initialForm.eyebrow, summary: hero.summary ?? '', objective: hero.objective ?? '', servicesTitle: services?.title ?? initialForm.servicesTitle, servicesIntro: services?.content?.intro ?? '', services: services?.content?.items?.length ? services.content.items : [emptyService()], additionalSections, strategyTitle: strategy?.title ?? initialForm.strategyTitle, strategyBody: strategy?.content?.body ?? '', highlights: strategy?.content?.highlights?.length ? strategy.content.highlights : [''], investment: pricing.displayPrice || oldInvestment, price: pricing.price ?? '', currency: pricing.currency ?? 'MXN', period: pricing.period ?? 'mensual', priceNote: pricing.note ?? initialForm.priceNote, whatsappMessage: pricing.whatsappMessage ?? initialForm.whatsappMessage });
      setLoading(false);
    });
    return () => { active = false; };
  }, [id]);
  const generatedSlug = makeProposalSlug(form.client_name, form.title, assetFolderId);
  const publicSlug = form.slug || generatedSlug;
  const publicUrl = `/cotizacion/${publicSlug}`;
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateService = (index, key, value) => setForm((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const updateAdditionalSection = (index, key, value) => setForm((current) => ({ ...current, additionalSections: current.additionalSections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [key]: value } : section) }));
  const updateAdditionalItem = (sectionIndex, itemIndex, key, value) => setForm((current) => ({ ...current, additionalSections: current.additionalSections.map((section, currentSectionIndex) => currentSectionIndex === sectionIndex ? { ...section, items: section.items.map((item, currentItemIndex) => currentItemIndex === itemIndex ? { ...item, [key]: value } : item) } : section) }));
  const handleClientName = (value) => setForm((current) => ({ ...current, client_name: value, slug: slugEdited ? current.slug : makeProposalSlug(value, current.title, assetFolderId) }));
  const handleTitle = (value) => setForm((current) => ({ ...current, title: value, slug: slugEdited ? current.slug : makeProposalSlug(current.client_name, value, assetFolderId) }));
  const handleCategory = (category) => setForm((current) => ({ ...current, category, heroImage: /^https?:/.test(current.heroImage) ? current.heroImage : proposalDefaults[category].hero, featureImage: /^https?:/.test(current.featureImage) ? current.featureImage : proposalDefaults[category].feature }));
  const publishChecks = [
    { label: 'Cliente / empresa', complete: Boolean(form.client_name.trim()) },
    { label: 'Título principal', complete: Boolean(form.title.trim()) },
    { label: 'Descripción', complete: Boolean(form.summary.trim()) },
    { label: 'Servicio con descripción', complete: form.services.some((item) => item.title.trim() && item.description.trim()) },
    { label: 'Inversión', complete: Boolean(form.investment.trim()) },
  ];
  const completedPublishChecks = publishChecks.filter((item) => item.complete).length;
  const missingPublishChecks = publishChecks.filter((item) => !item.complete);
  const activeAdditionalSections = form.additionalSections.filter((section) => section.title.trim() || section.intro.trim() || section.items.some((item) => item.title.trim() || item.description.trim()));
  const previewAccent = { empresarial: '#f59e0b', gastronomico: '#f97316', inmobiliario: '#84cc16' }[form.category] ?? '#f59e0b';
  const previewAreaLabels = { brand: 'Marca', hero: 'Portada', objective: 'Objetivo', gallery: 'Galería', services: 'Servicios', strategy: 'Plan de trabajo', custom: 'Apartado adicional', pricing: 'Inversión', page: 'Estilo general' };
  const isPreviewAreaActive = (area) => activePreviewArea === area || (activePreviewArea === 'page' && ['brand', 'hero', 'pricing'].includes(area));
  const previewAreaStyle = (area) => isPreviewAreaActive(area) ? { outline: `2px solid ${previewAccent}`, outlineOffset: '2px', zIndex: 1 } : {};
  const validateAsset = (file, kind) => {
    if (kind === 'logo' && file.type !== 'image/png') return 'El logo debe ser un archivo PNG.';
    if (['gallery', 'hero', 'feature'].includes(kind) && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'Las imágenes deben ser PNG, JPG o WebP.';
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
  const uploadSlotImage = async (file, kind) => {
    if (!file) return;
    const validationError = validateAsset(file, kind);
    if (validationError) { setAssetError(validationError); return; }
    setAssetError(''); setUploadingAsset(kind);
    const { data, error: uploadError } = await uploadProposalAsset(assetFolderId, file, kind);
    setUploadingAsset('');
    if (uploadError) { setAssetError(`No se pudo subir la imagen. ${uploadError.message}`); return; }
    setValue(kind === 'hero' ? 'heroImage' : 'featureImage', data.url);
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
    if (uploadingAsset) return;
    if (status === 'published' && missingPublishChecks.length) {
      setError(`Para publicar, completa: ${missingPublishChecks.map((item) => item.label).join(', ')}.`);
      return;
    }
    setSaving(true); setError('');
    const draftMissingFields = ['client_name', 'title'].filter((field) => !form[field].trim());
    const proposalToSave = status === 'draft' ? {
      ...form,
      client_name: form.client_name.trim() || 'Sin cliente',
      name: form.title.trim() || 'Borrador sin nombre',
      slug: form.slug.trim() || generatedSlug,
      title: form.title.trim() || 'Borrador sin título',
    } : { ...form, name: form.title.trim(), slug: form.slug.trim() || generatedSlug, status };
    const sections = [
      { section_type: 'hero', title: proposalToSave.title, content: { category: form.category, heroImage: form.heroImage, featureImage: form.featureImage, clientLogo: form.clientLogo, gallery: form.gallery, draftMissingFields: status === 'draft' ? draftMissingFields : [], eyebrow: form.eyebrow, summary: form.summary, objective: form.objective } },
      { section_type: 'services', title: form.servicesTitle, content: { intro: form.servicesIntro, items: form.services.filter((item) => item.title.trim()), additionalSections: form.additionalSections.filter((section) => section.title.trim() || section.intro.trim() || section.items.some((item) => item.title.trim() || item.description.trim())).map((section) => ({ title: section.title.trim() || 'Más información', intro: section.intro.trim(), items: section.items.filter((item) => item.title.trim() || item.description.trim()) })) } },
    ];
    const highlights = form.highlights.filter(Boolean);
    if (form.strategyBody.trim() || highlights.length) sections.splice(2, 0, { section_type: 'text', title: form.strategyTitle, content: { body: form.strategyBody, highlights } });
    sections.push({ section_type: 'pricing', title: 'Inversión', content: { price: form.price, displayPrice: form.investment.trim(), currency: form.currency, period: form.period, note: form.priceNote.trim(), whatsappMessage: form.whatsappMessage } });
    const { data, error: saveError } = await saveProposal({ id, proposal: { ...proposalToSave, status }, sections });
    setSaving(false);
    if (saveError) { setError(saveError.code === '23505' ? 'Ese enlace ya está siendo utilizado.' : `No fue posible guardar: ${saveError.message}`); return; }
    setForm((current) => ({ ...current, status, name: current.title, slug: current.slug || generatedSlug })); setSlugEdited(status === 'published'); navigate(`/admin/cotizaciones/${data.id}/editar`, { replace: true });
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
          <p className="text-xs text-neutral-500 mt-2">Guarda avances como borrador y revisa cómo se ve la propuesta mientras la editas.</p>
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
          {id && form.status === 'published' && publicUrl && (
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
      {assetError && (
        <div role="alert" className="mb-6 border border-red-900/60 bg-red-950/30 text-red-300 rounded-xl px-4 py-3 text-xs flex items-center gap-2 anim-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {assetError}
        </div>
      )}

      {/* ─── Content Grid ─── */}
      <div className="grid xl:grid-cols-[1fr_330px] gap-7 items-start" onFocusCapture={(event) => { const area = event.target.closest('[data-preview-area]')?.dataset.previewArea; if (area) setActivePreviewArea(area); }}>
        <div className="space-y-6">

          {/* Portada — campos que definen la primera vista */}
          <section data-preview-area="hero" className="editor-card">
            <h2 className="editor-heading">Portada de la cotización</h2>
            <div className="space-y-4">
              <Input label="Cliente / empresa" previewArea="brand" value={form.client_name} onChange={(e) => handleClientName(e.target.value)} />
              <Input label="Título de la cotización" placeholder="Ej. Manejo de redes sociales" previewArea="hero" value={form.title} onChange={(e) => handleTitle(e.target.value)} />
              <Textarea label="Descripción" placeholder="Cuéntale al cliente qué incluye la propuesta y qué resultado busca." previewArea="hero" value={form.summary} onChange={(e) => setValue('summary', e.target.value)} />
            </div>
            <p className="text-[10px] text-neutral-600 mt-3 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              El título será también el nombre de la propuesta. Enlace automático: {publicUrl}
            </p>
          </section>

          {/* Recursos visuales opcionales: no forman parte de la numeración del contenido */}
          <details data-preview-area="page" className="editor-card group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="editor-heading !mb-0">Diseño, logo e imágenes <span className="ml-2 text-[9px] font-medium normal-case tracking-normal text-neutral-500">Opcional</span></span>
              <Plus size={16} className="shrink-0 text-neutral-500 transition-transform group-open:rotate-45" />
            </summary>
            <div className="mt-6">
            <label data-preview-area="page" className="block mb-6 max-w-sm">
              <span className="editor-label">Estilo de la propuesta</span>
              <select value={form.category} onChange={(e) => handleCategory(e.target.value)} className="editor-input-premium">
                <option value="empresarial">Empresarial</option>
                <option value="gastronomico">Gastronómico</option>
                <option value="inmobiliario">Inmobiliario</option>
              </select>
            </label>
            <p className="text-xs text-neutral-500 mb-6">Elige una imagen de MNU o sube una nueva imagen para la portada y para el bloque editorial. Acepta PNG, JPG o WebP de hasta 8 MB.</p>
            {[['heroImage', 'Imagen de portada', 'hero', 'hero'], ['featureImage', 'Imagen editorial', 'objective', 'feature']].map(([field, label, previewArea, slot]) => (
              <div key={field} data-preview-area={previewArea} className="mb-7 last:mb-0">
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
                  <div>
                    <label className={`relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition-colors ${isUploadedImage(form[field]) ? 'border-amber-400' : 'border-neutral-700 hover:border-amber-400/70 hover:bg-amber-500/5'} ${uploadingAsset ? 'pointer-events-none opacity-50' : ''}`}>
                      {isUploadedImage(form[field]) ? (
                        <>
                          <img src={form[field]} alt={`${label} personalizada`} className="absolute inset-0 h-full w-full object-cover opacity-70" />
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-6 text-[8px] font-black uppercase tracking-wider text-white">Imagen propia · cambiar</span>
                          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-xs font-black text-black">✓</span>
                        </>
                      ) : (
                        <><Upload size={20} className="mb-2 text-amber-400" /><span className="text-[8px] font-black uppercase tracking-wider text-neutral-300">Subir imagen nueva</span></>
                      )}
                      <input aria-label={`Subir ${label.toLowerCase()}`} type="file" accept="image/png,image/jpeg,image/webp" disabled={Boolean(uploadingAsset)} onChange={(event) => { uploadSlotImage(event.target.files?.[0], slot); event.target.value = ''; }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                    {isUploadedImage(form[field]) && <button type="button" onClick={() => setValue(field, proposalDefaults[form.category]?.[slot])} className="mt-2 text-[8px] font-bold uppercase tracking-wider text-neutral-500 hover:text-amber-400">Usar imagen de MNU</button>}
                    {uploadingAsset === slot && <p className="mt-2 animate-pulse text-[9px] text-amber-400">Subiendo imagen...</p>}
                  </div>
                </div>
              </div>
            ))}
            <div data-preview-area="gallery" className="mt-7 border-t border-neutral-800 pt-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Logo y galería</h3>
            <p className="text-xs text-neutral-500 mt-2 mb-6">El logo y la galería son opcionales.</p>
            <div className="grid md:grid-cols-[190px_1fr] gap-5 items-start">
              <div data-preview-area="brand">
                <span className="editor-label">Logo del cliente · PNG</span>
                <div className="relative min-h-36 rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-4 flex items-center justify-center overflow-hidden">
                  {form.clientLogo ? (
                    <>
                      <div className="w-full h-28 p-3 grid place-items-center"><img src={form.clientLogo} alt="Logo del cliente" className="max-h-full max-w-full object-contain" /></div>
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
              <div data-preview-area="gallery">
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
          </div>
          </div>
          </details>

          {/* 01 — El objetivo */}
          <section data-preview-area="objective" className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">01</span> El objetivo</h2>
            <Textarea label="Objetivo para el cliente" previewArea="objective" placeholder="¿Qué se busca lograr con esta propuesta?" value={form.objective} onChange={(e) => setValue('objective', e.target.value)} />
          </section>

          {/* 02 — Lo que incluye */}
          <section data-preview-area="services" className="editor-card">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="editor-heading !mb-0"><span className="section-badge">02</span> ¿Qué incluye?</h2><p className="text-[10px] text-neutral-500 mt-2">Agrega al menos un servicio con una breve descripción.</p></div>
              <button onClick={() => setValue('services', [...form.services, emptyService()])} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors group">
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Agregar
              </button>
            </div>
            <div className="space-y-3">
              {form.services.map((service, index) => (
                <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 grid md:grid-cols-[130px_1fr_1.4fr_28px] gap-3 items-center hover:border-neutral-700 transition-colors group/item">
                  <select aria-label={`Icono del servicio ${index + 1}`} value={service.icon} onChange={(e) => updateService(index, 'icon', e.target.value)} className="editor-input-premium">{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                  <input aria-label={`Nombre del servicio ${index + 1}`} placeholder="Nombre del servicio" value={service.title} onChange={(e) => updateService(index, 'title', e.target.value)} className="editor-input-premium" />
                  <textarea
                    aria-label={`Descripción del servicio ${index + 1}`}
                    placeholder={'¿Qué incluye?\n· Planeación mensual\n· Calendario de publicaciones'}
                    rows={Math.max(3, service.description.split('\n').length)}
                    value={service.description}
                    onChange={(event) => {
                      updateService(index, 'description', event.target.value);
                      event.currentTarget.style.height = 'auto';
                      event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                    }}
                    className="editor-input-premium min-h-24 resize-y whitespace-pre-line leading-relaxed"
                  />
                  <button aria-label="Eliminar servicio" onClick={() => setValue('services', form.services.filter((_, itemIndex) => itemIndex !== index))} className="text-neutral-600 hover:text-red-400 transition-colors">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-neutral-500">Usa Enter para separar ideas y escribe · al inicio de cada línea. Se conservarán en la cotización.</p>
          </section>

          <details data-preview-area="strategy" className="editor-card group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="editor-heading !mb-0"><span className="section-badge">03</span> Plan de trabajo <span className="ml-2 text-[9px] font-medium normal-case tracking-normal text-neutral-500">Opcional</span></span>
              <Plus size={16} className="shrink-0 text-neutral-500 transition-transform group-open:rotate-45" />
            </summary>
            <div className="mt-6 space-y-4">
              <Textarea label="Plan de trabajo" previewArea="strategy" placeholder="Describe brevemente cómo se llevará a cabo." value={form.strategyBody} onChange={(e) => setValue('strategyBody', e.target.value)} />
            </div>
          </details>

          <details data-preview-area="custom" className="editor-card group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="editor-heading !mb-0">Apartados adicionales <span className="ml-2 text-[9px] font-medium normal-case tracking-normal text-neutral-500">Opcional</span></span>
              <Plus size={16} className="shrink-0 text-neutral-500 transition-transform group-open:rotate-45" />
            </summary>
            <div className="mt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] text-neutral-500">Para campañas, calendario mensual, fases de producción o varias marcas. Cada apartado crea su propia sección.</p>
                  </div>
                  <button type="button" onClick={() => setValue('additionalSections', [...form.additionalSections, emptyCustomSection()])} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-700 px-3 py-2 text-[8px] font-black uppercase tracking-wider text-amber-400 transition-colors hover:border-amber-500/60">
                    <Plus size={12} /> Agregar apartado
                  </button>
                </div>
                <div className="space-y-3">
                  {form.additionalSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                      <p className="mb-4 text-[9px] font-black uppercase tracking-widest text-amber-400"><span className="section-badge mr-2">{activeAdditionalSections.includes(section) ? String(4 + activeAdditionalSections.indexOf(section)).padStart(2, '0') : '—'}</span> Apartado {sectionIndex + 1}</p>
                      <div className="flex items-start gap-3">
                        <Input label="Nombre del apartado" placeholder="Ej. Campañas por objetivo" previewArea="custom" value={section.title} onChange={(e) => updateAdditionalSection(sectionIndex, 'title', e.target.value)} className="flex-1" />
                        <button type="button" aria-label="Eliminar apartado" onClick={() => setValue('additionalSections', form.additionalSections.filter((_, index) => index !== sectionIndex))} className="mt-5 rounded-lg p-2 text-neutral-600 transition-colors hover:text-red-400"><Trash2 size={16} /></button>
                      </div>
                      <Textarea label="Introducción breve (opcional)" placeholder="Explica el propósito de este apartado." previewArea="custom" value={section.intro} onChange={(e) => updateAdditionalSection(sectionIndex, 'intro', e.target.value)} className="mt-3" />
                      <div className="mt-4 space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="grid gap-2 rounded-xl border border-neutral-800 p-3 md:grid-cols-[120px_1fr_1.4fr_28px] md:items-center">
                            <select aria-label={`Icono ${itemIndex + 1} del apartado ${sectionIndex + 1}`} value={item.icon ?? 'sparkles'} onChange={(e) => updateAdditionalItem(sectionIndex, itemIndex, 'icon', e.target.value)} className="editor-input-premium">{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                            <input aria-label={`Título ${itemIndex + 1} del apartado ${sectionIndex + 1}`} placeholder="Título o cantidad" value={item.title} onChange={(e) => updateAdditionalItem(sectionIndex, itemIndex, 'title', e.target.value)} className="editor-input-premium" />
                            <input aria-label={`Detalle ${itemIndex + 1} del apartado ${sectionIndex + 1}`} placeholder="Detalle u objetivo" value={item.description} onChange={(e) => updateAdditionalItem(sectionIndex, itemIndex, 'description', e.target.value)} className="editor-input-premium" />
                            <button type="button" aria-label="Eliminar tarjeta" onClick={() => updateAdditionalSection(sectionIndex, 'items', section.items.filter((_, index) => index !== itemIndex))} className="justify-self-center text-neutral-600 transition-colors hover:text-red-400"><Trash2 size={15} /></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => updateAdditionalSection(sectionIndex, 'items', [...section.items, emptyService()])} className="inline-flex items-center gap-1.5 px-2 py-2 text-[8px] font-black uppercase tracking-wider text-amber-400 transition-colors hover:text-amber-300"><Plus size={12} /> Agregar tarjeta</button>
                      </div>
                    </div>
                  ))}
                  {!form.additionalSections.length && <p className="rounded-xl border border-dashed border-neutral-800 px-4 py-5 text-center text-[9px] text-neutral-600">No hay apartados adicionales. Agrégalos solo cuando tu cotización los necesite.</p>}
                </div>
            </div>
          </details>

          {/* La inversión aparece al final del documento; su número sigue a los apartados opcionales. */}
          <section data-preview-area="pricing" className="editor-card">
            <h2 className="editor-heading"><span className="section-badge">{String(4 + activeAdditionalSections.length).padStart(2, '0')}</span> Inversión</h2>
            <Textarea label="Inversión y opciones de precio" placeholder={'$15,000 MXN / mes\nPrecio especial por ambas marcas: $22,000 MXN + IVA'} previewArea="pricing" value={form.investment} onChange={(e) => setValue('investment', e.target.value)} />
            <p className="text-[10px] text-neutral-500 mt-2">Puedes poner un precio, varias opciones o una tarifa por marca, una por línea.</p>
            <details className="group mt-4 rounded-xl border border-neutral-800 px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">
                <span>Condiciones adicionales <span className="ml-1 font-medium normal-case tracking-normal text-neutral-600">Opcional</span></span>
                <Plus size={14} className="transition-transform group-open:rotate-45" />
              </summary>
              <Textarea label="IVA, pauta, contrato, vigencia u otros" placeholder="Ej. La pauta publicitaria se cotiza por separado." previewArea="pricing" value={form.priceNote} onChange={(e) => setValue('priceNote', e.target.value)} className="mt-4" />
            </details>
          </section>
        </div>

        {/* ─── Live preview ─── */}
        <aside className="xl:sticky xl:top-24 self-start space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-amber-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 status-pulse-dot" /> Vista previa en vivo</p>
              <p className="text-[9px] text-neutral-500 mt-1">{activePreviewArea ? `Editando: ${previewAreaLabels[activePreviewArea]}` : 'Selecciona un campo para resaltar su sección'}</p>
            </div>
            <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-900 p-1">
              <button type="button" onClick={() => setPreviewMode('desktop')} aria-label="Vista previa de escritorio" aria-pressed={previewMode === 'desktop'} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[8px] font-bold uppercase tracking-wide transition-colors ${previewMode === 'desktop' ? 'bg-amber-400 text-black' : 'text-neutral-500 hover:text-white'}`}><Monitor size={13} /> Escritorio</button>
              <button type="button" onClick={() => setPreviewMode('mobile')} aria-label="Vista previa de móvil" aria-pressed={previewMode === 'mobile'} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[8px] font-bold uppercase tracking-wide transition-colors ${previewMode === 'mobile' ? 'bg-amber-400 text-black' : 'text-neutral-500 hover:text-white'}`}><Smartphone size={13} /> Móvil</button>
            </div>
          </div>

          <div className="max-h-[68vh] overflow-auto rounded-3xl border border-neutral-800 bg-neutral-900 p-2.5 shadow-xl shadow-black/20">
            <div className={`mx-auto overflow-hidden rounded-[1.35rem] bg-[#f5f3ee] text-neutral-950 transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[260px] border-[5px] border-neutral-700' : 'w-full'}`}>
              <div style={previewAreaStyle('brand')} className="h-11 bg-neutral-950 px-4 flex items-center justify-between gap-3">
                <img src={form.clientLogo || mnuBlanco} alt={form.clientLogo ? 'Logo del cliente' : 'Logo MNU'} className="h-5 max-w-24 object-contain" />
                <span className="truncate text-[7px] uppercase tracking-widest text-white/50">Propuesta privada · {form.client_name || 'Cliente'}</span>
              </div>
              <div style={previewAreaStyle('hero')} className="relative aspect-[4/3] overflow-hidden bg-neutral-900 text-white">
                <img src={getEditorImage(form.heroImage, form.category, 'hero')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[7px] font-bold uppercase tracking-[.2em] text-white/60">Preparada para {form.client_name || 'Nombre del cliente'}</p>
                  <h3 className="mt-2 break-words text-2xl font-black uppercase leading-[.9] tracking-tighter">{form.title || 'Tu propuesta comercial'}</h3>
                  <p className="mt-2 line-clamp-3 text-[9px] leading-relaxed text-white/70">{form.summary || 'Aquí aparecerá la introducción de la propuesta.'}</p>
                </div>
              </div>

              {form.objective.trim() && <section style={previewAreaStyle('objective')} className="p-4">
                <p className="text-[7px] font-black uppercase tracking-[.2em] text-neutral-400">01 · El objetivo</p>
                <p className="mt-2 text-sm font-black uppercase leading-tight">{form.objective}</p>
                <img src={getEditorImage(form.featureImage, form.category, 'feature')} alt="" className="mt-3 aspect-[16/8] w-full rounded-xl object-cover" />
              </section>}

              <section style={previewAreaStyle('services')} className="bg-neutral-950 p-4 text-white">
                <p className="text-[7px] font-black uppercase tracking-[.2em]" style={{ color: previewAccent }}>02 · Lo que incluye</p>
                <h4 className="mt-2 text-lg font-black uppercase leading-none">{form.servicesTitle || 'Servicios'}</h4>
                <div className="mt-3 grid grid-cols-2 items-start gap-2">
                  {form.services.filter((item) => item.title.trim() || item.description.trim()).slice(0, 4).map((item, index) => {
                    const ServiceIcon = serviceIcons[item.icon] ?? Sparkles;
                    const descriptionLines = getDescriptionLines(item.description);
                    return <article key={`${item.title}-${index}`} className="group relative overflow-hidden rounded-lg border border-white/10 p-2">
                      <div className="relative">
                        <div className="mb-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10" style={{ color: previewAccent }}><ServiceIcon size={11} /></span>
                        </div>
                        <p className="text-[8px] font-bold uppercase">{item.title || 'Nuevo servicio'}</p>
                        <div className="mt-2 space-y-1.5 border-t border-white/10 pt-2 text-[7px] leading-relaxed text-white/70">
                          {descriptionLines.length ? descriptionLines.map((line, lineIndex) => line.bullet ? (
                            <div key={lineIndex} className="flex items-start gap-1.5"><span aria-hidden="true" className="shrink-0 font-black text-amber-400">·</span><p className="min-w-0 break-words">{line.text}</p></div>
                          ) : <p key={lineIndex} className="break-words">{line.text}</p>) : <p>Agrega los detalles del servicio.</p>}
                        </div>
                      </div>
                    </article>;
                  })}
                  {!form.services.some((item) => item.title.trim() || item.description.trim()) && <p className="col-span-2 text-[8px] text-white/45">Tus servicios aparecerán aquí.</p>}
                </div>
              </section>

              {(form.strategyBody.trim() || form.highlights.some((item) => item.trim())) && <section style={previewAreaStyle('strategy')} className="p-4">
                <p className="text-[7px] font-black uppercase tracking-[.2em] text-neutral-400">03 · La estrategia</p>
                <h4 className="mt-2 text-lg font-black uppercase leading-none">{form.strategyTitle || 'Plan de trabajo'}</h4>
                {form.strategyBody.trim() && <p className="mt-2 line-clamp-3 text-[9px] leading-relaxed text-neutral-600">{form.strategyBody}</p>}
                {form.highlights.some((item) => item.trim()) && <p className="mt-2 border-t border-neutral-200 pt-2 text-[8px] font-bold">{form.highlights.find((item) => item.trim())}</p>}
              </section>}

              {activeAdditionalSections.map((section, sectionIndex) => (
                <section key={`${section.title}-${sectionIndex}`} style={previewAreaStyle('custom')} className="bg-white p-4">
                  <p className="text-[7px] font-black uppercase tracking-[.2em] text-neutral-400">{String(4 + sectionIndex).padStart(2, '0')} · Apartado adicional</p>
                  <h4 className="mt-2 text-base font-black uppercase leading-tight">{section.title || 'Más información'}</h4>
                  {section.intro.trim() && <p className="mt-2 text-[8px] leading-relaxed text-neutral-600">{section.intro}</p>}
                  <div className="mt-3 space-y-2">
                    {section.items.filter((item) => item.title.trim() || item.description.trim()).slice(0, 4).map((item, index) => {
                      const ServiceIcon = serviceIcons[item.icon] ?? Sparkles;
                      return <div key={`${item.title}-${index}`} className="flex items-start gap-2 border-t border-neutral-100 pt-2">
                        <span className="mt-0.5 shrink-0 text-amber-500"><ServiceIcon size={11} /></span>
                        <div><p className="text-[8px] font-bold uppercase">{item.title || 'Detalle'}</p>{item.description.trim() && <p className="mt-0.5 text-[7px] leading-relaxed text-neutral-500">{item.description}</p>}</div>
                      </div>;
                    })}
                  </div>
                </section>
              ))}

              {form.gallery.length > 0 && (
                <section style={previewAreaStyle('gallery')} className="bg-white p-4">
                  <p className="text-[7px] font-black uppercase tracking-[.2em] text-neutral-400">Galería del proyecto</p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {form.gallery.slice(0, previewMode === 'mobile' ? 1 : 3).map((src, index) => <img key={`${src}-${index}`} src={src} alt="" className={`w-full rounded-md object-cover ${previewMode === 'mobile' ? 'aspect-[4/5]' : 'aspect-square'}`} />)}
                  </div>
                </section>
              )}

              <section style={{ ...previewAreaStyle('pricing'), backgroundColor: previewAccent }} className="p-4">
                <p className="text-[7px] font-black uppercase tracking-[.2em] opacity-60">{String(4 + activeAdditionalSections.length).padStart(2, '0')} · Inversión propuesta</p>
                <p className="mt-1 whitespace-pre-line break-words text-lg font-black leading-tight tracking-tight">{form.investment || 'Escribe la inversión'}</p>
                {form.priceNote.trim() && <p className="mt-2 whitespace-pre-line text-[7px] opacity-70">{form.priceNote}</p>}
                <div className="mt-3 rounded-full bg-black px-3 py-2 text-center text-[7px] font-black uppercase tracking-widest text-white">Me interesa esta propuesta</div>
              </section>
              <footer className="flex items-center justify-between gap-2 bg-black px-4 py-3 text-white">
                <img src={form.clientLogo || mnuBlanco} alt="" className="h-4 max-w-16 object-contain" />
                <span className="text-right text-[6px] uppercase tracking-widest text-white/45">Preparada para {form.client_name || 'tu empresa'}</span>
              </footer>
            </div>
          </div>

          <details className="group rounded-2xl border border-neutral-800 bg-neutral-900/80">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[9px] font-black uppercase tracking-widest">
              <span>Requisitos para publicar</span>
              <span className={completedPublishChecks === publishChecks.length ? 'text-emerald-400' : 'text-amber-400'}>{completedPublishChecks}/{publishChecks.length} completos</span>
            </summary>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-neutral-800 px-4 py-3">
              {publishChecks.map((item) => <span key={item.label} className={`flex items-center gap-1.5 text-[8px] ${item.complete ? 'text-emerald-400' : 'text-neutral-500'}`}><CheckCircle2 size={11} />{item.label}</span>)}
            </div>
          </details>
        </aside>
      </div>
    </div>
  );
}
