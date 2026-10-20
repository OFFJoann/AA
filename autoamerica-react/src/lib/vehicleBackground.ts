/** Media policy shared by the UI and tests. A web page URL is NOT a video URL. */
export type VideoReview = {
  modelId: string; src: string; mime: 'video/mp4' | 'video/webm';
  sourcePage: string; market: 'CO'; modelYear: number; variant: string;
  reviewedBy: string; reviewedAt: string; approvalReference: string;
  approved: true; matchesColombia: true;
};
const modelIds = new Set(['prado', 'hilux', 'corolla-cross', 'rav4', 'yaris-cross']);
export function modelKey(id: string, origin?: string): string | undefined {
  if (origin === 'marketing') return undefined;
  const key = id.replace(/^new:/, '');
  return modelIds.has(key) ? key : undefined;
}
export function officialToyotaPage(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password &&
      !u.port && ['toyota.com', 'www.toyota.com', 'toyota.com.co',
      'www.toyota.com.co', 'www.sales.toyota.com.co'].includes(u.hostname);
  } catch { return false; }
}
export function localVideoPath(value: unknown): value is string {
  return typeof value === 'string' && /^\/media\/videos\/[a-z0-9][a-z0-9-]*\.(mp4|webm)$/.test(value);
}
/** Documentary review is supplied by the team; this is NOT visual recognition. */
export function approvedVideo(input: unknown, id: string, origin?: string, variant?: string): VideoReview | undefined {
  const key = modelKey(id, origin);
  if (!key || !input || typeof input !== 'object') return undefined;
  const v = input as Record<string, unknown>;
  if (v.modelId !== key || v.approved !== true || v.matchesColombia !== true || v.market !== 'CO' ||
      !localVideoPath(v.src) || !officialToyotaPage(v.sourcePage) ||
      !['video/mp4', 'video/webm'].includes(String(v.mime)) ||
      !Number.isInteger(v.modelYear) || Number(v.modelYear) < 2000 || Number(v.modelYear) > 2100) return undefined;
  if ((String(v.src).endsWith('.mp4') ? 'video/mp4' : 'video/webm') !== v.mime) return undefined;
  for (const field of ['variant', 'reviewedBy', 'reviewedAt', 'approvalReference']) {
    if (typeof v[field] !== 'string' || !(v[field] as string).trim()) return undefined;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v.reviewedAt)) || !Number.isFinite(Date.parse(String(v.reviewedAt))) || new Date(String(v.reviewedAt)).toISOString().slice(0, 10) !== v.reviewedAt) return undefined;
  if (variant && v.variant !== variant) return undefined;
  return input as VideoReview;
}
export type MotionConditions = { reduced: boolean; compact: boolean; saveData: boolean; hidden: boolean; visible: boolean; paused: boolean; blocked: boolean };
export function allowBackgroundMotion(c: MotionConditions): boolean {
  return !c.reduced && !c.compact && !c.saveData && !c.hidden && c.visible && !c.paused && !c.blocked;
}
