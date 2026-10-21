import type { CatalogRecord } from '../catalog';

export type CrmUser = { id: number; email: string; name: string; role: string };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data.error === 'string' ? data.error : 'No se pudo conectar con el servidor.';
    throw new ApiError(message, response.status);
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: CrmUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
  session: () => request<{ user: CrmUser }>('/auth/session'),
  catalog: () => request<CatalogRecord[]>('/catalog'),
  saveCatalog: (record: CatalogRecord, exists: boolean) =>
    exists
      ? request<CatalogRecord>(`/catalog/${encodeURIComponent(record.id)}`, { method: 'PUT', body: JSON.stringify(record) })
      : request<CatalogRecord>('/catalog', { method: 'POST', body: JSON.stringify(record) }),
  resetCatalog: () => request<CatalogRecord[]>('/catalog/reset', { method: 'POST' }),
  videos: () => request<Record<string, string>>('/videos'),
  saveVideo: (id: string, url: string) =>
    request<{ id: string; url: string }>(`/videos/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ url }) }),
  resetVideos: () => request<Record<string, string>>('/videos/reset', { method: 'POST' }),
};
