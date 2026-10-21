import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Film, LayoutDashboard, LoaderCircle, LogOut, Megaphone, RotateCcw } from 'lucide-react';
import AdminCMS from '../components/AdminCMS';
import VideosAdmin from './VideosAdmin';
import PromotionsAdmin from './PromotionsAdmin';
import CrmLogin from './CrmLogin';
import { api, ApiError } from './api';
import type { CrmUser } from './api';
import type { Promotion } from '../promotions';
import { setVehicleVideoUrls } from '../lib/vehicleVideos';
import { navigate } from '../navigation/SiteNavigation';
import type { CatalogRecord } from '../catalog';
import './crm.css';

type Tab = 'catalog' | 'videos' | 'promotions';

export default function CrmApp() {
  const [user, setUser] = useState<CrmUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>('catalog');
  const [records, setRecords] = useState<CatalogRecord[]>([]);
  const [videos, setVideos] = useState<Record<string, string>>({});
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.session()
      .then(({ user: sessionUser }) => setUser(sessionUser))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  const handleAuthError = useCallback((err: unknown) => {
    if (err instanceof ApiError && err.status === 401) { setUser(null); return true; }
    return false;
  }, []);

  useEffect(() => {
    if (!user) return;
    setError('');
    Promise.all([api.catalog(), api.videos(), api.promotions(true)])
      .then(([catalog, videoMap, promotionList]) => {
        setRecords(catalog);
        setVideos(videoMap);
        setPromotions(promotionList);
        setVehicleVideoUrls(videoMap);
      })
      .catch(err => { if (!handleAuthError(err)) setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido.'); });
  }, [user, handleAuthError]);

  async function saveRecord(record: CatalogRecord) {
    const exists = records.some(item => item.id === record.id);
    try {
      const saved = await api.saveCatalog(record, exists);
      const next = exists ? records.map(item => item.id === saved.id ? saved : item) : [...records, saved];
      setRecords(next);
      window.dispatchEvent(new CustomEvent('aa:crm-catalog', { detail: next }));
    } catch (err) {
      if (!handleAuthError(err)) setError(err instanceof Error ? err.message : 'No se pudo guardar el vehículo.');
    }
  }

  async function resetRecords() {
    try {
      const fresh = await api.resetCatalog();
      setRecords(fresh);
      window.dispatchEvent(new CustomEvent('aa:crm-catalog', { detail: fresh }));
      const videoMap = await api.videos();
      setVideos(videoMap);
      setVehicleVideoUrls(videoMap);
    } catch (err) {
      if (!handleAuthError(err)) setError(err instanceof Error ? err.message : 'No se pudo restablecer el catálogo.');
    }
  }

  function changePromotions(list: Promotion[]) {
    setPromotions(list);
    window.dispatchEvent(new CustomEvent('aa:crm-promotions', { detail: list }));
  }

  async function logout() {
    try { await api.logout(); } finally { setUser(null); }
  }

  if (checking) return <div className="crm-splash"><LoaderCircle className="crm-spin" size={26} /> Verificando sesión…</div>;
  if (!user) return <CrmLogin onLogin={setUser} />;

  return <div className="crm-shell">
    <header className="crm-topbar">
      <div className="crm-brand"><img src="/assets/logo-autoamerica.png" alt="Autoamérica"/><span className="crm-brand-divider"/><span className="crm-brand-label">CRM</span></div>
      <nav className="crm-tabs" aria-label="Secciones del CRM">
        <button className={tab === 'catalog' ? 'active' : ''} onClick={() => setTab('catalog')}><LayoutDashboard size={16} /> Catálogo</button>
        <button className={tab === 'videos' ? 'active' : ''} onClick={() => setTab('videos')}><Film size={16} /> Videos</button>
        <button className={tab === 'promotions' ? 'active' : ''} onClick={() => setTab('promotions')}><Megaphone size={16} /> Promociones</button>
      </nav>
      <div className="crm-user">
        <span title={user.email}>{user.email}</span>
        <button className="crm-btn quiet small" onClick={() => navigate('/')}><ExternalLink size={14} /> Ver sitio</button>
        <button className="crm-btn quiet small" onClick={logout}><LogOut size={14} /> Salir</button>
      </div>
    </header>
    <div className="crm-body">
      {error && <div className="crm-alert" role="alert">{error}</div>}
      {tab === 'catalog'
        ? <AdminCMS embedded records={records} onSave={saveRecord} onReset={resetRecords} onOpenSite={() => navigate('/')} />
        : tab === 'videos'
          ? <VideosAdmin records={records} videos={videos} onChange={map => { setVideos(map); setVehicleVideoUrls(map); }} />
          : <PromotionsAdmin promotions={promotions} onChange={changePromotions} />}
    </div>
    <footer className="crm-footer">
      <span><RotateCcw size={12} /> Los cambios se guardan en la base de datos del servidor (SQLite) y son visibles para todos los visitantes.</span>
    </footer>
  </div>;
}
