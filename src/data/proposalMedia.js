import { campestre, canaria, hero, macopisa, projectImages, valle } from './assets';

export const proposalMedia = [
  { key: 'empresarial-portada', category: 'empresarial', label: 'Identidad empresarial', src: hero.empresarial, position: 'center' },
  { key: 'empresarial-equipo', category: 'empresarial', label: 'Equipo MNU', src: hero.nosotros, position: 'center' },
  { key: 'empresarial-campestre', category: 'empresarial', label: 'Proyecto Campestre', src: campestre.image, position: 'center' },
  { key: 'empresarial-industria', category: 'empresarial', label: 'Proyecto industrial', src: macopisa.posts[0], position: 'center' },
  { key: 'gastronomico-portada', category: 'gastronomico', label: 'Producción gastronómica', src: hero.gastronomico, position: 'center' },
  { key: 'gastronomico-concepto', category: 'gastronomico', label: 'Concepto y producto', src: projectImages.conceptoGastronomico, position: 'center' },
  { key: 'gastronomico-experiencia', category: 'gastronomico', label: 'Experiencia de marca', src: projectImages.project2, position: 'center' },
  { key: 'gastronomico-canaria', category: 'gastronomico', label: 'Proyecto Canaria', src: canaria.posts[0], position: 'center' },
  { key: 'inmobiliario-portada', category: 'inmobiliario', label: 'Marketing inmobiliario', src: hero.inmobiliario, position: 'center' },
  { key: 'inmobiliario-proyecto', category: 'inmobiliario', label: 'Proyecto residencial', src: valle.posts[0], position: 'center' },
  { key: 'inmobiliario-detalle', category: 'inmobiliario', label: 'Detalle arquitectónico', src: valle.posts[1], position: 'center' },
  { key: 'inmobiliario-estilo', category: 'inmobiliario', label: 'Estilo de vida', src: projectImages.project3, position: 'center' },
];

export const proposalDefaults = {
  empresarial: { hero: 'empresarial-portada', feature: 'empresarial-equipo' },
  gastronomico: { hero: 'gastronomico-portada', feature: 'gastronomico-concepto' },
  inmobiliario: { hero: 'inmobiliario-portada', feature: 'inmobiliario-proyecto' },
};

export function getProposalMedia(key, category = 'empresarial', slot = 'hero') {
  const fallbackKey = proposalDefaults[category]?.[slot] ?? proposalDefaults.empresarial[slot];
  return proposalMedia.find((item) => item.key === key) ?? proposalMedia.find((item) => item.key === fallbackKey);
}

export function getProposalMediaByCategory(category = 'empresarial') {
  return proposalMedia.filter((item) => item.category === category);
}
