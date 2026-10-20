import VehicleMotionBackground from './VehicleMotionBackground';
import OfficialVehicleTours from './OfficialVehicleTours';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Camera, ChevronDown, List, Mouse, Search, ShieldCheck } from 'lucide-react';
import type { Vehicle } from '../../data';
import { findTechnicalProfile, eligibleMedia, technicalSources } from '../../data/technicalProfiles';
import type { TechnicalGroup, TechnicalVariant, TechnicalProfile, StoryMedia } from '../../data/technicalProfiles';
import { sceneState, trackProgress } from '../../lib/cinematic';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { SiteLink } from '../../navigation/SiteNavigation';
import VehicleImage from './VehicleImage';
import ReferenceVehicleStory from './ReferenceVehicleStory';
import Vehicle360Viewer from './Vehicle360Viewer';
import { modelKey } from '../../lib/vehicleBackground';

type Props={vehicle:Vehicle;onBack:()=>void;onQuote:(subject:string)=>void;onCredit:(subject:string,price?:number)=>void;onExplorer:()=>void};
type Chapter={id:string;label:string;title:string;description:string;group?:TechnicalGroup;media?:StoryMedia};
function chaptersFor(p:TechnicalProfile,v:TechnicalVariant):Chapter[]{
 const media=eligibleMedia(p,v.id),exterior=media.find(m=>m.kind==='exterior'),interior=media.find(m=>m.kind==='interior'),detail=media.find(m=>m.kind==='detail');
 const group=(id:string)=>v.groups.find(g=>g.id===id);
 return [
  {id:'exterior',label:'Exterior',title:p.name,description:p.summary,media:exterior,group:group('carroceria')},
  {id:'interior',label:'Interior',title:'Todo empieza al entrar.',description:'Confort, mandos y conectividad de la configuración seleccionada.',media:interior,group:group('interior')},
  {id:'motor',label:'Motor',title:'Conoce lo que lo mueve.',description:'Cifras del motor de esta versión. En híbridos, los datos térmicos y eléctricos se presentan por separado.',group:group('motor')},
  {id:'transmision',label:'Tracción',title:'La fuerza, al camino.',description:'Transmisión y sistema de tracción. Consulta el manual del propietario para su uso.',media:detail,group:group('transmision')},
  {id:'chasis',label:'Chasis',title:'La base de cada movimiento.',description:'Suspensión, frenos, ruedas y dirección, sin atribuir equipamiento de otras versiones.',group:group('chasis')},
  {id:'seguridad',label:'Seguridad',title:'El cuidado está en los detalles.',description:'Seguridad activa y pasiva. Las asistencias no reemplazan al conductor ni garantizan evitar accidentes.',group:group('seguridad')},
  {id:'dimensiones',label:'Medidas',title:'Espacio para tus planes.',description:'Dimensiones y capacidades publicadas. No se extrapolan cargas o medidas de otra versión.',group:group('carroceria')}
 ];
}
function MediaView({chapter,variant,priority=false}:{chapter:Chapter;variant:TechnicalVariant;priority?:boolean}){
 return chapter.media ? <figure className={`aa-cinema-media aa-media-${chapter.media.kind}`}>
  <VehicleImage src={chapter.media.src} alt={chapter.media.alt} priority={priority}/>
  <figcaption>{chapter.media.note}</figcaption>
 </figure>:<div className="aa-cinema-blueprint" aria-label={`Presentación técnica: ${chapter.label}`}>
   <div className="aa-cinema-crosshair" aria-hidden="true"/>
   <span className="aa-cinema-code">TOYOTA / {chapter.id.toUpperCase()}</span>
   <strong>{chapter.id==='motor'?variant.headline:chapter.label}</strong>
   <span className="aa-cinema-blueprint-line"/>
   <p>{chapter.group?.rows[0]?.value||'Consulta la documentación de esta configuración.'}</p>
   <small><Camera size={14}/> Fotografia específica pendiente. Presentación de datos, no imagen del sistema.</small>
 </div>;
}
function Facts({group}:{group?:TechnicalGroup}){
 if(!group)return <p className="aa-cinema-missing">Este sistema requiere una ficha oficial de la versión. No se han inferido sus especificaciones.</p>;
 return <dl className="aa-cinema-facts">{group.rows.slice(0,3).map(row=><div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>;
}
function TechnicalSheet({variant,profile}:{variant:TechnicalVariant;profile:TechnicalProfile}){
 const [query,setQuery]=useState('');
 const normalized=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const groups=variant.groups.map(g=>({...g,rows:g.rows.filter(r=>normalized(g.title+' '+r.label+' '+r.value).includes(normalized(query.trim())))})).filter(g=>g.rows.length);
 return <section id="ficha-tecnica" className="aa-tech-sheet section-width" aria-labelledby="technical-title">
   <div className="aa-tech-title"><div><span className="aa-kicker"><i/> CONSULTA DIRECTA</span><h2 id="technical-title">La información.<br/><em>Sin tener que recorrerlo todo.</em></h2></div><BookOpen size={32}/></div>
   <p className="aa-tech-variant">{profile.name} · {variant.label} · Referencia {variant.year}, Colombia</p>
   <label className="aa-tech-search"><Search size={19}/><span className="sr-only">Buscar en la ficha técnica</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar motor, frenos, llantas..." type="search"/></label>
   {groups.map(g=><section key={g.id} className="aa-tech-group" aria-labelledby={`spec-${g.id}`}><h3 id={`spec-${g.id}`}>{g.title}</h3><dl>{g.rows.map(row=><div key={row.label}><dt>{row.label}</dt><dd>{row.value}<a href={technicalSources[row.source]?.url} target="_blank" rel="noreferrer" aria-label={`Fuente de ${row.label}`} title={technicalSources[row.source]?.title}><ArrowUpRight size={14}/></a></dd></div>)}</dl></section>)}
   {!groups.length&&<p role="status">No encontramos ese término. Prueba con otra característica.</p>}
   <aside className="aa-tech-sources"><h3>Documentación de origen</h3><p>{profile.notice}</p><div>{profile.sources.map(id=><a key={id} href={technicalSources[id].url} target="_blank" rel="noreferrer">{technicalSources[id].title} {technicalSources[id].type==='pdf'?'· Abrir PDF':'· Consultar'} <ArrowUpRight size={16}/></a>)}</div><small>Consulta de fuentes: 20/10/2026. Resumen de especificaciones comerciales; no es un manual de reparación, homologación ni oferta de inventario. Las condiciones definitivas se confirman con Autoamérica.</small></aside>
 </section>;
}
function CinematicStory({profile,vehicle,onQuote,onCredit,onExplorer}:Props&{profile:TechnicalProfile}){
 // IDs from the catalog include the new: prefix. Never attach reference media to marketing edits.
 const hasLocal360=modelKey(vehicle.id,vehicle.origin)==='corolla-cross';
 const [variantId,setVariantId]=useState(profile.variants[0].id);
 const variant=profile.variants.find(v=>v.id===variantId)||profile.variants[0];
 const reduced=useMotionPreference();
 const [reading,setReading]=useState(false);
 const [shortViewport,setShortViewport]=useState(()=>window.matchMedia('(max-height: 680px)').matches);
 useEffect(()=>{const m=window.matchMedia('(max-height: 680px)');const update=()=>setShortViewport(m.matches);m.addEventListener('change',update);return()=>m.removeEventListener('change',update);},[]);
 const staticMode=reduced||reading||shortViewport;
 const [progress,setProgress]=useState(0);
 const track=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null);
 const chapters=chaptersFor(profile,variant),state=sceneState(progress,chapters.length);
 const active=chapters[state.active];
 useEffect(()=>{
   if(staticMode)return;
   let raf=0;
   const update=()=>{raf=0;if(!track.current||!stage.current)return;const top=Number.parseFloat(getComputedStyle(stage.current).top)||0;setProgress(trackProgress(track.current.getBoundingClientRect().top,track.current.offsetHeight,stage.current.offsetHeight,top));};
   const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
   window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
   const resize=new ResizeObserver(schedule);if(track.current)resize.observe(track.current);schedule();
   return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);resize.disconnect();cancelAnimationFrame(raf);};
 },[staticMode,variantId]);
 function jump(index:number){
  if(staticMode){document.getElementById(`capitulo-${chapters[index].id}`)?.scrollIntoView({behavior:'instant'});return;}
  if(!track.current||!stage.current)return;
  const top=Number.parseFloat(getComputedStyle(stage.current).top)||0;
  const start=window.scrollY+track.current.getBoundingClientRect().top-top;
  const distance=track.current.offsetHeight-stage.current.offsetHeight;
  window.scrollTo({top:start+distance*index/(chapters.length-1),behavior:'instant'});
 }
 const subject=`${profile.name} ${variant.label} ${variant.year} - confirmar disponibilidad y configuración`;
 return <article className="aa-cinematic-page" data-page="vehicle">
  <div className="section-width aa-story-toolbar"><SiteLink href="/nuevos"><ArrowLeft size={17}/> Todos los nuevos</SiteLink><div>{hasLocal360&&<a href="#vista-360">Exterior 360°</a>}<a href="#ficha-tecnica"><BookOpen size={16}/> Ficha técnica</a><button onClick={()=>setReading(v=>!v)} aria-pressed={staticMode} disabled={reduced||shortViewport}><List size={16}/>{reduced?'Movimiento reducido':shortViewport?'Lectura adaptable':reading?'Activar recorrido':'Modo lectura'}</button></div></div>
  <div className="aa-story-motion-intro"><VehicleMotionBackground modelId={vehicle.id} origin={vehicle.origin} variant={variant.id} poster={eligibleMedia(profile,variant.id).find(m=>m.kind==='exterior')?.src} className="aa-detail-bg" animatePhoto={false}/><header className="aa-story-intro section-width"><div><span className="aa-kicker"><i/> {profile.kicker}</span><h1>{profile.name}</h1><p>Una historia por sistemas. A tu ritmo.</p></div><label>Configuración de referencia<select value={variantId} onChange={e=>setVariantId(e.target.value)}>{profile.variants.map(v=><option key={v.id} value={v.id}>{v.label} · {v.year}</option>)}</select><small>La selección actualiza los datos, no confirma stock ni precio.</small></label></header></div>
  <p className="aa-story-context section-width">{profile.notice}</p>
  {staticMode?<div className="aa-cinema-reading section-width"><nav aria-label="Capítulos de la ficha">{chapters.map((c,i)=><button key={c.id} onClick={()=>jump(i)}>{c.label}</button>)}</nav>{chapters.map((c,i)=><section key={c.id} id={`capitulo-${c.id}`} className="aa-reading-chapter"><div><span className="aa-kicker">{String(i+1).padStart(2,'0')} / {c.label}</span><h2>{c.title}</h2><p>{c.description}</p><Facts group={c.group}/></div><MediaView chapter={c} variant={variant}/></section>)}</div>:
   <div className="aa-cinema-track" ref={track} style={{'--aa-chapters':chapters.length} as CSSProperties}>
    <div className="aa-cinema-stage" ref={stage} aria-label={`Recorrido de ${profile.name}`}>
     <div className="aa-cinema-topline"><span>TOYOTA / {variant.label} / {variant.year}</span><div className="aa-cinema-top-actions"><span><Mouse size={14}/> Desplázate para explorar</span><a href="#ficha-tecnica">Ficha técnica <BookOpen size={13}/></a><button onClick={()=>onQuote(subject)}>Cotizar <ArrowUpRight size={13}/></button></div></div>
     <div className="aa-cinema-layers">
      {chapters.map((chapter,index)=>{
       const weight=index===state.from?1-state.blend:index===state.to?state.blend:0;
       const shown=index===state.active;
       return <section className={`aa-cinema-layer ${chapter.media?'has-media':''}`} key={chapter.id} aria-hidden={!shown} inert={!shown} style={{opacity:weight,transform:`translate3d(${(index===state.from?-1:1)*(1-weight)*26}px,0,0)`,visibility:weight>0?'visible':'hidden'}}>
        {(index<=state.active+1)&&<MediaView chapter={chapter} variant={variant} priority={index===0}/>}
        <div className="aa-cinema-copy"><span className="aa-kicker"><i/> {String(index+1).padStart(2,'0')} / {chapter.label}</span><h2>{chapter.title}</h2><p>{chapter.description}</p><Facts group={chapter.group}/><a href="#ficha-tecnica" tabIndex={shown?0:-1} className="aa-cinema-spec-link">Consultar todas las especificaciones <ArrowRight size={16}/></a></div>
       </section>;
      })}
     </div>
     <nav className="aa-cinema-rail" aria-label="Capítulos del recorrido">{chapters.map((c,i)=><button key={c.id} onClick={()=>jump(i)} aria-current={state.active===i?'step':undefined}><span>{String(i+1).padStart(2,'0')}</span>{c.label}</button>)}</nav>
     <div className="aa-cinema-progress" role="progressbar" aria-label="Avance del recorrido" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}><i style={{transform:`scaleX(${progress})`}}/></div>
     <span className="sr-only" aria-live="polite">Capítulo {state.active+1}: {active.label}</span>
    </div>
   </div>}
  <div className="aa-story-shortcuts section-width"><button className="button red" onClick={()=>onQuote(subject)}>Consultar esta configuración <ArrowUpRight size={18}/></button><button className="button outline" onClick={()=>onCredit(subject)}>Simular con mi presupuesto</button><button className="text-button" onClick={onExplorer}>Explorador 3D conceptual <ArrowUpRight size={15}/></button></div>
  {hasLocal360&&<div id="vista-360" style={{scrollMarginTop:'140px'}}><Vehicle360Viewer title="Toyota Corolla Cross Hybrid SE 2026" basePath="/assets/360/corolla-cross" /></div>}
  <div className="section-width aa-story-official"><OfficialVehicleTours id={vehicle.id} origin={vehicle.origin}/></div>
  <TechnicalSheet key={variant.id} profile={profile} variant={variant}/>
  <section className="aa-story-gallery section-width"><span className="aa-kicker"><i/> EXPLORA LOS ENCUADRES DISPONIBLES</span><h2>Sin recortar lo importante.</h2><p>Fotografías de referencia de la gama, con su procedencia. Las vistas del motor y los interiores no confirmados se mantienen pendientes.</p><div>{eligibleMedia(profile,variant.id).map(m=><figure key={m.id}><a href={m.src} target="_blank" rel="noreferrer" aria-label={`Abrir imagen: ${m.alt}`}><VehicleImage src={m.src} alt={m.alt}/></a><figcaption>{m.alt}<small>{m.note}</small><a href={technicalSources[m.source]?.url} target="_blank" rel="noreferrer">Fuente <ArrowUpRight size={13}/></a></figcaption></figure>)}</div>{!eligibleMedia(profile,variant.id).length&&<p className="aa-cinema-missing">La galería de esta versión aún no está validada. No se usan fotos de otro Toyota.</p>}</section>
  <div className="aa-story-end"><ShieldCheck size={27}/><h2>Tu próximo paso, con respaldo.</h2><p>Confirma año, versión, precio y disponibilidad con Autoamérica.</p><button className="button red" onClick={()=>onQuote(subject)}>Hablar con un asesor <ArrowUpRight size={18}/></button><SiteLink href="/nuevos">Seguir explorando modelos <ArrowLeft size={17}/></SiteLink></div>
 </article>;
}
export default function VehicleStory(props:Props){
 const profile=findTechnicalProfile(props.vehicle.id,props.vehicle.origin);
 return profile?<CinematicStory key={profile.id} {...props} profile={profile}/>:<ReferenceVehicleStory {...props}/>;
}
