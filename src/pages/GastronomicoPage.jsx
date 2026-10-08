import { useOutletContext } from 'react-router-dom';
import { hero, projectImages, canaria, chicken, costa } from '../data/assets';
import OptimizedImage from '../components/OptimizedImage';
import ProjectCarousel from '../components/ProjectCarousel';
import { ArrowRight, CheckCircle2, Camera, FileText, Target } from '../components/icons';
import CursorLink from '../components/CursorLink';

const GastronomicoPage = (props) => {
  const outletCtx = useOutletContext() || {};
  const addToRefs = props.addToRefs || outletCtx.addToRefs;
  const setBookingModalOpen = props.setBookingModalOpen || outletCtx.setBookingModalOpen;

  return (
    <div className="bg-white min-h-screen pb-0 relative z-10">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-16 overflow-hidden">
        <OptimizedImage src={hero.gastronomico} alt="Marketing Gastronómico" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center reveal" ref={addToRefs}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            Marketing Gastronómico<br />
            <span className="text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>Con Dirección y Ejecución</span>
          </h1>
          <p className="text-neutral-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-light mb-12">
            Creamos, dirigimos y operamos el departamento de marketing de restaurantes, grupos gastronómicos y marcas de alimentos.
          </p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 inline-block">
            Hablemos de tu negocio
          </CursorLink>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-12 md:py-16 px-6 bg-neutral-50 relative z-10 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center reveal" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
              Nos integramos<br />a tu operación
            </h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
              Podemos funcionar como tu departamento externo de marketing o fortalecer el equipo que ya tienes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {["Dirección estratégica", "Project management", "Community management", "Producción de contenido", "Campañas digitales", "Auditoría de marketing"].map((item, i) => (
              <div key={i} className="group flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-900 hover:border-neutral-900 transition-all duration-300 reveal cursor-pointer shadow-sm hover:shadow-lg" ref={addToRefs}>
                <div className="flex items-center gap-4">
                  <span className="text-lg md:text-xl font-black text-amber-500/50 group-hover:text-amber-500 transition-colors duration-300">0{i + 1}</span>
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-neutral-900 group-hover:text-white transition-colors duration-300">{item}</h3>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className="py-12 md:py-16 px-6 bg-neutral-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 reveal" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Del concepto<br />a la venta
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light mb-8">
              Analizamos tu operación, oferta, sucursales y objetivos para desarrollar campañas, lanzamientos y estrategias enfocadas en generar tráfico y aumentar ventas.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-neutral-300">
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Promociones</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Lanzamientos</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Temporadas</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Contenido</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Campañas</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Seguimiento</div>
            </div>
          </div>
          <div className="lg:col-span-7 flex justify-center reveal" ref={addToRefs}>
            <div className="rounded-[32px] overflow-hidden w-4/5 md:w-3/4 max-w-lg shadow-2xl">
              <OptimizedImage src={projectImages.conceptoGastronomico} alt="Estrategia Gastronómica" className="w-full h-auto align-middle opacity-90 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCCIÓN */}
      <section className="py-12 md:py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex justify-center reveal order-2 lg:order-1" ref={addToRefs}>
            <div className="rounded-[32px] overflow-hidden w-4/5 md:w-3/4 max-w-lg shadow-2xl">
              <OptimizedImage src={projectImages.project2} alt="Producción Gastronómica" className="w-full h-auto align-middle object-cover" />
            </div>
          </div>
          <div className="lg:col-span-5 reveal order-1 lg:order-2" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
              Contenido que abre<br />el apetito
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-8">
              Contamos con equipo profesional de fotografía y video para presentar cada producto, experiencia y sucursal con la calidad que tu negocio necesita.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-neutral-800">
              <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-amber-500" /> Fotografía de alimentos</div>
              <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-amber-500" /> Video gastronómico</div>
              <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-amber-500" /> Contenido para redes</div>
              <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /> Cobertura de eventos</div>
              <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /> Producción para campañas</div>
              <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /> Dirección de proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT MANAGEMENT Y AUDITORÍA */}
      <section className="py-12 px-6 bg-neutral-100 relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 md:p-12 rounded-[32px] shadow-sm reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Project Management Gastronómico</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-6 leading-tight">
              Planeamos y ejecutamos proyectos completos de marketing para aperturas, nuevas sucursales, productos, promociones y campañas de temporada.
            </h3>
          </div>
          <div className="bg-neutral-900 text-white p-10 md:p-12 rounded-[32px] shadow-lg reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Auditoría y mejora</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">
              Revisamos todo<br />tu marketing
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Auditamos comunicación, redes, campañas, promociones, experiencia digital y ejecución en sucursales para detectar oportunidades de mejora.
            </p>
          </div>
        </div>
      </section>

      {/* TÍTULO PROYECTOS */}
      <section className="py-12 px-6 bg-white relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto text-center reveal" ref={addToRefs}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Nuestro Trabajo</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
            Casos de Éxito<br />Gastronómicos
          </h2>
        </div>
      </section>

      <ProjectCarousel title="LA CANARIA" number="01" subtitle="Marketing Gastronómico" heading="Estrategia y contenido" description="Desarrollamos el concepto de comunicación, fotografía, video y campañas de redes sociales para impulsar el posicionamiento y captación de clientes." features={["Fotografía de alimentos", "Video gastronómico", "Contenido para redes", "Campañas digitales"]} posts={canaria.posts} reels={canaria.reels} historias={canaria.historias} bgColor="bg-neutral-100" addToRefs={addToRefs} />
      <ProjectCarousel title="CHICKEN FRIES" number="02" subtitle="Dirección y operación" heading="Campañas dinámicas y creativas" description="Gestionamos la imagen y publicidad de la marca, generando piezas atractivas y dinámicas que conectan con su público objetivo." features={["Estrategia creativa", "Producción de video", "Manejo de redes", "Publicidad pagada"]} posts={chicken.posts} reels={chicken.reels} historias={chicken.historias} bgColor="bg-neutral-950 text-white" addToRefs={addToRefs} />
      <ProjectCarousel title="COSTA LANGOSTA" number="03" subtitle="Marketing integral" heading="Contenido fresco y atractivo" description="Creamos la identidad visual en redes y operamos las estrategias comerciales para mantener la marca en el top of mind." features={["Fotografía de platillos", "Video comercial", "Promoción de sucursales", "Campañas de alcance"]} posts={costa.posts} reels={costa.reels} historias={costa.historias} bgColor="bg-white" addToRefs={addToRefs} />

      {/* CIERRE */}
      <section className="py-16 bg-black text-center px-6 relative z-10 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto reveal" ref={addToRefs}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            CREAMOS Y OPERAMOS EL<br />
            <span className="text-transparent text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)' }}>MARKETING DE TU RESTAURANTE.</span>
          </h2>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm md:text-base mb-12">
            Un departamento de marketing especializado en gastronomía
          </p>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            Estrategia, dirección, producción y ejecución bajo un solo equipo.
          </p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-10 py-5 bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 mt-4">
            Agenda una reunión
          </CursorLink>
        </div>
      </section>
    </div>
  );
};

export default GastronomicoPage;
