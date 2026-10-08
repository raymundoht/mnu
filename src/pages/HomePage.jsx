import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import CursorLink from '../components/CursorLink';
import { ArrowRight, ChevronDown, ChevronUp, Target, Layers3, TrendingUp, Award, BarChart3, Building2, UtensilsCrossed, HomeIcon } from '../components/icons';
import { hero, logos, macopisa, unionGanadera, canaria, chicken, costa, valle } from '../data/assets';
import { serviceCategories } from '../data/homeContent';

const HomePage = (props) => {
  const outletCtx = useOutletContext() || {};
  const addToRefs = props.addToRefs || outletCtx.addToRefs;
  const setBookingModalOpen = props.setBookingModalOpen || outletCtx.setBookingModalOpen;
  const handleMouseEnter = props.handleMouseEnter || outletCtx.handleMouseEnter || (() => {});
  const handleMouseLeave = props.handleMouseLeave || outletCtx.handleMouseLeave || (() => {});

  const [servicesExpanded, setServicesExpanded] = useState(false);
  const navigate = useNavigate();

  const wideLogos = logos.slice(0, 11);
  const squareLogos = logos.slice(11, 22);
  const row1 = [];
  for (let i = 0; i < Math.max(wideLogos.length, squareLogos.length); i++) {
    if (wideLogos[i]) row1.push({ src: wideLogos[i], wide: true });
    if (squareLogos[i]) row1.push({ src: squareLogos[i], wide: false });
  }
  const row2 = [];
  for (let i = 0; i < Math.max(squareLogos.length, wideLogos.length); i++) {
    if (squareLogos[i]) row2.push({ src: squareLogos[i], wide: false });
    if (wideLogos[i]) row2.push({ src: wideLogos[i], wide: true });
  }

  return (
    <>
      {/* HERO */}
      <header id="inicio" className="min-h-screen flex flex-col justify-center items-start px-6 md:px-12 text-left relative pt-28 pb-36 overflow-hidden">
        <video autoPlay loop muted playsInline preload="metadata" poster={hero.videoPoster} className="absolute inset-0 w-full h-full object-cover z-0">
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10 z-[1]" />
      </header>

      {/* MARQUEE */}
      <div className="bg-white py-2 overflow-hidden whitespace-nowrap flex relative z-20 border-b border-neutral-100">
        <div className="flex animate-scroll-left w-max items-center">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-black font-bold uppercase text-[10px] md:text-xs tracking-[0.15em] px-3 flex items-center">
              WE MAKE PARTNERSHIPS, NOT CLIENTS <span className="mx-3 text-amber-500 text-[8px]">■</span>
            </span>
          ))}
        </div>
      </div>

      {/* BRAND CAROUSEL */}
      <section className="py-16 bg-white relative overflow-hidden border-b border-neutral-100">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10" style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10" style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }} />
        <div className="reveal mb-10 px-6 max-w-7xl mx-auto text-center" ref={addToRefs}>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-neutral-400">Marcas que confían y han trabajado con nosotros</p>
        </div>
        <div className="mb-6 overflow-hidden">
          <div className="flex items-center w-max animate-scroll-left gap-10 px-4">
            {[...row1, ...row1].map((logo, i) => (
              <div key={`r1-${i}`} className="flex-shrink-0 flex items-center justify-center">
                <img loading="lazy" decoding="async" src={logo.src} alt={`Logo ${i + 1}`} className={`object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${logo.wide ? 'h-9 w-36' : 'h-10 w-10'}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center w-max animate-scroll-right gap-10 px-4">
            {[...row2, ...row2].map((logo, i) => (
              <div key={`r2-${i}`} className="flex-shrink-0 flex items-center justify-center">
                <img loading="lazy" decoding="async" src={logo.src} alt={`Logo ${i + 1}`} className={`object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${logo.wide ? 'h-9 w-36' : 'h-10 w-10'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className="py-12 md:py-16 px-6 bg-white relative z-10 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 reveal" ref={addToRefs}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px] bg-amber-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Estrategias de Marketing</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                  Con Enfoque<br /><span className="text-neutral-300">Comercial.</span>
                </h2>
                <p className="text-neutral-500 text-sm md:text-base max-w-xl leading-relaxed font-light">Trabajamos con objetivos claros: posicionar, generar demanda y convertir el marketing en crecimiento.</p>
              </div>
              <div className="max-w-md bg-neutral-50 p-6 rounded-2xl border border-neutral-100 hidden md:block">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">Tu departamento de marketing especializado por industria</h3>
                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light">Conoce cómo trabajamos, qué capacidades integramos y los clientes que respaldan nuestra experiencia en cada sector.</p>
              </div>
            </div>
            <div className="mt-8 bg-neutral-50 p-6 rounded-2xl border border-neutral-100 md:hidden">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">Tu departamento de marketing especializado por industria</h3>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light">Conoce cómo trabajamos, qué capacidades integramos y los clientes que respaldan nuestra experiencia en cada sector.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { key: 'empresarial', icon: Building2, title: 'Marketing\nEmpresarial', image: hero.empresarial, video: macopisa.reels[0] },
              { key: 'gastronomico', icon: UtensilsCrossed, title: 'Marketing\nGastronómico', image: hero.gastronomico, video: canaria.reels[0] },
              { key: 'inmobiliario', icon: HomeIcon, title: 'Marketing\nInmobiliario', image: hero.inmobiliario, video: valle.reels[0] },
            ].map(({ key, icon, title, image, video }) => {
              const Icon = icon;
              return (
              <div
                key={key}
                className="specialty-card group relative bg-neutral-900 rounded-[32px] overflow-hidden cursor-pointer h-[450px] md:h-[500px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                onMouseEnter={(e) => {
                  handleMouseEnter(e);
                  const v = e.currentTarget.querySelector('video');
                  if (v) v.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  handleMouseLeave(e);
                  const v = e.currentTarget.querySelector('video');
                  if (v) {
                    v.pause();
                    v.currentTime = 0;
                  }
                }}
                onClick={() => navigate(`/${key}`)}
              >
                <OptimizedImage src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-0 transition-all duration-700" />
                
                {video && (
                  <video 
                    src={video}
                    muted 
                    loop 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative h-full p-8 md:p-10 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-500">
                      <Icon className="w-6 h-6 text-amber-400 group-hover:text-black transition-colors duration-500" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Ver Detalles</p>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 text-white leading-[0.95] whitespace-pre-line">{title}</h3>
                    <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white group-hover:text-amber-400 transition-colors duration-300">
                      Dirección & Ejecución <div className="w-8 h-[1px] bg-white group-hover:bg-amber-400 transition-colors duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-12 bg-neutral-950 text-white relative z-10 dark-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 reveal text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-6" ref={addToRefs}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Estructura de Soluciones</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">Servicios que impulsan el crecimiento</h2>
              <p className="max-w-xl text-xs md:text-sm text-neutral-400 font-light">Brindamos un servicio de marketing estratégico completo que abarca toda la ruta de conversión del cliente.</p>
            </div>
            <button
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className="px-6 py-3 border border-neutral-800 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              {servicesExpanded ? "Ocultar desglose" : "Ver desglose completo"}
              {servicesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Estrategia", desc: "Planeación mensual, análisis profundo de competencia y posicionamiento estratégico.", num: "01", Icon: Target },
              { title: "Contenido", desc: "Producción audiovisual de alta calidad, fotografía y copies de alta conversión.", num: "02", Icon: Layers3 },
              { title: "Publicidad", desc: "Meta Ads, Google Ads y optimización semanal de pauta publicitaria.", num: "03", Icon: TrendingUp },
              { title: "Marca", desc: "Identidad visual corporativa, landing pages y presentaciones de impacto.", num: "04", Icon: Award },
              { title: "Resultados", desc: "Monitoreo constante, mejora de conversión y reportes transparentes.", num: "05", Icon: BarChart3 },
            ].map((s, index) => (
              <div key={index} className="p-6 border border-neutral-900 rounded-2xl bg-neutral-900/20 hover:border-amber-500/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2.5 bg-neutral-900 rounded-xl"><s.Icon className="w-5 h-5 text-amber-400" /></div>
                  <span className="text-[10px] font-mono text-neutral-600">{s.num}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-neutral-100">{s.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {servicesExpanded && (
            <div className="mt-12 pt-12 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 animate-fade-in-up">
              {serviceCategories.map((service, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 pb-2 border-b border-neutral-900">{service.title}</h4>
                  <ul className="space-y-2">
                    {service.items.map((item, i) => (
                      <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROYECTOS VISUALES */}
      <section className="py-16 md:py-12 px-6 max-w-[1400px] mx-auto">
        <div className="reveal mb-12 text-center" ref={addToRefs}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Portafolio Visual</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Casos de <span className="text-neutral-300">Éxito</span></h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal" ref={addToRefs}>
          {/* Columna 1: Post, Historia, Post, Historia */}
          <div className="flex flex-col gap-4">
            {[
              { src: canaria.posts[0], type: 'post' },
              { src: chicken.historias[0], type: 'historia' },
              { src: costa.posts[0], type: 'historia' },
              { src: macopisa.historias[0], type: 'post' },
            ].map((item, i) => (
              <div key={`c1-${i}`} className={`rounded-[24px] overflow-hidden bg-neutral-100 relative shadow-sm group hover:shadow-xl transition-shadow duration-500 cursor-pointer ${item.type === 'post' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}>
                <img loading="lazy" src={item.src} alt="Proyecto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>

          {/* Columna 2: Historia, Post, Historia, Post */}
          <div className="flex flex-col gap-4">
            {[
              { src: valle.historias[0], type: 'historia' },
              { src: unionGanadera.posts[0], type: 'post' },
              { src: canaria.historias[1], type: 'post' },
              { src: chicken.posts[1], type: 'historia' },
            ].map((item, i) => (
              <div key={`c2-${i}`} className={`rounded-[24px] overflow-hidden bg-neutral-100 relative shadow-sm group hover:shadow-xl transition-shadow duration-500 cursor-pointer ${item.type === 'post' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}>
                <img loading="lazy" src={item.src} alt="Proyecto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>

          {/* Columna 3: Post, Historia, Post, Historia */}
          <div className="flex flex-col gap-4">
            {[
              { src: costa.posts[1], type: 'post' },
              { src: macopisa.historias[1], type: 'historia' },
              { src: valle.posts[1], type: 'historia' },
              { src: canaria.historias[2], type: 'post' },
            ].map((item, i) => (
              <div key={`c3-${i}`} className={`rounded-[24px] overflow-hidden bg-neutral-100 relative shadow-sm group hover:shadow-xl transition-shadow duration-500 cursor-pointer ${item.type === 'post' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}>
                <img loading="lazy" src={item.src} alt="Proyecto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>

          {/* Columna 4: Historia, Post, Historia, Post */}
          <div className="flex flex-col gap-4">
            {[
              { src: chicken.historias[2], type: 'historia' },
              { src: macopisa.posts[1], type: 'post' },
              { src: costa.historias[2], type: 'post' },
              { src: unionGanadera.posts[1], type: 'historia' },
            ].map((item, i) => (
              <div key={`c4-${i}`} className={`rounded-[24px] overflow-hidden bg-neutral-100 relative shadow-sm group hover:shadow-xl transition-shadow duration-500 cursor-pointer ${item.type === 'post' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}>
                <img loading="lazy" src={item.src} alt="Proyecto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-16 md:py-24 bg-white relative z-10 border-t border-b border-neutral-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-6 reveal" ref={addToRefs}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#ed8a00]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ed8a00]">Equipo & Propósito</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black uppercase tracking-tighter leading-[0.95] mb-8 text-neutral-900">
                Más que<br />una agencia,<br /><span className="text-[#ed8a00]">somos un equipo.</span>
              </h2>
              <div className="space-y-6 text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-10 max-w-lg">
                <p className="text-sm md:text-base font-black uppercase tracking-tight text-neutral-900 leading-snug">En mnü llevamos más de 6 años trabajando con empresas, marcas de alimentos, proyectos inmobiliarios y negocios en crecimiento.</p>
                <p>Hemos desarrollado campañas para clientes en México y Estados Unidos, combinando estrategia, creatividad, contenido y publicidad digital.</p>
              </div>
              <div className="flex items-center justify-between p-6 bg-white border border-amber-500/10 rounded-2xl shadow-sm max-w-md">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">+6</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ed8a00] leading-tight">Años de<br />Experiencia</p>
                </div>
                <div className="w-[1px] h-12 bg-neutral-200 mx-4"></div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">+20</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ed8a00] leading-tight">Industrias<br />Especializadas</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 reveal relative mt-10 lg:mt-0" ref={addToRefs}>
              <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-32 h-32 md:w-48 md:h-48 bg-[#ed8a00] rounded-[24px] md:rounded-[40px] z-0"></div>
              <div className="relative z-10 rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-white/50 bg-neutral-100">
                <OptimizedImage src={hero.nosotros} alt="Equipo mnü" className="w-full h-auto align-middle object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT SECTION (Landing Only) ═══ */}
      <section id="contacto" className="py-12 bg-black text-white relative z-10 dark-section border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal" ref={addToRefs}>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 mb-4 block">Hagamos Negocios</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 text-white">Hablemos.</h2>
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500 mb-3">Ubicación principal</p>
                  <p className="text-lg md:text-2xl font-light italic text-neutral-300">UCA Torre Corporativa Azenzo, Chihuahua, México.</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500 mb-3">Dirección Directa</p>
                  <CursorLink href="mailto:mnu.ecommerce@gmail.com" className="text-2xl md:text-4xl font-light underline decoration-neutral-800 hover:text-amber-400 transition">mnu.ecommerce@gmail.com</CursorLink>
                </div>
              </div>
            </div>
            <div className="reveal w-full" ref={addToRefs}>
              <div className="w-full aspect-video bg-neutral-900 rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 group relative z-10 shadow-2xl">
                <iframe title="Mapa Azenzo" width="100%" height="100%" frameBorder="0" style={{ border: 0, filter: 'invert(0.9) grayscale(1) contrast(1.15)' }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.139!2d-106.1256287!3d28.6255921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea5d41cf205b97%3A0x5332895d5c03bbcd!2sAzenzo%20Center!5e0!3m2!1ses!2smx!4v1710000000000!5m2!1ses!2smx" allowFullScreen className="group-hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="mt-6 text-right">
                <CursorLink href="https://maps.app.goo.gl/Giqc6WfFZehRJSYz6" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition">Obtener Direcciones en GPS ↗</CursorLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL (Landing Only) ═══ */}
      <section className="py-12 bg-neutral-50 text-center px-6 relative z-10 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-neutral-900 mb-6">Tu marca puede verse mejor, vender mejor y crecer con una estrategia clara.</h2>
          <p className="text-neutral-500 text-xs md:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-light">En mnü creamos marketing con dirección, creatividad y enfoque en resultados.</p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-10 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all hover:scale-105 duration-300">AGENDA UNA LLAMADA CON NUESTRO EQUIPO</CursorLink>
        </div>
      </section>
    </>
  );
};

export default HomePage;
