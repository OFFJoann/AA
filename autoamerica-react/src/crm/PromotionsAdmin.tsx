import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, CalendarClock, Eye, EyeOff, ImagePlus, LoaderCircle, Megaphone, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { api } from './api';
import { createPromotionId, sortPromotions } from '../promotions';
import type { Promotion } from '../promotions';

export default function PromotionsAdmin({ promotions, onChange }: {
  promotions: Promotion[];
  onChange: (list: Promotion[]) => void;
}) {
  const [draft, setDraft] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const file = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const sorted = sortPromotions(promotions);
  const existing = !!draft && promotions.some(item => item.id === draft.id);

  useEffect(() => { if (draft) titleRef.current?.focus(); }, [draft?.id]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 4500); return () => window.clearTimeout(timer); }, [notice]);

  const update = <K extends keyof Promotion>(key: K, value: Promotion[K]) =>
    setDraft(previous => previous ? { ...previous, [key]: value } : previous);

  function create() {
    setError('');
    setDraft({
      id: createPromotionId(), title: '', text: '', badge: '', image: '',
      ctaLabel: 'Conocer más', ctaUrl: '/nuevos', expires: '', active: true,
      sort: sorted.length ? Math.max(...sorted.map(item => item.sort)) + 1 : 1,
    });
  }

  function edit(promotion: Promotion) { setError(''); setDraft({ ...promotion }); }

  function upload(selected: File | undefined) {
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) { setError('Elige una imagen JPG, PNG o WebP.'); return; }
    if (selected.size > 5 * 1024 * 1024) { setError('La imagen supera 5 MB. Usa una versión optimizada.'); return; }
    setError('');
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') update('image', reader.result); setReading(false); };
    reader.onerror = () => { setError('No fue posible leer la imagen. Inténtalo con otro archivo.'); setReading(false); };
    reader.readAsDataURL(selected);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const payload: Promotion = {
      ...draft,
      title: draft.title.trim(),
      text: draft.text.trim(),
      badge: draft.badge.trim(),
      ctaLabel: draft.ctaLabel.trim(),
      ctaUrl: draft.ctaUrl.trim(),
      expires: draft.expires.trim(),
      sort: Number(draft.sort) || 0,
    };
    if (!payload.title) { setError('El título es obligatorio.'); return; }
    if (payload.title.length > 120) { setError('El título no puede superar 120 caracteres.'); return; }
    if (payload.ctaUrl && !/^https?:\/\//i.test(payload.ctaUrl) && !payload.ctaUrl.startsWith('/')) {
      setError('El enlace debe ser una URL http(s) o una ruta interna que empiece por /.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const saved = await api.savePromotion(payload, existing);
      const next = sortPromotions(existing ? promotions.map(item => item.id === saved.id ? saved : item) : [...promotions, saved]);
      onChange(next);
      setDraft(null);
      setNotice(saved.active ? `Promoción “${saved.title}” publicada en el sitio.` : `Promoción “${saved.title}” guardada como oculta.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la promoción.');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(promotion: Promotion) {
    setSaving(true);
    setError('');
    try {
      const saved = await api.savePromotion({ ...promotion, active: !promotion.active }, true);
      onChange(promotions.map(item => item.id === saved.id ? saved : item));
      setNotice(saved.active ? `“${saved.title}” ya se muestra en el inicio.` : `“${saved.title}” se ocultó del inicio.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la promoción.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(promotion: Promotion) {
    if (!window.confirm(`¿Eliminar la promoción “${promotion.title}”? Esta acción no se puede deshacer.`)) return;
    setSaving(true);
    setError('');
    try {
      await api.deletePromotion(promotion.id);
      onChange(promotions.filter(item => item.id !== promotion.id));
      if (draft?.id === promotion.id) setDraft(null);
      setNotice(`Promoción “${promotion.title}” eliminada.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la promoción.');
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm('Se reemplazarán las promociones actuales por las tres campañas iniciales. ¿Continuar?')) return;
    setSaving(true);
    setError('');
    try {
      const list = await api.resetPromotions();
      onChange(list);
      setDraft(null);
      setNotice('Promociones restablecidas a los valores iniciales.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer.');
    } finally {
      setSaving(false);
    }
  }

  if (draft) {
    const linkReady = /^https?:\/\//i.test(draft.ctaUrl.trim()) || draft.ctaUrl.trim().startsWith('/');
    return <section className="crm-promos">
      <header className="crm-section-head">
        <div>
          <span className="crm-eyebrow">CAMPAÑAS DEL SITIO</span>
          <h1>{existing ? 'Editar promoción' : 'Nueva promoción'}</h1>
          <p>Lo que guardes aquí aparece en la sección “Promociones” del inicio, al instante.</p>
        </div>
        <button type="button" className="crm-btn quiet" onClick={() => setDraft(null)} disabled={saving}><X size={15} /> Cerrar</button>
      </header>
      {error && <div className="crm-alert" role="alert">{error}</div>}
      <form className="crm-promo-form" onSubmit={save}>
        <div className="crm-form-grid">
          <label className="crm-field">Título
            <input ref={titleRef} value={draft.title} onChange={event => update('title', event.target.value)} maxLength={120} required placeholder="Bono de bienvenida" />
          </label>
          <label className="crm-field">Etiqueta destacada
            <input value={draft.badge} onChange={event => update('badge', event.target.value)} maxLength={40} placeholder="Hasta $2.000.000" />
            <small>Texto corto sobre la imagen o el título. Opcional.</small>
          </label>
        </div>
        <label className="crm-field">Descripción
          <textarea value={draft.text} onChange={event => update('text', event.target.value)} maxLength={800} rows={3} placeholder="Explica el beneficio en una o dos frases." />
        </label>
        <div className="crm-form-grid">
          <label className="crm-field">Texto del botón
            <input value={draft.ctaLabel} onChange={event => update('ctaLabel', event.target.value)} maxLength={40} placeholder="Ver modelos nuevos" />
          </label>
          <label className="crm-field">Enlace del botón
            <input value={draft.ctaUrl} onChange={event => update('ctaUrl', event.target.value)} placeholder="/nuevos o https://…" />
            <small>Ruta interna (ej. /nuevos, /posventa) o URL completa.</small>
          </label>
        </div>
        <div className="crm-form-grid">
          <label className="crm-field">Vigencia
            <input value={draft.expires} onChange={event => update('expires', event.target.value)} maxLength={90} placeholder="Vigente hasta el 31 de diciembre de 2026" />
          </label>
          <label className="crm-field">Orden
            <input type="number" min={0} max={999} value={draft.sort} onChange={event => update('sort', Number(event.target.value) || 0)} />
            <small>Menor número aparece primero.</small>
          </label>
        </div>
        <div className="crm-promo-image">
          <div className="crm-promo-image-preview">
            {draft.image ? <img src={draft.image} alt="" /> : <ImagePlus size={26} />}
          </div>
          <div className="crm-promo-image-actions">
            <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { upload(event.target.files?.[0]); event.target.value = ''; }} />
            <button type="button" className="crm-btn quiet small" onClick={() => file.current?.click()} disabled={reading || saving}>
              {reading ? <LoaderCircle className="crm-spin" size={14} /> : <ImagePlus size={14} />} {draft.image ? 'Cambiar imagen' : 'Cargar imagen'}
            </button>
            {draft.image && <button type="button" className="crm-btn quiet small" onClick={() => update('image', '')} disabled={saving}><Trash2 size={14} /> Quitar imagen</button>}
            <small>JPG, PNG o WebP · máximo 5 MB. Opcional: sin imagen, la tarjeta muestra solo el texto.</small>
          </div>
        </div>
        <label className="crm-checkbox">
          <input type="checkbox" checked={draft.active} onChange={event => update('active', event.target.checked)} />
          Mostrar esta promoción en el inicio del sitio
        </label>
        {linkReady && draft.ctaUrl.trim() && <a className="crm-btn quiet small crm-promo-link" href={draft.ctaUrl.trim()} target="_blank" rel="noreferrer"><ArrowUpRight size={14} /> Probar enlace</a>}
        <div className="crm-form-actions">
          <button className="crm-btn primary" type="submit" disabled={saving || reading}>
            {saving ? <LoaderCircle className="crm-spin" size={15} /> : <Save size={15} />} Guardar promoción
          </button>
          <button className="crm-btn quiet" type="button" onClick={() => setDraft(null)} disabled={saving}>Cancelar</button>
          {existing && <button className="crm-btn quiet" type="button" onClick={() => remove(draft)} disabled={saving}><Trash2 size={15} /> Eliminar</button>}
        </div>
      </form>
    </section>;
  }

  return <section className="crm-promos">
    <header className="crm-section-head">
      <div>
        <span className="crm-eyebrow">CAMPAÑAS DEL SITIO</span>
        <h1>Promociones</h1>
        <p>Crea campañas con imagen, texto y botón. Las activas aparecen en la sección “Promociones” del inicio.</p>
      </div>
      <div className="crm-promo-toolbar">
        <button className="crm-btn quiet" onClick={reset} disabled={saving}><RotateCcw size={15} /> Restablecer</button>
        <button className="crm-btn primary" onClick={create} disabled={saving}><Plus size={15} /> Nueva promoción</button>
      </div>
    </header>
    {error && <div className="crm-alert" role="alert">{error}</div>}
    {notice && <div className="crm-notice" role="status">{notice}</div>}
    {sorted.length === 0
      ? <div className="crm-promo-empty"><Megaphone size={26} /><strong>Aún no hay promociones</strong><p>Crea la primera campaña y aparecerá en el inicio del sitio.</p><button className="crm-btn primary" onClick={create}><Plus size={15} /> Crear promoción</button></div>
      : <div className="crm-promo-list">
        {sorted.map(promotion => <article className={'crm-promo-card' + (promotion.active ? '' : ' inactive')} key={promotion.id}>
          <div className="crm-promo-thumb">{promotion.image ? <img src={promotion.image} alt="" loading="lazy" /> : <Megaphone size={26} />}</div>
          <div className="crm-promo-info">
            {promotion.badge && <span className="crm-promo-badge">{promotion.badge}</span>}
            <strong>{promotion.title}</strong>
            {promotion.text && <p>{promotion.text}</p>}
            {promotion.expires && <span className="crm-promo-meta"><CalendarClock size={12} /> {promotion.expires}</span>}
          </div>
          <div className="crm-promo-actions">
            <button className="crm-btn primary small" onClick={() => edit(promotion)} disabled={saving}><Pencil size={13} /> Editar</button>
            <button className="crm-btn quiet small" onClick={() => toggle(promotion)} disabled={saving}>
              {promotion.active ? <><EyeOff size={13} /> Ocultar</> : <><Eye size={13} /> Mostrar</>}
            </button>
            <button className="crm-btn quiet small" onClick={() => remove(promotion)} disabled={saving} aria-label={`Eliminar ${promotion.title}`}><Trash2 size={13} /></button>
          </div>
        </article>)}
      </div>}
  </section>;
}
