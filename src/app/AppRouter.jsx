import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import ProposalLayout from '../layouts/ProposalLayout';
import AdminLayout from '../layouts/AdminLayout';
import ScrollManager from '../components/ScrollManager';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthProvider';

// Lazy-loaded pages to separate bundles and prevent heavy media loading on admin/proposal routes
const HomePage = lazy(() => import('../pages/HomePage'));
const EmpresarialPage = lazy(() => import('../pages/EmpresarialPage'));
const GastronomicoPage = lazy(() => import('../pages/GastronomicoPage'));
const InmobiliarioPage = lazy(() => import('../pages/InmobiliarioPage'));
const CotizacionEmpresa = lazy(() => import('../components/CotizacionEmpresa'));
const PublicProposalPage = lazy(() => import('../pages/proposal/PublicProposalPage'));
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const ProposalsPage = lazy(() => import('../pages/admin/ProposalsPage'));
const ProposalEditorPage = lazy(() => import('../pages/admin/ProposalEditorPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">Cargando...</span>
      </div>
    </div>
  );
}

function DocumentTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const titleMap = {
      '/': 'mnü marketing | Agencia de Marketing Estratégico en Chihuahua, México',
      '/empresarial': 'Agencia de Marketing Empresarial en México | mnü marketing',
      '/gastronomico': 'Marketing para Restaurantes y Marcas de Alimentos | mnü marketing',
      '/inmobiliario': 'Agencia de Marketing Inmobiliario en México | mnü marketing',
      '/cotizacion/empresa': 'Cotización Empresarial | mnü marketing',
      '/admin/login': 'Acceso Administrativo | mnü marketing',
      '/admin/cotizaciones': 'Cotizaciones | mnü marketing',
    };

    if (titleMap[pathname]) {
      document.title = titleMap[pathname];
    } else if (pathname.startsWith('/admin/cotizaciones/')) {
      document.title = 'Editor de Cotización | mnü marketing';
    } else if (pathname.startsWith('/cotizacion/')) {
      document.title = 'Propuesta Comercial | mnü marketing';
    } else {
      document.title = '404 - Página no encontrada | mnü marketing';
    }
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <AuthProvider><BrowserRouter>
      <DocumentTitleManager />
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ═══════════ PUBLIC MARKETING SITE ═══════════ */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="empresarial" element={<EmpresarialPage />} />
            <Route path="gastronomico" element={<GastronomicoPage />} />
            <Route path="inmobiliario" element={<InmobiliarioPage />} />
            {/* Specific static route declared before dynamic /cotizacion/:slug */}
            <Route path="cotizacion/empresa" element={<CotizacionEmpresa />} />
          </Route>

          {/* ═══════════ DYNAMIC PROPOSAL VIEW ═══════════ */}
          <Route element={<ProposalLayout />}>
            <Route path="cotizacion/:slug" element={<PublicProposalPage />} />
          </Route>

          {/* ═══════════ ADMIN PANEL (PROVISIONAL) ═══════════ */}
          <Route path="admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route path="cotizaciones" element={<ProposalsPage />} />
              <Route path="cotizaciones/nueva" element={<ProposalEditorPage />} />
              <Route path="cotizaciones/:id/editar" element={<ProposalEditorPage />} />
            </Route>
          </Route>

          {/* ═══════════ 404 NOT FOUND ═══════════ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter></AuthProvider>
  );
}
