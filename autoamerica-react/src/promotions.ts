export type Promotion = {
  id: string;
  title: string;
  text: string;
  badge: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  expires: string;
  active: boolean;
  sort: number;
};

export const createPromotionId = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16)).join('-');

export const sortPromotions = (items: Promotion[]) =>
  [...items].sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title, 'es'));
