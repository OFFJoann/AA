import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, ChevronRight, Copy, Eye, FileEdit, ImagePlus, LayoutDashboard, LoaderCircle, Package, Plus, RotateCcw, Search, Send, Settings2, ShieldCheck, Upload, X } from 'lucide-react';
import type { CatalogKind, CatalogRecord } from '../catalog';
import './AdminCMS.css';
import EditorTour from './EditorTour';

interface AdminCMSProps {
  records: CatalogRecord[];
  onSave: (record: CatalogRecord) => void;
  onReset: () => void;
  onOpenSite: (kind?: CatalogKind) => void;
}
const images = [
  ['prado.webp', 'Land Cruiser Prado'], ['corolla-cross.webp', 'Corolla Cross'], ['hilux.webp', 'Hilux'],
  ['photo-pending.svg', 'Fotografía pendiente'], ['yaris-cross.webp', 'Yaris Cross'], ['used-corolla.webp', 'Usado · Corolla'],
    ['used-yaris.webp', 'Usado · Yaris'],
];
const statusLabels = { draft: 'Borrador', published: 'Publicado', withdrawn: 'Retirado' };
const availabilityLabels = { confirm: 'Por confirmar', available: 'Disponible', reserved: 'Reservado', sold: 'Vendido' };
const money = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
const createRecordId = () => typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16)).join('-');
const emptyRecord = (kind: CatalogKind): CatalogRecord => ({ id: createRecordId(), kind, brand: kind === 'new' ? 'Toyota' : '', model: '', status: 'draft', name: '', category: '', power: '', year: 0, price: 0, mileage: kind === 'used' ? -1 : 0, transmission: '', location: '', image: '', description: '', tag: 'Unidad de demostración', url: '', availability: 'confirm', origin: 'marketing' });

