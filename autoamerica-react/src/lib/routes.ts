/** Pure route parsing; no browser globals. Application is hosted at domain root. */
export type Page = 'home' | 'new' | 'used' | 'aftersales' | 'parts' | 'locations' | 'vehicle' | 'not-found';
export type SiteRoute = { page: Page; path: string; vehicleId?: string };
const models = new Set(['prado','hilux','corolla-cross','rav4','yaris-cross']);
const legacy: Record<string,string> = {inicio:'/',modelos:'/nuevos',usados:'/usados',servicios:'/posventa',repuestos:'/posventa/repuestos',sedes:'/sedes'};
export function vehiclePath(id: string): string {
  const slug = id.startsWith('new:') ? id.slice(4) : id;
  return `/nuevos/${encodeURIComponent(models.has(slug) ? slug : id)}`;
}
export function canonicalLocation(input: string, origin = 'https://autoamerica.example'): string {
  const url = new URL(input,origin);
  if (url.origin !== new URL(origin).origin) throw new Error('External navigation is not an internal route');
  const hash = url.hash.slice(1);
  if (legacy[hash]) {url.pathname=legacy[hash];url.hash='';}
  else if(hash.startsWith('vehiculo/')) {
    try {url.pathname=vehiclePath(decodeURIComponent(hash.slice(9)));url.hash='';} catch { /* Not-found handled below. */ }
  }
  if(url.pathname.length>1) url.pathname=url.pathname.replace(/\/+$/,'');
  return url.pathname+url.search+url.hash;
}
export function resolveRoute(path: string): SiteRoute {
  const clean=path.replace(/\/+$/,'')||'/';
  const routes:Record<string,Page>={'/':'home','/nuevos':'new','/usados':'used','/posventa':'aftersales','/posventa/repuestos':'parts','/sedes':'locations'};
  if(routes[clean]) return {page:routes[clean],path:clean};
  const match=clean.match(/^\/nuevos\/([^/]+)$/);
  if(match) {try {
    const slug=decodeURIComponent(match[1]);
    if(!slug || /[\\/\x00-\x1f]/.test(slug)) return {page:'not-found',path:clean};
    return {page:'vehicle',path:clean,vehicleId:models.has(slug)?`new:${slug}`:slug};
  } catch { /* Malformed percent encoding is never a crash. */ }}
  return {page:'not-found',path:clean};
}
export function pageTitle(route: SiteRoute): string {
  const names: Record<Page,string> = {home:'Elige tu siguiente camino',new:'Vehículos nuevos',used:'Usados multimarca',aftersales:'Posventa Toyota',parts:'Repuestos y explorador 3D',locations:'Sedes y horarios',vehicle:'Conoce tu Toyota','not-found':'Página no encontrada'};
  return `${names[route.page]} | Autoamérica`;
}
