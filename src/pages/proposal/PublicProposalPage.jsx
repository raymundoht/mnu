import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Camera, Video, Megaphone, Palette, MapPin, ChartNoAxesCombined, Target, Sparkles, ArrowUpRight, Check, MessageCircle, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import mnuBlanco from '../../assets/MNU-BLANCO.webp';
import { getPublishedProposal } from '../../services/proposalsService';
import { getProposalMedia } from '../../data/proposalMedia';

const icons = { camera: Camera, video: Video, megaphone: Megaphone, palette: Palette, location: MapPin, chart: ChartNoAxesCombined, target: Target, sparkles: Sparkles };
const themeMap = { empresarial: { accent: '#f59e0b' }, gastronomico: { accent: '#f97316' }, inmobiliario: { accent: '#84cc16' } };

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', tag: Tag = 'section', ...props }) {
  const ref = useScrollReveal();
  return <Tag ref={ref} className={`scroll-reveal ${className}`} {...props}>{children}</Tag>;
}

function StaggerList({ children, className = '' }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`stagger-children ${className}`}>{children}</div>;
}

export default function PublicProposalPage() {
  const { slug } = useParams(); const [proposal, setProposal] = useState(null); const [loading, setLoading] = useState(true); const [notFound, setNotFound] = useState(false);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => { let active = true; getPublishedProposal(slug).then(({ data, error }) => { if (!active) return; if (error || !data) setNotFound(true); else setProposal(data); setLoading(false); }); return () => { active = false; }; }, [slug]);

  useEffect(() => {
    const handleScroll = () => setHeaderShrunk(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = useMemo(() => [...(proposal?.proposal_sections ?? [])].sort((a, b) => a.order_index - b.order_index), [proposal]);
  const hero = sections.find((s) => s.section_type === 'hero')?.content ?? {}; const services = sections.find((s) => s.section_type === 'services'); const strategy = sections.find((s) => s.section_type === 'text'); const pricing = sections.find((s) => s.section_type === 'pricing')?.content ?? {}; const theme = themeMap[hero.category] ?? themeMap.empresarial;
  const gallery = Array.isArray(hero.gallery) ? hero.gallery : [];

  useEffect(() => {
    if (galleryIndex >= gallery.length) setGalleryIndex(0);
  }, [gallery.length, galleryIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') setLightboxIndex((current) => (current + 1) % gallery.length);
      if (event.key === 'ArrowLeft') setLightboxIndex((current) => (current - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery.length]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white grid place-items-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-neutral-800 border-t-[var(--proposal-accent,#f59e0b)] rounded-full animate-spin mx-auto" />
        <p className="text-[10px] uppercase tracking-[.3em] text-neutral-500">Cargando propuesta...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-neutral-950 text-white grid place-items-center px-6 text-center">
      <div className="anim-fade-in-up">
        <p className="text-amber-400 text-[10px] font-black uppercase tracking-[.35em]">Propuesta no disponible</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-4">Este enlace no está publicado</h1>
        <p className="text-neutral-500 text-sm mt-4">Verifica el enlace o solicita una nueva liga a nuestro equipo.</p>
        <Link to="/" className="inline-block mt-8 bg-white text-black rounded-full px-7 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-colors">Ir a MNU</Link>
      </div>
    </div>
  );

  const whatsappUrl = `https://wa.me/526142775603?text=${encodeURIComponent(`${pricing.whatsappMessage || 'Hola, me interesa esta propuesta.'}\n\nPropuesta: ${proposal.name}\n${window.location.href}`)}`;
  const heroMedia = getProposalMedia(hero.heroImage, hero.category, 'hero');
  const featureMedia = getProposalMedia(hero.featureImage, hero.category, 'feature');

  return (
    <div className="bg-[#f5f3ee] text-neutral-950 min-h-screen" style={{ '--proposal-accent': theme.accent }}>

      {/* ─── Header ─── */}
      <header className={`fixed top-0 inset-x-0 z-50 border-b border-white/10 transition-all duration-500 ${headerShrunk ? 'bg-black/95 backdrop-blur-2xl' : 'bg-black/85 backdrop-blur-xl'}`}>
        <div className={`max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between transition-all duration-500 ${headerShrunk ? 'h-14' : 'h-20'}`}>
          <Link to="/">
            {hero.clientLogo ? (
              <span className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 max-w-36 h-11 shadow-lg"><img src={hero.clientLogo} alt={`Logo de ${proposal.client_name}`} className="max-w-full max-h-full object-contain" /></span>
            ) : <img src={mnuBlanco} alt="mnü" className={`object-contain transition-all duration-500 ${headerShrunk ? 'h-4' : 'h-6'}`} />}
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden sm:block text-[9px] text-neutral-500 uppercase tracking-[.25em]">Propuesta privada · {proposal.client_name}</span>
            <a href="#inversion" className="bg-[var(--proposal-accent)] text-black rounded-full px-5 py-3 text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--proposal-accent),transparent_70%)]">
              Ver inversión
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative min-h-screen bg-neutral-950 text-white flex items-end overflow-hidden pt-28">
          <img src={heroMedia?.src} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: heroMedia?.position }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent" />
          <div className="absolute top-28 right-5 md:right-10 text-[9px] font-black uppercase tracking-[.3em] text-white/60">MNU · {hero.category || 'empresarial'}</div>
          <div className="relative max-w-7xl mx-auto w-full px-5 md:px-10 pb-14 md:pb-20">
            <span className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[.35em] text-[var(--proposal-accent)] anim-fade-in-up">
              <span className="w-10 h-px bg-current" />{hero.eyebrow || 'Propuesta comercial'}
            </span>
            <p className="text-xs uppercase tracking-[.22em] text-white/55 mt-8 anim-fade-in-up anim-delay-1">Preparada para {proposal.client_name}</p>
            <h1 className="text-[15vw] sm:text-7xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-[-.065em] leading-[.78] mt-4 max-w-5xl break-words text-balance anim-fade-in-up anim-delay-2">{proposal.title}</h1>
            <div className="mt-10 pt-7 border-t border-white/25 grid md:grid-cols-[1fr_.55fr] gap-8 items-end anim-fade-in-up anim-delay-3">
              <p className="max-w-2xl text-base md:text-lg text-white/75 font-light leading-relaxed">{hero.summary}</p>
              <div className="flex md:justify-end items-center gap-3 text-[9px] uppercase tracking-widest text-white/55">
                <ArrowUpRight size={16} className="text-[var(--proposal-accent)]" /> Conoce la propuesta
              </div>
            </div>
          </div>
        </section>

        {/* ─── Objective ─── */}
        {hero.objective && (
          <RevealSection className="py-20 md:py-32 px-5 md:px-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-[.28fr_1fr] gap-8 md:gap-20">
                <p className="text-[10px] font-black uppercase tracking-[.3em] text-neutral-400">01 · El objetivo</p>
                <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[1.02] text-balance">{hero.objective}</h2>
              </div>
              <div className="relative mt-14 md:mt-24 rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[16/7] group">
                <img src={featureMedia?.src} alt="Proyecto de referencia MNU" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[2s]" style={{ objectPosition: featureMedia?.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute left-6 bottom-6 md:left-10 md:bottom-9 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[.3em] text-[var(--proposal-accent)]">Enfoque visual</p>
                  <p className="text-xl md:text-3xl font-black uppercase tracking-tight mt-2">Estrategia · Contenido · Resultados</p>
                </div>
              </div>
            </div>
          </RevealSection>
        )}

        {/* ─── Client image gallery ─── */}
        {gallery.length > 0 && (
          <RevealSection className="py-20 md:py-32 px-5 md:px-10 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.3em] text-neutral-400">Galería del proyecto</p>
                  <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[.9] mt-4">Una mirada<br className="hidden md:block" /> más cercana.</h2>
                </div>
                <p className="text-sm text-neutral-500 max-w-sm">Explora las imágenes y amplíalas para ver cada detalle.</p>
              </div>
              <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-neutral-100 aspect-[4/3] md:aspect-[16/8] group/gallery">
                <img src={gallery[galleryIndex]} alt={`Imagen ${galleryIndex + 1} de ${proposal.client_name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/gallery:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                <span className="absolute left-5 bottom-5 md:left-8 md:bottom-8 text-white text-[10px] font-black uppercase tracking-[.25em]">{String(galleryIndex + 1).padStart(2, '0')} <span className="text-white/50">/ {String(gallery.length).padStart(2, '0')}</span></span>
                <button type="button" onClick={() => setLightboxIndex(galleryIndex)} aria-label="Ampliar imagen de la galería" className="absolute right-5 bottom-5 md:right-8 md:bottom-8 flex items-center gap-2 rounded-full bg-white text-black px-4 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-[var(--proposal-accent)] transition-colors">
                  <Maximize2 size={14} /> Ver imagen
                </button>
                {gallery.length > 1 && (
                  <>
                    <button type="button" aria-label="Imagen anterior" onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white backdrop-blur grid place-items-center hover:bg-white hover:text-black transition-colors"><ChevronLeft size={20} /></button>
                    <button type="button" aria-label="Siguiente imagen" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white backdrop-blur grid place-items-center hover:bg-white hover:text-black transition-colors"><ChevronRight size={20} /></button>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                  {gallery.map((src, index) => (
                    <button type="button" key={`${src}-${index}`} onClick={() => setGalleryIndex(index)} aria-label={`Mostrar imagen ${index + 1}`} aria-current={galleryIndex === index ? 'true' : undefined} className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 group/thumb focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--proposal-accent)] ${galleryIndex === index ? 'ring-2 ring-[var(--proposal-accent)]' : ''}`}>
                      <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                      <span className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </RevealSection>
        )}

        {/* ─── Services ─── */}
        {services && (
          <section className="py-20 md:py-32 bg-black text-white px-5 md:px-10">
            <div className="max-w-7xl mx-auto">
              <RevealSection tag="div" className="grid md:grid-cols-2 gap-8 md:gap-20 items-end mb-14">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.3em] text-[var(--proposal-accent)]">02 · Lo que incluye</p>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[.9] mt-4">{services.title}</h2>
                </div>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">{services.content?.intro}</p>
              </RevealSection>
              <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-white/15">
                {(services.content?.items ?? []).map((item, index) => {
                  const Icon = icons[item.icon] ?? Sparkles;
                  return (
                    <article key={`${item.title}-${index}`} className="group py-8 md:p-8 border-b md:border-r border-white/15 hover:bg-white/[.04] transition-all duration-500 relative overflow-hidden">
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--proposal-accent)]/[.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="flex justify-between items-start">
                          <span className="w-14 h-14 rounded-2xl bg-[var(--proposal-accent)] text-black grid place-items-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[color-mix(in_srgb,var(--proposal-accent),transparent_70%)] transition-all duration-500">
                            <Icon size={26} />
                          </span>
                          <span className="text-4xl font-black text-white/10 group-hover:text-white/[.06] transition-colors">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mt-8">{item.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed mt-3">{item.description}</p>
                      </div>
                    </article>
                  );
                })}
              </StaggerList>
            </div>
          </section>
        )}

        {/* ─── Strategy ─── */}
        {strategy && (
          <section className="py-20 md:py-32 px-5 md:px-10">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-24">
              <RevealSection tag="div" className="lg:sticky lg:top-32 lg:self-start">
                <p className="text-[10px] font-black uppercase tracking-[.3em] text-neutral-400">03 · La estrategia</p>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[.9] mt-5">{strategy.title}</h2>
                <div className="hidden lg:block w-20 h-2 bg-[var(--proposal-accent)] mt-10 rounded-full" />
              </RevealSection>
              <div>
                <RevealSection tag="p" className="text-xl md:text-3xl font-light leading-relaxed text-neutral-600">
                  {strategy.content?.body}
                </RevealSection>
                <StaggerList className="mt-12 border-t border-neutral-300">
                  {(strategy.content?.highlights ?? []).map((item, index) => (
                    <div key={`${item}-${index}`} className="group flex gap-5 py-6 border-b border-neutral-300 hover:pl-2 transition-all duration-300">
                      <span className="w-9 h-9 rounded-full bg-black text-white grid place-items-center shrink-0 group-hover:bg-[var(--proposal-accent)] group-hover:text-black group-hover:shadow-lg group-hover:shadow-[color-mix(in_srgb,var(--proposal-accent),transparent_70%)] transition-all duration-300">
                        <Check size={16} />
                      </span>
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
                        <p className="font-bold text-sm md:text-base mt-1">{item}</p>
                      </div>
                    </div>
                  ))}
                </StaggerList>
              </div>
            </div>
          </section>
        )}

        {/* ─── Pricing ─── */}
        <RevealSection id="inversion" className="relative py-20 md:py-32 px-5 md:px-10 bg-[var(--proposal-accent)] text-black overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-20 -bottom-32 w-96 h-96 rounded-full border-[70px] border-black/[.06]" />
          <div className="absolute -left-16 top-10 w-48 h-48 rounded-full border-[40px] border-black/[.04]" />
          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_.85fr] gap-12 items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.3em] opacity-55">04 · Inversión</p>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[.82] mt-5">Hagamos que suceda.</h2>
              <p className="max-w-lg mt-8 text-base opacity-70">Si esta propuesta se alinea con lo que buscas, escríbenos y coordinamos los siguientes pasos.</p>
            </div>
            <div className="bg-black text-white rounded-[2rem] p-7 md:p-10 shadow-2xl shadow-black/30 relative overflow-hidden">
              {/* Subtle glass shine */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[var(--proposal-accent)]/10 blur-3xl" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[.25em] text-neutral-500">Inversión propuesta</p>
                <p className="text-5xl md:text-6xl font-black tracking-tighter mt-3">{pricing.price ? `$${Number(pricing.price).toLocaleString('es-MX')}` : 'Por definir'}</p>
                {pricing.price && <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">{pricing.currency} · {pricing.period}</p>}
                <p className="text-xs text-neutral-500 mt-5">{pricing.note}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 w-full rounded-full bg-[var(--proposal-accent)] text-black py-4 px-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors animate-pulse-glow"
                >
                  <MessageCircle size={17} /> Me interesa esta propuesta
                </a>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>

      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-4 md:p-10 grid place-items-center" role="dialog" aria-modal="true" aria-label="Galería de imágenes">
          <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Cerrar galería" className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full border border-white/20 text-white grid place-items-center hover:bg-white hover:text-black transition-colors"><X size={20} /></button>
          {gallery.length > 1 && (
            <>
              <button type="button" onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)} aria-label="Imagen anterior" className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white hover:text-black transition-colors"><ChevronLeft size={24} /></button>
              <button type="button" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)} aria-label="Siguiente imagen" className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white hover:text-black transition-colors"><ChevronRight size={24} /></button>
            </>
          )}
          <div className="max-w-6xl max-h-full w-full flex flex-col items-center justify-center">
            <img src={gallery[lightboxIndex]} alt={`Imagen ${lightboxIndex + 1} de ${proposal.client_name}`} className="max-h-[78vh] max-w-full object-contain rounded-xl" />
            <p className="text-white/60 text-[10px] uppercase tracking-[.25em] mt-5">{proposal.client_name} · {String(lightboxIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</p>
          </div>
        </div>
      )}

      {/* ─── Footer ─── */}
      <footer className="bg-black text-white px-5 md:px-10 py-10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--proposal-accent)]/30 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 justify-between items-center">
          {hero.clientLogo ? <span className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 w-32 h-12"><img src={hero.clientLogo} alt={`Logo de ${proposal.client_name}`} className="max-w-full max-h-full object-contain" /></span> : <img src={mnuBlanco} alt="mnü" className="h-6" />}
          <p className="text-[9px] uppercase tracking-[.25em] text-neutral-600">Propuesta preparada especialmente para {proposal.client_name}</p>
        </div>
      </footer>
    </div>
  );
}