export default function AdminCMS({ records, onSave, onReset, onOpenSite }: AdminCMSProps) {
  const [kind, setKind] = useState<'all' | CatalogKind>('all');
  const [status, setStatus] = useState<'all' | CatalogRecord['status']>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<CatalogRecord | null>(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [tour, setTour] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const editorTitle = useRef<HTMLHeadingElement>(null);
  const metrics = useMemo(() => ({ published: records.filter(record => record.status === 'published').length, draft: records.filter(record => record.status === 'draft').length, new: records.filter(record => record.kind === 'new').length, used: records.filter(record => record.kind === 'used').length }), [records]);
  const filtered = useMemo(() => records.filter(record => (kind === 'all' || record.kind === kind) && (status === 'all' || record.status === status) && (record.name + ' ' + record.category + ' ' + record.location).toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))), [records, kind, status, query]);
  const editingExisting = !!draft && records.some(record => record.id === draft.id);
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(''), 5000); return () => window.clearTimeout(timer); } }, [toast]);
  useEffect(() => { if (draft && !tour) editorTitle.current?.focus(); }, [draft?.id, tour]);
  useEffect(() => { if (!draft) setTour(false); }, [draft]);
  function startTour() {
    if (!draft) setDraft(records[0] ? { ...records[0] } : emptyRecord('new'));
    setTour(true);
  }

  const update = <K extends keyof CatalogRecord>(key: K, value: CatalogRecord[K]) => setDraft(previous => previous ? { ...previous, [key]: value } : previous);
  const create = (value: CatalogKind) => { setError(''); setDraft(emptyRecord(value)); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const edit = (record: CatalogRecord) => { setError(''); setDraft({ ...record }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const duplicate = (record: CatalogRecord) => { setError(''); setDraft({ ...record, id: createRecordId(), name: record.name + ' · copia', status: 'draft', availability: 'confirm', origin: 'marketing', tag: 'Unidad de demostración' }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const changeStatus = (record: CatalogRecord) => {
    if (record.status !== 'published' && record.availability === 'sold') { setToast('Esta unidad está vendida. Edita su disponibilidad antes de publicarla.'); return; }
    const next = record.status === 'published' ? 'withdrawn' : 'published';
    onSave({ ...record, status: next });
    setToast(next === 'published' ? `${record.name} ya aparece en la propuesta.` : `${record.name} se retiró del catálogo. Puedes volver a publicarlo.`);
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim() || !draft.category.trim() || !draft.power.trim() || !draft.location.trim() || !draft.description.trim()) { setError('Completa nombre, categoría, motorización, sede y descripción.'); return; }
    if (draft.kind === 'used' && (!(draft.brand || '').trim() || !(draft.model || '').trim())) { setError('Completa marca y modelo para que esta unidad pueda encontrarse con los filtros.'); return; }
    if (draft.kind === 'new' && (draft.brand || 'Toyota').trim().toLowerCase() !== 'toyota') { setError('El catálogo de nuevos corresponde a Toyota. Otras marcas se administran como usados.'); return; }
    if (!draft.image) { setError('Selecciona una fotografía o carga una imagen para el vehículo.'); return; }
    if (draft.kind === 'used' && (!(draft.price > 0) || !(draft.year >= 1980) || draft.mileage < 0 || !draft.transmission.trim())) { setError('Para usados, indica un precio mayor que cero, año, kilometraje y transmisión.'); return; }
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.value;
    const state = draft.availability === 'sold' ? 'withdrawn' : intent === 'publish' ? 'published' : intent === 'draft' ? 'draft' : draft.status;
    const saved: CatalogRecord = { ...draft, brand: (draft.brand || '').trim(), model: (draft.model || '').trim(), name: draft.name.trim(), description: draft.description.trim(), category: draft.category.trim(), power: draft.power.trim(), location: draft.location.trim(), status: state, origin: 'marketing', mileage: draft.kind === 'new' ? 0 : draft.mileage };
    onSave(saved);
    setDraft(null);
    setError('');
    setToast(state === 'published' ? 'Vehículo publicado. Ya puedes verlo en el catálogo de esta propuesta.' : state === 'withdrawn' ? 'Vehículo guardado y retirado de la vista pública.' : 'Borrador guardado. Puedes editarlo y publicarlo cuando esté listo.');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const upload = (selected: File | undefined) => {
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) { setError('Elige una imagen JPG, PNG o WebP.'); return; }
    if (selected.size > 5 * 1024 * 1024) { setError('La imagen supera 5 MB. Usa una versión optimizada.'); return; }
    setError(''); setReading(true);
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') update('image', reader.result); setReading(false); };
    reader.onerror = () => { setError('No fue posible leer la imagen. Inténtalo con otro archivo.'); setReading(false); };
    reader.readAsDataURL(selected);
  };

  return <div className="cms-shell">
    <aside className="cms-sidebar">
      <button className="cms-brand" onClick={() => onOpenSite()} aria-label="Volver a la propuesta Autoamérica"><img src="/assets/logo-autoamerica.png" alt="Autoamérica" /><span>ESTUDIO EDITORIAL</span></button>
      <div className="cms-side-label">TU ESPACIO DE TRABAJO</div>
      <button className={'cms-side-link ' + (kind === 'all' ? 'cms-side-active' : '')} onClick={() => { setDraft(null); setKind('all'); }}><LayoutDashboard size={17} /> Todo el catálogo <span>{records.length}</span></button>
      <button className={'cms-side-link ' + (kind === 'new' ? 'cms-side-active' : '')} onClick={() => { setDraft(null); setKind('new'); }}><Package size={17} /> Vehículos nuevos <span>{metrics.new}</span></button>
      <button className={'cms-side-link ' + (kind === 'used' ? 'cms-side-active' : '')} onClick={() => { setDraft(null); setKind('used'); }}><RotateCcw size={17} /> Vehículos usados <span>{metrics.used}</span></button>
      <div className="cms-side-divider" />
      <button className="cms-side-link" onClick={() => onOpenSite(kind === 'all' ? undefined : kind)}><ArrowUpRight size={17} /> Ver sitio web</button>
      <div className="cms-side-bottom"><div className="cms-avatar">M</div><div><strong>Equipo de mercadeo</strong><small>Entorno de demostración</small></div></div>
    </aside>

    <div className="cms-main">
      <header className="cms-topbar"><div className="cms-breadcrumb">Contenido <ChevronRight size={13} /><strong>{draft ? 'Editor de vehículos' : 'Catálogo'}</strong></div><button className="cms-btn cms-btn-quiet" onClick={() => onOpenSite(draft?.kind ?? (kind === 'all' ? undefined : kind))}><Eye size={15} /> Ver propuesta <ArrowUpRight size={13} /></button></header>
      <main className="cms-content">
        <div className="cms-demo-banner"><ShieldCheck size={18} /><div><strong>CMS de demostración</strong><span>Cambios solo en esta pestaña; no modifica el sitio actual.</span></div><span className="cms-demo-dot">DEMO</span></div>
        <div className="cms-tour-invitation"><div><strong>¿Primera vez editando un vehículo?</strong><span>Te acompañamos desde la ficha hasta la publicación.</span></div><button type="button" className="cms-btn cms-btn-secondary" onClick={startTour}>Iniciar tour asistido <ChevronRight size={16}/></button></div>
        {!draft ? <>
          <div className="cms-page-heading"><div><span className="cms-eyebrow">CONTENIDO QUE MUEVE TU NEGOCIO</span><h1>Tu catálogo, bajo control.</h1><p>Agrega vehículos, actualiza sus detalles y decide qué mostrar.</p></div><button className="cms-btn cms-btn-primary" onClick={() => create(kind === 'used' ? 'used' : 'new')}><Plus size={17} /> Agregar vehículo</button></div>
          <div className="cms-metrics">
            <div><span>Vehículos publicados <Eye size={16} /></span><strong>{metrics.published.toString().padStart(2, '0')}</strong><small><i /> Visibles en la propuesta</small></div>
            <div><span>Borradores <FileEdit size={16} /></span><strong>{metrics.draft.toString().padStart(2, '0')}</strong><small>Pendientes de publicación</small></div>
            <div><span>Vehículos nuevos <Package size={16} /></span><strong>{metrics.new.toString().padStart(2, '0')}</strong><small>Gamas y modelos</small></div>
            <div><span>Vehículos usados <RotateCcw size={16} /></span><strong>{metrics.used.toString().padStart(2, '0')}</strong><small>Unidades individuales</small></div>
          </div>
          <div className="cms-inventory">
            <div className="cms-inventory-heading"><h2>Inventario editorial <span>{filtered.length}</span></h2><span>Los cambios se reflejan al publicar</span></div>
            <div className="cms-filters"><label className="cms-search"><Search size={17} /><input aria-label="Buscar vehículos en el CMS" placeholder="Buscar por vehículo, categoría o sede" value={query} onChange={event => setQuery(event.target.value)} /></label><select aria-label="Filtrar por tipo de vehículo" value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="all">Nuevos y usados</option><option value="new">Solo nuevos</option><option value="used">Solo usados</option></select><select aria-label="Filtrar por estado editorial" value={status} onChange={event => setStatus(event.target.value as typeof status)}><option value="all">Todos los estados</option><option value="published">Publicados</option><option value="draft">Borradores</option><option value="withdrawn">Retirados</option></select></div>
            <div className="cms-table-wrap"><table className="cms-table"><thead><tr><th>VEHÍCULO</th><th>ESTADO</th><th>PRECIO / MODELO</th><th>SEDE</th><th>ACCIONES</th></tr></thead><tbody>{filtered.map(record => <tr key={record.id}>
              <td><div className="cms-vehicle-cell"><div className="cms-thumb">{record.image ? <img src={record.image} alt="" loading="lazy" /> : <Package size={24} />}</div><div><button className="cms-name-button" onClick={() => edit(record)}>{record.name}</button><span>{record.kind === 'new' ? 'Nuevo' : 'Usado'} · {record.category}</span></div></div></td>
              <td><span className={'cms-status cms-status-' + record.status}><i />{statusLabels[record.status]}</span>{record.availability === 'sold' && <small className="cms-sold">Unidad vendida</small>}</td>
              <td><strong className="cms-table-price">{record.price > 0 ? money(record.price) : 'Por confirmar'}</strong><small>{record.year > 0 ? `Modelo ${record.year}` : 'Año por confirmar'}</small></td>
              <td><span className="cms-location">{record.location || 'Por definir'}</span><small>{availabilityLabels[record.availability]}</small></td>
              <td><div className="cms-actions"><button title="Editar vehículo" aria-label={'Editar ' + record.name} onClick={() => edit(record)}><FileEdit size={16} /></button><button title="Duplicar como borrador" aria-label={'Duplicar ' + record.name + ' como borrador'} onClick={() => duplicate(record)}><Copy size={15} /></button><button className={record.status === 'published' ? '' : 'cms-action-publish'} title={record.status === 'published' ? 'Retirar del catálogo' : 'Publicar vehículo'} aria-label={(record.status === 'published' ? 'Retirar ' : 'Publicar ') + record.name} disabled={record.availability === 'sold' && record.status !== 'published'} onClick={() => changeStatus(record)}>{record.status === 'published' ? <X size={16} /> : <Send size={15} />}</button></div></td>
            </tr>)}</tbody></table>{!filtered.length && <div className="cms-empty"><Search size={30} /><h3>No encontramos vehículos</h3><p>Prueba otra búsqueda o agrega el primero a este catálogo.</p><button className="cms-btn cms-btn-secondary" onClick={() => { setQuery(''); setKind('all'); setStatus('all'); }}>Limpiar filtros</button></div>}</div>
            <div className="cms-table-footer"><span>{filtered.length} de {records.length} registros · Retirar conserva el vehículo para futuras publicaciones.</span><button onClick={() => setShowReset(value => !value)}><RotateCcw size={12} /> Restablecer demostración</button></div>
          </div>
          {showReset && <div className="cms-reset"><div><strong>¿Restablecer el catálogo inicial?</strong><p>Se descartarán los cambios y las imágenes cargadas en esta demostración.</p></div><button className="cms-btn cms-btn-secondary" onClick={() => setShowReset(false)}>Cancelar</button><button className="cms-btn cms-btn-primary" onClick={() => { onReset(); setShowReset(false); setToast('Se restableció el catálogo inicial.'); }}>Restablecer</button></div>}
          <div className="cms-production-note"><Settings2 size={15} /><p>La versión de producción incorporará usuarios y permisos, almacenamiento persistente, historial de cambios y un flujo de aprobación editorial.</p></div>
        </> : <>
          <button className="cms-back" onClick={() => { setDraft(null); setError(''); }}><ArrowLeft size={15} /> Volver al catálogo</button>
          <div className="cms-editor-heading"><div><span className="cms-eyebrow">{editingExisting ? 'EDITAR CONTENIDO' : 'CREAR CONTENIDO'}</span><h1 ref={editorTitle} tabIndex={-1}>{editingExisting ? 'Cada detalle cuenta.' : 'Agrega un nuevo vehículo.'}</h1><p>{editingExisting ? 'Actualiza la información y guarda tus cambios.' : 'Completa la ficha y elige cuándo hacerla visible.'}</p></div><span className={'cms-status cms-status-' + draft.status}><i />{statusLabels[draft.status]}</span></div>
          <form ref={form} onSubmit={save} className="cms-editor-form">
            <div className="cms-editor-fields">
              <section className="cms-form-card"><div className="cms-card-heading"><span>01</span><div><h2>Información del vehículo</h2><p>Una ficha clara para que el cliente decida.</p></div></div>
                <div className="cms-kind-switch"><button type="button" className={draft.kind === 'new' ? 'cms-selected' : ''} onClick={() => setDraft({ ...draft, kind: 'new', mileage: 0 })}><Package size={16} /> Vehículo nuevo {draft.kind === 'new' && <Check size={14} />}</button><button type="button" className={draft.kind === 'used' ? 'cms-selected' : ''} onClick={() => setDraft({ ...draft, kind: 'used', mileage: draft.kind === 'new' ? -1 : draft.mileage })}><RotateCcw size={16} /> Vehículo usado {draft.kind === 'used' && <Check size={14} />}</button></div>
                <div className="cms-field-grid"><label>Marca <em>requerida para filtrar usados</em><input required={draft.kind === 'used'} value={draft.brand || ''} onChange={event => update('brand', event.target.value)} placeholder="Ej. Toyota, Mazda, Renault" maxLength={60}/></label><label>Modelo <em>sin año ni versión</em><input required={draft.kind === 'used'} value={draft.model || ''} onChange={event => update('model', event.target.value)} placeholder="Ej. Corolla Cross" maxLength={80}/></label><label className="cms-field-full">Nombre comercial <span>*</span><input required maxLength={100} value={draft.name} onChange={event => update('name', event.target.value)} placeholder="Ej. Toyota Corolla Cross XEI" /></label><label>Categoría <span>*</span><input required list="cms-categories" value={draft.category} onChange={event => setDraft({...draft, category:event.target.value, bodyType:event.target.value})} placeholder="Selecciona o escribe" /></label><label>Motorización <span>*</span><input required list="cms-power" value={draft.power} onChange={event => update('power', event.target.value)} placeholder="Ej. Híbrido HEV" /></label><label>Año {draft.kind === 'used' ? <span>*</span> : <em>opcional</em>}<input type="number" min="1980" max={new Date().getFullYear() + 2} step="1" required={draft.kind === 'used'} value={draft.year || ''} onChange={event => update('year', Number(event.target.value))} placeholder={draft.kind === 'new' ? 'Por confirmar' : 'Ej. 2024'} /></label><label>Transmisión {draft.kind === 'used' && <span>*</span>}<input list="cms-transmissions" required={draft.kind === 'used'} value={draft.transmission} onChange={event => update('transmission', event.target.value)} placeholder="Selecciona o escribe" /></label><label>Precio en pesos colombianos {draft.kind === 'used' ? <span>*</span> : <em>opcional</em>}<input type="number" min={draft.kind === 'used' ? 1 : 0} step="1" required={draft.kind === 'used'} value={draft.price || ''} onChange={event => update('price', Number(event.target.value))} placeholder={draft.kind === 'new' ? 'Consultar precio' : 'Escribe el precio'} /></label>{draft.kind === 'used' ? <label>Kilometraje <span>*</span><input type="number" min="0" step="1" required value={draft.mileage >= 0 ? draft.mileage : ''} onChange={event => update('mileage', event.target.value === '' ? -1 : Number(event.target.value))} placeholder="Kilómetros recorridos" /></label> : <label>Etiqueta destacada <em>opcional</em><input value={draft.tag} maxLength={60} onChange={event => update('tag', event.target.value)} placeholder="Ej. Unidad de demostración" /></label>}<label className="cms-field-full">Sede o punto de atención <span>*</span><input list="cms-locations" required value={draft.location} onChange={event => update('location', event.target.value)} placeholder="Ej. Palacé · Medellín" /></label><label className="cms-field-full">Descripción <span>*</span><textarea required rows={4} maxLength={800} value={draft.description} onChange={event => update('description', event.target.value)} placeholder="Describe el vehículo, su versión y los aspectos que quieres destacar." /><small>{draft.description.length}/800 caracteres</small></label>{draft.kind === 'used' && <label className="cms-field-full">Certificación<select value={draft.certified === true ? 'yes' : draft.certified === false ? 'no' : 'unknown'} onChange={event => update('certified', event.target.value === 'unknown' ? undefined : event.target.value === 'yes')}><option value="unknown">Sin verificar</option><option value="yes">Certificación verificada con soporte</option><option value="no">No certificado</option></select><small>Marca verificado solamente si tienes documentación vigente de la unidad.</small></label>}<label className="cms-field-full">Enlace de información <em>opcional</em><input type="url" value={draft.url} onChange={event => update('url', event.target.value)} placeholder="https://..." /><small>Puedes dejarlo vacío; la ficha ofrecerá la opción de consultar.</small></label></div>
                <datalist id="cms-categories">{['Sedán', 'Hatchback', 'SUV', 'Camioneta', 'Pickup', 'Van', 'Automóvil', '4x4'].map(value => <option key={value} value={value} />)}</datalist><datalist id="cms-power">{['Gasolina', 'Diésel', 'Híbrido HEV', 'Híbrido enchufable PHEV', 'Eléctrico BEV'].map(value => <option key={value} value={value} />)}</datalist><datalist id="cms-transmissions">{['Automática', 'Mecánica', 'CVT', 'Por confirmar'].map(value => <option key={value} value={value} />)}</datalist><datalist id="cms-locations">{['Palacé · Medellín', 'Sur · Envigado', 'Oriente · Rionegro', 'Apartadó', 'San Diego · Medellín'].map(value => <option key={value} value={value} />)}</datalist>
              </section>
              <section className="cms-form-card"><div className="cms-card-heading"><span>02</span><div><h2>Fotografía principal</h2><p>Selecciona un recurso de la propuesta o carga tu propia imagen.</p></div></div><div className="cms-photo-grid">{images.filter(([name]) => draft.kind === 'used' ? name.startsWith('used-') : !name.startsWith('used-')).map(([name, label]) => <button type="button" key={name} className={draft.image === '/assets/' + name ? 'cms-photo-selected' : ''} onClick={() => update('image', '/assets/' + name)} aria-label={'Elegir fotografía ' + label} aria-pressed={draft.image === '/assets/' + name}><img src={'/assets/' + name} alt={label} loading="lazy" />{draft.image === '/assets/' + name && <span><Check size={12} /></span>}</button>)}</div><input type="file" ref={file} accept="image/jpeg,image/png,image/webp" className="cms-file-input" aria-label="Cargar fotografía del vehículo" onChange={event => upload(event.target.files?.[0])} /><button type="button" className="cms-upload" disabled={reading} onClick={() => file.current?.click()}>{reading ? <LoaderCircle className="cms-spin" size={21} /> : <Upload size={21} />}<span><strong>{reading ? 'Cargando imagen…' : 'Cargar una fotografía'}</strong><small>JPG, PNG o WebP · Hasta 5 MB · Solo en esta pestaña</small></span><Plus size={16} /></button><p className="cms-help">Usa una fotografía que corresponda al vehículo y a su versión. Para nuevos: recurso oficial Toyota del mismo modelo. Para usados: fotografía de la unidad real de cualquier marca. La revisión de mercadeo es obligatoria antes de publicar.</p></section>
            </div>
            <aside className="cms-editor-aside">
              <section className="cms-preview"><div className="cms-preview-label"><Eye size={14} /> VISTA PREVIA DE LA TARJETA</div><div className="cms-preview-image">{draft.image ? <img src={draft.image} alt={draft.name || 'Vista previa del vehículo'} /> : <div><ImagePlus size={36} /><span>Tu fotografía aparecerá aquí</span></div>}<span className="cms-preview-kind">{draft.kind === 'new' ? 'NUEVO' : 'USADO'}</span></div><div className="cms-preview-content"><span>{draft.category || 'CATEGORÍA'} · {draft.power || 'MOTORIZACIÓN'}</span><h3>{draft.name || 'Nombre de tu vehículo'}</h3><p>{draft.kind === 'used' ? `${draft.year > 0 ? draft.year : 'Año'} · ${draft.mileage >= 0 ? draft.mileage.toLocaleString('es-CO') : '—'} km · ${draft.transmission || 'Transmisión'}` : draft.description || 'Una descripción que invita a conocerlo.'}</p><strong>{draft.price > 0 ? money(draft.price) : 'Consultar precio'}</strong><div className="cms-preview-cta">Conocer vehículo <ArrowUpRight size={17} /></div></div></section>
              <section className="cms-form-card cms-publication"><div className="cms-card-heading"><span>03</span><div><h2>Publicación</h2><p>Controla su visibilidad.</p></div></div><label>Estado editorial<select aria-label="Estado editorial" value={draft.status} onChange={event => update('status', event.target.value as CatalogRecord['status'])}><option value="draft">Borrador</option><option value="published" disabled={draft.availability === 'sold'}>Publicado</option><option value="withdrawn">Retirado</option></select></label><label>Disponibilidad<select aria-label="Disponibilidad" value={draft.availability} onChange={event => { const value = event.target.value as CatalogRecord['availability']; setDraft({ ...draft, availability: value, status: value === 'sold' ? 'withdrawn' : draft.status }); }}><option value="confirm">Por confirmar</option><option value="available">Disponible</option><option value="reserved">Reservado</option><option value="sold">Vendido</option></select></label>{draft.availability === 'sold' ? <p className="cms-publication-info"><CheckCircle2 size={15} /> Al guardar, esta unidad quedará retirada del catálogo.</p> : <p className="cms-publication-info"><Eye size={15} /> Los borradores y retirados permanecen aquí, fuera del catálogo público.</p>}</section>
              <p className="cms-editor-note"><ShieldCheck size={15} /> Esta ficha es de demostración. No envía información a Quiter, Hathor ni al sitio actual.</p>
            </aside>
            {error && <div className="cms-error" role="alert"><X size={17} /><span>{error}</span></div>}
            <div className="cms-savebar"><span><i /> Cambios pendientes de guardar</span><div><button type="button" className="cms-btn cms-btn-quiet" onClick={() => setDraft(null)}>Cancelar</button><button type="submit" value="draft" className="cms-btn cms-btn-secondary" disabled={reading}><FileEdit size={15} /> Guardar borrador</button>{draft.status === 'published' || draft.status === 'withdrawn' || draft.availability === 'sold' ? <button type="submit" value="save" className="cms-btn cms-btn-primary" disabled={reading}><Check size={16} /> Guardar cambios</button> : <button type="submit" value="publish" className="cms-btn cms-btn-primary" disabled={reading}><Send size={15} /> Publicar vehículo</button>}</div></div>
          </form>
        </>}
      </main>
    </div>
    {tour && draft && <EditorTour onClose={() => setTour(false)}/>}
    {toast && <div className="cms-toast" role="status"><CheckCircle2 size={19} /><span>{toast}</span><button onClick={() => setToast('')} aria-label="Cerrar aviso"><X size={15} /></button></div>}
  </div>;
}
