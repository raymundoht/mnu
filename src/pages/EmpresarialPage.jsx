import { useOutletContext } from 'react-router-dom';
import { hero, campestre, unionGanadera } from '../data/assets';
import OptimizedImage from '../components/OptimizedImage';
import ProjectCarousel from '../components/ProjectCarousel';
import { ArrowRight, CheckCircle2, Camera, FileText, Target } from '../components/icons';
import CursorLink from '../components/CursorLink';

const EmpresarialPage = (props) => {
  const outletCtx = useOutletContext() || {};
  const addToRefs = props.addToRefs || outletCtx.addToRefs;
  const setBookingModalOpen = props.setBookingModalOpen || outletCtx.setBookingModalOpen;

  return (
    <div className="bg-white min-h-screen pb-0 relative z-10">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-16 overflow-hidden">
        <OptimizedImage src={hero.empresarial} alt="Marketing Empresarial" className="absolute inset-0 w-full h-full object-cover object-top z-0" />
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center reveal" ref={addToRefs}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            Marketing Empresarial<br />
            <span className="text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>Con Dirección y Ejecución</span>
          </h1>
          <p className="text-neutral-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-light mb-12">
            Creamos, dirigimos y operamos departamentos de marketing para empresas que necesitan estructura, producción y resultados comerciales.
          </p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 inline-block">
            Hablemos de tu empresa
          </CursorLink>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-16 md:py-24 px-6 relative z-10 border-t border-neutral-100 bg-[#faf9f6] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="lg:w-1/3 flex flex-col items-start text-left reveal" ref={addToRefs}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[1.1] text-neutral-900 mb-6">
              NOS INTEGRAMOS A<br />TU EMPRESA
            </h2>
            <div className="w-12 h-[2px] bg-amber-300 mb-6"></div>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light">
              Podemos operar como tu departamento externo de marketing o fortalecer el equipo que ya tienes.
            </p>
          </div>
          <div className="lg:w-2/3 relative flex w-full">
            <div className="hidden lg:block absolute left-0 top-2 bottom-2 w-[1px] bg-amber-500/20">
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300"></div>
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300"></div>
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full lg:pl-10 reveal" ref={addToRefs}>
              {["Dirección estratégica", "Project management", "Community management", "Producción profesional", "Campañas digitales", "Auditoría de marketing"].map((item, i) => {
                const isActive = i === 0;
                return (
                  <div
                    key={i}
                    className={`group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer
                      ${isActive
                        ? 'bg-[#111] border-neutral-900 text-white'
                        : 'bg-white border-neutral-100 text-neutral-900 hover:border-amber-500/30'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl md:text-3xl font-black ${isActive ? 'text-amber-500' : 'text-amber-400/80 group-hover:text-amber-500 transition-colors'}`}>
                        0{i + 1}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest">{item}</h3>
                    </div>
                    {isActive ? (
                      <div className="w-8 h-8 rounded-full bg-[#f6ab63] flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-4 h-4 text-neutral-900" />
                      </div>
                    ) : (
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors transform group-hover:translate-x-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className="py-12 md:py-16 px-6 bg-neutral-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 reveal" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              De la estrategia a<br />la ejecución
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light mb-8">
              Analizamos lo que ya se está haciendo, detectamos oportunidades y estructuramos proyectos completos de marketing alineados a los objetivos de la empresa.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-neutral-300">
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Estrategia</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Equipos</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Calendarios</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Producción</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Campañas</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Seguimiento</div>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-[32px] overflow-hidden reveal" ref={addToRefs}>
            <OptimizedImage src={campestre.image} alt="Estrategia" className="w-full h-auto align-middle opacity-90 object-cover" />
          </div>
        </div>
      </section>

      {/* CAPACIDAD DE PRODUCCIÓN */}
      <section className="py-12 md:py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 aspect-[4/3] rounded-[32px] overflow-hidden reveal order-2 lg:order-1" ref={addToRefs}>
            <OptimizedImage src={unionGanadera.posts[0]} alt="Producción" className="w-full h-full object-cover" />
          </div>
          <div className="lg:col-span-5 reveal order-1 lg:order-2" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
              Producción Profesional<br />Interna
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-8">
              Contamos con equipo especializado, cámaras profesionales y herramientas de producción para desarrollar contenido corporativo, comercial e institucional de alto nivel.
            </p>
            <div className="space-y-4 text-sm font-bold text-neutral-800">
              <div className="flex items-center gap-4"><Camera className="w-5 h-5 text-amber-500" /> Video empresarial & Fotografía</div>
              <div className="flex items-center gap-4"><FileText className="w-5 h-5 text-amber-500" /> Contenido comercial & Cobertura de eventos</div>
              <div className="flex items-center gap-4"><Target className="w-5 h-5 text-amber-500" /> Producción para campañas & Dirección de proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT MANAGEMENT Y AUDITORÍA */}
      <section className="py-12 px-6 bg-neutral-100 relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 md:p-12 rounded-[32px] shadow-sm reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Project Management de Marketing</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-6 leading-tight">
              Planeamos, coordinamos y ejecutamos proyectos de marketing de principio a fin, con responsables, tiempos, entregables y objetivos claros.
            </h3>
          </div>
          <div className="bg-neutral-900 text-white p-10 md:p-12 rounded-[32px] shadow-lg reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Auditoría y mejora</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">
              Revisamos todo el marketing<br />de tu empresa
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Auditamos estrategia, comunicación, contenido, campañas, proveedores y procesos para identificar qué funciona, qué debe corregirse y dónde existen oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* TÍTULO PROYECTOS */}
      <section className="py-12 px-6 bg-white relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto text-center reveal" ref={addToRefs}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Nuestro Trabajo</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
            Casos de Éxito<br />Empresariales
          </h2>
        </div>
      </section>

      <ProjectCarousel title="MACOPISA" number="01" subtitle="Dirección y operación de marketing" heading="Marketing enfocado en ventas" description="Operamos el departamento de marketing de una empresa líder en pintura, con más de 20 sucursales en Chihuahua, desarrollando estrategias comerciales para atraer clientes y aumentar ventas." features={["Estrategias de venta", "Campañas de captación", "Promoción de sucursales", "Contenido comercial"]} posts={[unionGanadera.posts[0], unionGanadera.posts[1], unionGanadera.posts[2], unionGanadera.posts[3], unionGanadera.posts[4]]} reels={[unionGanadera.reels[0], unionGanadera.reels[1], unionGanadera.reels[2], unionGanadera.reels[3], unionGanadera.reels[0]]} historias={[]} bgColor="bg-neutral-100" addToRefs={addToRefs} />
      <ProjectCarousel title="CLUB CAMPESTRE" number="02" subtitle="Marketing integral & eventos masivos" heading="Comunicación que fortalece la comunidad del club" description="Desarrollamos la comunicación institucional del Campestre y damos cobertura integral a sus eventos para mantener informados a socios y generar mayor valor para patrocinadores." features={["Comunicación con socios", "Cobertura de eventos", "Contenido institucional", "Presencia de patrocinadores"]} singleImage={campestre.image} bgColor="bg-neutral-950 text-white" addToRefs={addToRefs} />
      <ProjectCarousel title="UNIÓN GANADERA" number="03" subtitle="Departamento de marketing" heading="Marketing para cada unidad de negocio" description="Trabajamos la comunicación y comercialización de las diferentes áreas de la Unión, desarrollando estrategias que apoyan a los productores y fortalecen sus servicios." features={["Subastas ganaderas", "Corrales de engorda", "Tienda de la Unión", "Servicios al productor"]} posts={[unionGanadera.posts[0], unionGanadera.posts[1], unionGanadera.posts[2], unionGanadera.posts[3], unionGanadera.posts[4]]} reels={[unionGanadera.reels[0], unionGanadera.reels[1], unionGanadera.reels[2], unionGanadera.reels[3], unionGanadera.reels[0]]} historias={[]} bgColor="bg-white" addToRefs={addToRefs} />

      {/* CIERRE */}
      <section className="py-16 bg-black text-center px-6 relative z-10 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto reveal" ref={addToRefs}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            Creamos y operamos<br />
            <span className="text-transparent text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)' }}>tu departamento de marketing.</span>
          </h2>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm md:text-base mb-12">
            Un departamento de marketing listo para operar
          </p>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            Estrategia, dirección, producción y ejecución bajo un solo equipo.
          </p>
        </div>
      </section>
    </div>
  );
};

export default EmpresarialPage;
