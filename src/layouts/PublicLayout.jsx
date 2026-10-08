import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import GlobalStyles from '../components/GlobalStyles';
import { XIcon, MenuIcon, ChevronDown, CheckCircle2, SocialIcon } from '../components/icons';
import CursorLink from '../components/CursorLink';
import { brand } from '../data/assets';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'empresarial',
    date: '',
    time: '',
  });

  const cursorRef = useRef(null);
  const revealRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, observerOptions);

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    const staticElements = document.querySelectorAll('.reveal');
    staticElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [location.pathname]);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const handleMouseEnter = () => {
    if (cursorRef.current) cursorRef.current.classList.add('cursor-active');
  };

  const handleMouseLeave = () => {
    if (cursorRef.current) cursorRef.current.classList.remove('cursor-active');
  };

  const navigateToSection = (sectionId) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingStep(2);
    const getIndustryLabel = (val) => {
      switch (val) {
        case 'empresarial':
          return 'Marketing Empresarial (B2B)';
        case 'gastronomico':
          return 'Marketing Gastronómico y Alimentos';
        case 'inmobiliario':
          return 'Marketing Inmobiliario (Bienes Raíces)';
        default:
          return val;
      }
    };
    const text = `Hola, solicito una llamada de diagnóstico. Aquí están los datos de mi proyecto:\n\nNombre: ${bookingData.name}\nEmail: ${bookingData.email}\nEmpresa/Proyecto: ${bookingData.company}\nIndustria principal: ${getIndustryLabel(bookingData.industry)}\nFecha tentativa: ${bookingData.date}`;
    const whatsappUrl = `https://wa.me/526142775603?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="noise bg-white text-black min-h-screen font-sans antialiased overflow-x-hidden">
      <GlobalStyles />
      <div id="custom-cursor" ref={cursorRef} className="fixed top-0 left-0 z-[9999] pointer-events-none" />

      {/* ═══ NAVIGATION BAR ═══ */}
      <nav
        className={`fixed w-full z-[100] transition-all duration-500 px-6 md:px-12 flex justify-between items-center ${
          scrolled
            ? 'py-3 bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5'
            : 'py-4 bg-white/10 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center">
          <CursorLink to="/" className="block">
            <img
              loading="eager"
              src={scrolled ? brand.mnuNegro : brand.mnuBlanco}
              alt="mnü"
              className="h-6 md:h-8 object-contain transition-all duration-500"
            />
          </CursorLink>
        </div>

        {/* Desktop Menu */}
        <div
          className={`hidden lg:flex space-x-10 font-bold uppercase text-[10px] tracking-[0.25em] items-center transition-colors duration-500 ${
            scrolled ? 'text-black' : 'text-white'
          }`}
        >
          <CursorLink onClick={() => navigateToSection('inicio')} className="hover:text-amber-500 transition-colors">
            Inicio
          </CursorLink>
          <div className="relative group py-2">
            <span className="hover:text-amber-500 transition-colors flex items-center gap-1" style={{ cursor: 'none' }}>
              Especialidades <ChevronDown className="h-3 w-3 text-amber-500" />
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-72 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 flex flex-col gap-2">
              <CursorLink
                to="/empresarial"
                className="text-left text-[9px] font-black tracking-widest uppercase hover:text-amber-500 p-2.5 rounded-xl hover:bg-amber-50/50 transition-all text-black"
                style={{ cursor: 'none' }}
              >
                — Marketing Empresarial
              </CursorLink>
              <CursorLink
                to="/gastronomico"
                className="text-left text-[9px] font-black tracking-widest uppercase hover:text-amber-500 p-2.5 rounded-xl hover:bg-amber-50/50 transition-all text-black"
                style={{ cursor: 'none' }}
              >
                — Mkt. Gastronómico y Alimentos
              </CursorLink>
              <CursorLink
                to="/inmobiliario"
                className="text-left text-[9px] font-black tracking-widest uppercase hover:text-amber-500 p-2.5 rounded-xl hover:bg-amber-50/50 transition-all text-black"
                style={{ cursor: 'none' }}
              >
                — Marketing Inmobiliario
              </CursorLink>
            </div>
          </div>
          <CursorLink onClick={() => navigateToSection('servicios')} className="hover:text-amber-500 transition-colors">
            Servicios
          </CursorLink>
          <CursorLink onClick={() => navigateToSection('nosotros')} className="hover:text-amber-500 transition-colors">
            Nosotros
          </CursorLink>
          <CursorLink onClick={() => navigateToSection('contacto')} className="hover:text-amber-500 transition-colors">
            Contacto
          </CursorLink>
          <CursorLink
            as="button"
            onClick={() => setBookingModalOpen(true)}
            className="px-5 py-2.5 bg-black text-white rounded-full hover:bg-amber-500 hover:text-black hover:scale-105 transition-all text-[9px] font-black tracking-[0.15em]"
          >
            AGENDA UNA LLAMADA
          </CursorLink>
        </div>

        {/* Mobile Menu Actions */}
        <div className="lg:hidden flex items-center gap-2">
          <CursorLink
            as="button"
            onClick={() => setBookingModalOpen(true)}
            className="text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 bg-black text-white rounded-full hover:bg-amber-500"
          >
            LLAMADA
          </CursorLink>
          <CursorLink
            as="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border border-black/10 rounded-full bg-white flex items-center justify-center"
          >
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </CursorLink>
        </div>
      </nav>

      {/* ═══ MOBILE FULLSCREEN DRAWER ═══ */}
      <div
        className={`fixed inset-0 bg-black z-[90] transition-all duration-700 ease-in-out flex flex-col justify-between p-12 text-white ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center mt-12">
          <img src={brand.mnuBlanco} alt="mnü" className="h-7 object-contain" />
        </div>
        <div className="flex flex-col space-y-4 my-auto text-left">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold">Especialidades & Servicios</p>
          <CursorLink
            to="/#inicio"
            onClick={() => {
              setMenuOpen(false);
              navigateToSection('inicio');
            }}
            className="text-xl font-black uppercase tracking-tight hover:text-amber-500 transition-colors"
          >
            01. Inicio General
          </CursorLink>
          <CursorLink
            to="/empresarial"
            onClick={() => setMenuOpen(false)}
            className="text-lg font-bold uppercase tracking-tight text-neutral-300 hover:text-amber-500 transition-colors"
          >
            02. Mkt. Empresarial
          </CursorLink>
          <CursorLink
            to="/gastronomico"
            onClick={() => setMenuOpen(false)}
            className="text-lg font-bold uppercase tracking-tight text-neutral-300 hover:text-amber-500 transition-colors"
          >
            03. Mkt. Gastronómico
          </CursorLink>
          <CursorLink
            to="/inmobiliario"
            onClick={() => setMenuOpen(false)}
            className="text-lg font-bold uppercase tracking-tight text-neutral-300 hover:text-amber-500 transition-colors"
          >
            04. Mkt. Inmobiliario
          </CursorLink>
          <hr className="border-neutral-800 my-2" />
          <CursorLink
            onClick={() => navigateToSection('servicios')}
            className="text-lg font-medium uppercase tracking-tight hover:text-amber-500"
          >
            Servicios
          </CursorLink>
          <CursorLink
            onClick={() => navigateToSection('nosotros')}
            className="text-lg font-medium uppercase tracking-tight hover:text-amber-500"
          >
            Nosotros
          </CursorLink>
          <CursorLink
            onClick={() => navigateToSection('contacto')}
            className="text-lg font-medium uppercase tracking-tight hover:text-amber-500"
          >
            Contacto
          </CursorLink>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-500 text-[10px] border-t border-white/10 pt-8 gap-4">
          <p>© 2026 MNÜ DIGITAL. CHIHUAHUA, MÉXICO.</p>
          <div className="flex gap-6 font-bold tracking-widest">
            <CursorLink href="https://www.instagram.com/mnu.mkt/" target="_blank" rel="noreferrer" className="hover:text-white">
              INSTAGRAM
            </CursorLink>
            <CursorLink href="#" className="hover:text-white">
              LINKEDIN
            </CursorLink>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <Outlet
        context={{
          addToRefs,
          setBookingModalOpen,
          handleMouseEnter,
          handleMouseLeave,
          navigateToSection,
        }}
      />

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-6 border-t border-neutral-100 bg-white relative z-10 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <CursorLink to="/">
            <img src={brand.mnuNegro} alt="mnü" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </CursorLink>
          <p className="text-[9px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            © 2026 MNÜ DIGITAL. AGENCIA DE MARKETING ESTRATÉGICO.
          </p>
          <div className="flex gap-8 text-black items-center">
            <CursorLink
              href="https://www.instagram.com/mnu.mkt/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-45 transition"
            >
              <SocialIcon type="instagram" />
            </CursorLink>
            <CursorLink href="#" className="hover:opacity-45 transition">
              <SocialIcon type="linkedin" />
            </CursorLink>
          </div>
        </div>
      </footer>

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 md:p-10 relative shadow-2xl animate-scale-up text-black">
            <button
              onClick={() => {
                setBookingModalOpen(false);
                setBookingStep(1);
              }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              style={{ cursor: 'none' }}
            >
              <XIcon className="w-5 h-5 text-neutral-500" />
            </button>
            {bookingStep === 1 ? (
              <form onSubmit={handleBookingSubmit} className="space-y-6 text-left">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 block mb-2">
                    Estrategia & Dirección
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">Agenda tu Sesión Inicial</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-1 font-light">
                    Comparte brevemente los datos de tu marca y agendemos una llamada para diseñar una estrategia con rumbo claro.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                      Tu Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-800 outline-none focus:border-amber-500 transition-colors"
                      style={{ cursor: 'none' }}
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                        Email de contacto
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-800 outline-none focus:border-amber-500 transition-colors"
                        style={{ cursor: 'none' }}
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                        Empresa / Proyecto
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Desarrollos Delta"
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-800 outline-none focus:border-amber-500 transition-colors"
                        style={{ cursor: 'none' }}
                        value={bookingData.company}
                        onChange={(e) => setBookingData({ ...bookingData, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                        Industria principal
                      </label>
                      <select
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-800 outline-none focus:border-amber-500 transition-colors"
                        style={{ cursor: 'none' }}
                        value={bookingData.industry}
                        onChange={(e) => setBookingData({ ...bookingData, industry: e.target.value })}
                      >
                        <option value="empresarial">Marketing Empresarial (B2B)</option>
                        <option value="gastronomico">Marketing Gastronómico y Alimentos</option>
                        <option value="inmobiliario">Marketing Inmobiliario (Bienes Raíces)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                        Fecha tentativa
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-800 outline-none focus:border-amber-500 transition-colors"
                        style={{ cursor: 'none' }}
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-500 hover:text-black hover:scale-[1.02] transition-all"
                  style={{ cursor: 'none' }}
                >
                  CONFIRMAR SOLICITUD DE LLAMADA
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">¡Solicitud recibida!</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-2 max-w-sm mx-auto font-light">
                    Gracias por tu confianza, <strong>{bookingData.name}</strong>. Un estratega de mnü se pondrá en contacto
                    contigo al correo <strong>{bookingData.email}</strong> para coordinar la videollamada comercial para{' '}
                    <strong>{bookingData.company}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingStep(1);
                  }}
                  className="px-8 py-3 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors"
                  style={{ cursor: 'none' }}
                >
                  CERRAR VENTANA
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
