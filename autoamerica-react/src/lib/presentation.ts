export const formatMoney = (value?: number) => value && value > 0
  ? new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value)
  : 'Consultar precio';
export const formatNumber = (value: number) => new Intl.NumberFormat('es-CO').format(value);
export function safeExternalUrl(value?: string, fallback = 'https://autoamerica.com.co/contacto/') {
  try { const url = new URL(value || ''); return url.protocol === 'https:' ? url.href : fallback; }
  catch { return fallback; }
}
/** These three images were not acceptable as photographs of the announced model/unit. */
export const quarantinedImages = ['/assets/rav4.webp','/assets/used-rav4.webp','/assets/used-fortuner.webp'];
export function safeImage(value?: string): string {
  if (!value || quarantinedImages.includes(value)) return '';
  if (/^\/assets\/[\w./-]+$/.test(value) && !value.includes('..')) return value;
  if (/^data:image\/(png|jpeg|webp);base64,/i.test(value)) return value;
  if (/^https:\/\//i.test(value)) return value;
  return '';
}
