import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from './icons';
import CursorLink from './CursorLink';

const CotizacionEmpresa = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', employees: '', industry: 'empresarial',
    budget: '', services: [], message: ''
  });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const serviceOptions = [
    "Dirección estratégica", "Community management", "Producción de contenido",
    "Campañas digitales", "Branding e identidad", "Auditoría de marketing"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const toggleService = (service) => {
    const current = formData.services;
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    setFormData({ ...formData, services: updated });
  };

  if (step === 2) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 bg-white animate-fade-in-up min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-md mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-neutral-900 mb-4">¡Cotización Enviada!</h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-8">
            Gracias, <strong>{formData.name}</strong>. Hemos recibido la información de <strong>{formData.company}</strong>. Un estratega se pondrá en contacto en las próximas 24 horas.
          </p>
          <CursorLink to="/" className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors inline-block">
            Volver al Inicio
          </CursorLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-white animate-fade-in-up min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CursorLink onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black mb-12">
          <ArrowLeft className="w-4 h-4 text-amber-500" /> Volver
        </CursorLink>

        <div className="mb-12">
          <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.4em] text-neutral-400 block mb-3">Cotización Empresarial</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-neutral-900 mb-4">
            Solicita tu cotización
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl leading-relaxed font-light">
            Completa el formulario y te contactaremos con una propuesta personalizada para tu empresa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Nombre completo</label>
              <input type="text" required className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-amber-500 transition-colors" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Email</label>
              <input type="email" required className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-amber-500 transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Empresa</label>
              <input type="text" required className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-amber-500 transition-colors" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Empleados</label>
              <select className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-amber-500 transition-colors" value={formData.employees} onChange={(e) => setFormData({ ...formData, employees: e.target.value })}>
                <option value="">Seleccionar</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-3">Servicios de interés</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <button key={service} type="button" onClick={() => toggleService(service)} className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-widest text-left transition-all ${formData.services.includes(service) ? 'bg-amber-500 text-black border-amber-500' : 'bg-white border-neutral-100 text-neutral-600 hover:border-amber-300'}`}>
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Mensaje</label>
            <textarea rows={4} className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-amber-500 transition-colors resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Cuéntanos sobre tu proyecto..." />
          </div>

          <button type="submit" className="px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all hover:scale-105 duration-300">
            ENVIAR COTIZACIÓN
          </button>
        </form>
      </div>
    </div>
  );
};

export default CotizacionEmpresa;
