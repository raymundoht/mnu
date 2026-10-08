import { useOutletContext } from 'react-router-dom';
import { hero, projectImages, valle } from '../data/assets';
import OptimizedImage from '../components/OptimizedImage';
import ProjectCarousel from '../components/ProjectCarousel';
import { ArrowRight, CheckCircle2, Camera, FileText, Target } from '../components/icons';
import CursorLink from '../components/CursorLink';

const InmobiliarioPage = (props) => {
  const outletCtx = useOutletContext() || {};
  const addToRefs = props.addToRefs || outletCtx.addToRefs;
  const setBookingModalOpen = props.setBookingModalOpen || outletCtx.setBookingModalOpen;

  return (
    <div className="bg-white min-h-screen pb-0 relative z-10">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-16 overflow-hidden">
        <OptimizedImage src={hero.inmobiliario} alt="Marketing Inmobiliario" className="absolute inset-0 w-full h-full object-cover object-top z-0" />
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center reveal" ref={addToRefs}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            Marketing Inmobiliario<br />
            <span className="text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>Con Dirección y Ejecución</span>
          </h1>
          <p className="text-neutral-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-light mb-12">
            Creamos, dirigimos y operamos el departamento de marketing de desarrolladoras, constructoras, plazas comerciales y proyectos inmobiliarios.
          </p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 inline-block">
            Hablemos de tu proyecto
          </CursorLink>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-12 md:py-16 px-6 bg-neutral-50 relative z-10 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center reveal" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
              Nos integramos<br />a tu equipo comercial
            </h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
              Podemos operar como tu departamento externo de marketing o fortalecer la estructura que ya tienes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {["Dirección estratégica", "Project management", "Producción audiovisual", "Campañas digitales", "Generación de prospectos", "Auditoría de marketing"].map((item, i) => (
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
              Del proyecto<br />a la comercialización
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light mb-8">
              Analizamos el desarrollo, mercado, ubicación y objetivos comerciales para estructurar una estrategia enfocada en generar interés, prospectos y ventas.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-neutral-300">
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Lanzamientos</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Preventas</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Campañas</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Contenido</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Material comercial</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Seguimiento</div>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-[32px] overflow-hidden reveal" ref={addToRefs}>
            <OptimizedImage src={hero.inmobiliario} alt="Estrategia Inmobiliaria" className="w-full h-auto align-middle opacity-90" />
          </div>
        </div>
      </section>

      {/* PRODUCCIÓN AUDIOVISUAL */}
      <section className="py-12 md:py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 rounded-[32px] overflow-hidden reveal order-2 lg:order-1" ref={addToRefs}>
            <OptimizedImage src={projectImages.project3} alt="Producción Inmobiliaria" className="w-full h-auto align-middle" />
          </div>
          <div className="lg:col-span-5 reveal order-1 lg:order-2" ref={addToRefs}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
              Presentamos cada proyecto<br />con calidad comercial
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-8">
              Contamos con equipo profesional para producir contenido que comunique ubicación, avance, espacios y valor de inversión.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-neutral-800">
              <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-amber-500" /> Video inmobiliario</div>
              <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-amber-500" /> Fotografía profesional</div>
              <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /> Tomas con dron</div>
              <div className="flex items-center gap-3"><Target className="w-5 h-5 text-amber-500" /> Recorridos de propiedades</div>
              <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-amber-500" /> Contenido para campañas</div>
              <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-amber-500" /> Dirección de proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT MANAGEMENT Y AUDITORÍA */}
      <section className="py-12 px-6 bg-neutral-100 relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 md:p-12 rounded-[32px] shadow-sm reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Project Management Inmobiliario</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-6 leading-tight">
              Planeamos y ejecutamos proyectos completos de marketing para desarrollos, plazas comerciales, vivienda, oficinas y espacios industriales.
            </h3>
          </div>
          <div className="bg-neutral-900 text-white p-10 md:p-12 rounded-[32px] shadow-lg reveal" ref={addToRefs}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Auditoría y mejora</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">
              Revisamos todo el proceso<br />de marketing
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Auditamos comunicación, campañas, materiales de venta, generación de prospectos y seguimiento comercial para detectar oportunidades de mejora.
            </p>
          </div>
        </div>
      </section>

      {/* PROYECTOS INMOBILIARIOS */}
      <section className="py-12 md:py-16 px-6 bg-neutral-50 relative z-10 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto text-center reveal" ref={addToRefs}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4 block">Nuestro Trabajo</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900 mb-6">
            Casos de Éxito<br />Inmobiliarios
          </h2>
        </div>
      </section>

      <ProjectCarousel title="VALLE DE LOS ENCINOS" number="01" subtitle="Brokerage y comercialización inmobiliaria" heading="Comercialización inmobiliaria integral" description="Comercializamos los lotes del proyecto a través de nuestra inmobiliaria, respaldando la venta con estrategia, atención comercial y producción audiovisual de alta calidad." features={["Comercialización de lotes", "Atención a prospectos", "Campañas de captación", "Fotografía y video profesional"]} posts={valle.posts} reels={valle.reels} historias={valle.historias} bgColor="bg-neutral-100" addToRefs={addToRefs} />

      {/* CIERRE */}
      <section className="py-16 bg-black text-center px-6 relative z-10 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto reveal" ref={addToRefs}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
            CREAMOS Y OPERAMOS EL MARKETING DE<br />
            <span className="text-transparent text-outline" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)' }}>TU PROYECTO INMOBILIARIO.</span>
          </h2>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm md:text-base mb-12">
            Un departamento de marketing especializado en inmobiliario
          </p>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            Estrategia, dirección, producción y ejecución para acelerar la comercialización de cada proyecto.
          </p>
          <CursorLink as="button" onClick={() => setBookingModalOpen && setBookingModalOpen(true)} className="px-10 py-5 bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 mt-4">
            Agenda una reunión
          </CursorLink>
        </div>
      </section>
    </div>
  );
};

export default InmobiliarioPage;
