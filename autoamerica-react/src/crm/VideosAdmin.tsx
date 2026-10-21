import { useEffect, useState } from 'react';
import { Film, LoaderCircle, Play, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { api } from './api';
import type { CatalogRecord } from '../catalog';

export default function VideosAdmin({ records, videos, onChange }: {
  records: CatalogRecord[];
  videos: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => { setDrafts({ ...videos }); }, [videos]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 4000); return () => window.clearTimeout(timer); }, [notice]);

  const sorted = [...records].sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name, 'es') : a.kind === 'new' ? -1 : 1));

  async function persist(record: CatalogRecord, url: string) {
    setSaving(record.id);
    setError('');
    try {
      const result = await api.saveVideo(record.id, url);
      const next = { ...videos };
      if (result.url) next[record.id] = result.url; else delete next[record.id];
      onChange(next);
      setNotice(result.url ? `Video guardado para ${record.name}.` : `Se quitó el video de ${record.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el video.');
    } finally {
      setSaving(null);
    }
  }

  function save(record: CatalogRecord) {
    const url = (drafts[record.id] ?? videos[record.id] ?? '').trim();
    if (url && !/^https?:\/\//i.test(url)) { setError('La URL debe empezar por http:// o https://'); return; }
    persist(record, url);
  }

  function remove(record: CatalogRecord) {
    setDrafts(previous => ({ ...previous, [record.id]: '' }));
    persist(record, '');
  }

  async function reset() {
    setSaving('*');
    setError('');
    try {
      const map = await api.resetVideos();
      onChange(map);
      setNotice('Videos restablecidos a los valores iniciales.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer.');
    } finally {
      setSaving(null);
    }
  }

  return <section className="crm-videos">
    <header className="crm-section-head">
      <div>
        <span className="crm-eyebrow">CONTENIDO AUDIOVISUAL</span>
        <h1>Videos cinematográficos</h1>
        <p>Pega la URL del video oficial de cada vehículo. Se reproduce dentro del sitio, sin copiar archivos.</p>
      </div>
      <button className="crm-btn quiet" onClick={reset} disabled={saving === '*'}>
        {saving === '*' ? <LoaderCircle className="crm-spin" size={15} /> : <RotateCcw size={15} />} Restablecer videos
      </button>
    </header>
    {error && <div className="crm-alert" role="alert">{error}</div>}
    {notice && <div className="crm-notice" role="status">{notice}</div>}
    <div className="crm-video-list">
      {sorted.map(record => {
        const value = drafts[record.id] ?? '';
        const saved = videos[record.id];
        const dirty = value.trim() !== (saved || '');
        return <article className="crm-video-row" key={record.id}>
          <div className="crm-video-name">
            <Film size={16} />
            <div>
              <strong>{record.name}</strong>
              <span>{record.kind === 'new' ? 'Nuevo' : 'Usado'} · {saved ? 'Con video' : 'Sin video'}</span>
            </div>
          </div>
          <input
            className="crm-video-url"
            value={value}
            onChange={event => setDrafts(previous => ({ ...previous, [record.id]: event.target.value }))}
            placeholder="https://…/video.mp4"
            aria-label={`URL de video para ${record.name}`}
          />
          <div className="crm-video-actions">
            {saved && <button className="crm-btn quiet small" onClick={() => setPreview({ name: record.name, url: saved })} aria-label={`Probar video de ${record.name}`}><Play size={14} /></button>}
            <button className="crm-btn primary small" onClick={() => save(record)} disabled={saving === record.id || !dirty}>
              {saving === record.id ? <LoaderCircle className="crm-spin" size={14} /> : <Save size={14} />} Guardar
            </button>
            {saved && <button className="crm-btn quiet small" onClick={() => remove(record)} disabled={saving === record.id} aria-label={`Quitar video de ${record.name}`}><Trash2 size={14} /></button>}
          </div>
        </article>;
      })}
    </div>
    {preview && <div className="crm-preview-backdrop" onClick={() => setPreview(null)}>
      <div className="crm-preview-box" onClick={event => event.stopPropagation()}>
        <div className="crm-preview-head"><strong>{preview.name}</strong><button className="crm-btn quiet small" onClick={() => setPreview(null)} aria-label="Cerrar vista previa"><X size={15} /></button></div>
        <video src={preview.url} controls autoPlay playsInline key={preview.url} />
      </div>
    </div>}
  </section>;
}
