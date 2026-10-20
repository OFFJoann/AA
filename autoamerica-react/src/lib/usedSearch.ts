import type { UsedVehicle } from '../catalog.ts';

/** Business rules have no React dependency, so they can be tested independently. */
export const facetKeys = ['brand', 'model', 'transmission', 'power', 'bodyType', 'location'] as const;
export type Facet = typeof facetKeys[number];
export const rangeKeys = ['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax'] as const;
export type RangeKey = typeof rangeKeys[number];
export type SortOrder = 'relevance' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';
export type UsedFilters = Record<Facet, string[]> & Record<RangeKey, string> & {
  query: string; certified: boolean; favorites: boolean; sort: SortOrder;
};
export const emptyFilters = (): UsedFilters => ({
  brand: [], model: [], transmission: [], power: [], bodyType: [], location: [],
  query: '', priceMin: '', priceMax: '', yearMin: '', yearMax: '', mileageMin: '', mileageMax: '',
  certified: false, favorites: false, sort: 'relevance',
});
export function normalize(value: unknown): string {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
export function valueFor(vehicle: UsedVehicle, key: Facet): string {
  const value = String(vehicle[key] || '').trim();
  if (!value || /^(por confirmar|sin dato|desconocido)$/i.test(value)) return 'Por confirmar';
  if (key === 'transmission') {
    if (/mecanica|manual/.test(normalize(value))) return 'Manual';
    if (/automatic|\bat\b/.test(normalize(value))) return 'Automática';
    if (/cvt/.test(normalize(value))) return 'CVT';
  }
  return value;
}
export function rangeError(filters: UsedFilters): string {
  for (const [min, max, label] of [
    ['priceMin','priceMax','precio'], ['yearMin','yearMax','año'], ['mileageMin','mileageMax','kilometraje'],
  ] as const) {
    for (const key of [min,max]) {
      if (filters[key] && (!/^\d+$/.test(filters[key]) || !Number.isSafeInteger(Number(filters[key]))))
        return `Revisa el ${label}: utiliza números enteros positivos.`;
    }
    if (filters[min] !== '' && filters[max] !== '' && Number(filters[min]) > Number(filters[max]))
      return `El mínimo de ${label} no puede superar el máximo.`;
  }
  return '';
}
function within(value: number | undefined, min: string, max: string, minimum: number): boolean {
  if (!min && !max) return true;
  if (value === undefined || !Number.isFinite(value) || value < minimum) return false;
  return (!min || value >= Number(min)) && (!max || value <= Number(max));
}
export function matches(vehicle: UsedVehicle, filters: UsedFilters, saved: string[] = [], exclude?: Facet): boolean {
  if (rangeError(filters)) return false;
  const text = normalize([vehicle.name, vehicle.brand, vehicle.model, vehicle.year, vehicle.location].join(' '));
  if (!normalize(filters.query).split(/\s+/).every(word => text.includes(word))) return false;
  if (!facetKeys.every(key => key === exclude || !filters[key].length || filters[key].some(option => normalize(option) === normalize(valueFor(vehicle,key))))) return false;
  return within(vehicle.price, filters.priceMin, filters.priceMax, 1)
    && within(vehicle.year, filters.yearMin, filters.yearMax, 1)
    && within(vehicle.mileage, filters.mileageMin, filters.mileageMax, 0)
    && (!filters.certified || vehicle.certified === true)
    && (!filters.favorites || saved.includes(vehicle.id));
}
export function searchUsed(items: UsedVehicle[], filters: UsedFilters, saved: string[] = []): UsedVehicle[] {
  return items.filter(item => matches(item, filters, saved)).sort((a,b) => {
    if (filters.sort === 'relevance') return 0;
    const key = filters.sort.startsWith('price') ? 'price' : filters.sort === 'year-desc' ? 'year' : 'mileage';
    const valid = (x: number) => Number.isFinite(x) && (key === 'mileage' ? x >= 0 : x > 0);
    if (!valid(a[key])) return valid(b[key]) ? 1 : 0;
    if (!valid(b[key])) return -1;
    return (a[key] - b[key]) * (filters.sort.endsWith('desc') ? -1 : 1);
  });
}
export function facetOptions(items: UsedVehicle[], filters: UsedFilters, key: Facet, saved: string[] = []) {
  // Model options depend on the selected brands. Counts ignore only their own facet.
  const pool = key === 'model' && filters.brand.length
    ? items.filter(item => filters.brand.some(brand => normalize(brand) === normalize(valueFor(item,'brand')))) : items;
  const labels = new Map<string,string>();
  for (const item of pool) { const label = valueFor(item,key); labels.set(normalize(label),label); }
  for (const label of filters[key]) if (!labels.has(normalize(label))) labels.set(normalize(label),label);
  return [...labels.values()].sort((a,b)=>a.localeCompare(b,'es')).map(label=>({
    label, count: pool.filter(item => normalize(valueFor(item,key)) === normalize(label) && matches(item,filters,saved,key)).length,
  }));
}
export function readUsedFilters(search: string): UsedFilters {
  const params = new URLSearchParams(search); const filters = emptyFilters();
  filters.query = (params.get('u_q') || '').slice(0,120);
  for (const key of facetKeys) filters[key] = [...new Set(params.getAll('u_'+key).map(v=>v.slice(0,100)))].slice(0,20);
  for (const key of rangeKeys) { const value = params.get('u_'+key) || ''; filters[key] = /^\d{1,15}$/.test(value) ? value : ''; }
  filters.certified = params.get('u_certified') === '1';
  filters.favorites = params.get('u_favorites') === '1';
  const sort = params.get('u_sort');
  if (['price-asc','price-desc','year-desc','mileage-asc'].includes(sort || '')) filters.sort = sort as SortOrder;
  return filters;
}
export function writeUsedFilters(search: string, filters: UsedFilters): string {
  const params = new URLSearchParams(search);
  for (const key of [...params.keys()]) if (key.startsWith('u_')) params.delete(key);
  if (filters.query) params.set('u_q',filters.query);
  for (const key of facetKeys) for (const value of filters[key]) params.append('u_'+key,value);
  for (const key of rangeKeys) if (filters[key]) params.set('u_'+key,filters[key]);
  if (filters.sort !== 'relevance') params.set('u_sort',filters.sort);
  if (filters.certified) params.set('u_certified','1');
  if (filters.favorites) params.set('u_favorites','1');
  return params.toString();
}
export function toggleFacet(filters: UsedFilters, key: Facet, value: string): UsedFilters {
  const next = {...filters, [key]: filters[key].includes(value) ? filters[key].filter(item=>item!==value) : [...filters[key],value]};
  if (key === 'brand') next.model = []; // Never retain an incompatible model when changing brands.
  return next;
}
