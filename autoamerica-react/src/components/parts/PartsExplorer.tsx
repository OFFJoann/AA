import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, ChevronDown, Check, X, Menu, MapPin, Phone, Search, SlidersHorizontal, RotateCcw, MoveUpRight, Move, Box, Layers3, CircleHelp, Settings2, ShieldCheck, CalendarDays, Wrench, CreditCard, Gauge, CheckCircle2, ExternalLink, Plus, Minus, Heart, Building2, Sun, Mouse, Maximize2 } from 'lucide-react';
import { parts } from '../../data';
import { getVehicleModel, vehicleModels } from '../../vehicleModels';
import type { VehicleModelId } from '../../vehicleModels';
import { useMotionPreference as useReducedMotion } from '../../hooks/useMotionPreference';
const VehicleScene = lazy(() => import('../VehicleScene'));

export default function Explorer({onQuote}:{onQuote:(s:string)=>void}) {
  const section=useRef<HTMLElement>(null);
  const [scrollProgress,setScrollProgress]=useState(0);
  const [manual,setManual]=useState<number|null>(0);
  const [selected,setSelected]=useState('body');
  const [color,setColor]=useState('#c5cbc8');
  const [modelId,setModelId]=useState<VehicleModelId>('prado');
  const [rotate,setRotate]=useState(false);
  const [view,setView]=useState<'perspective'|'front'|'side'|'rear'>('perspective');
  const [resetView,setResetView]=useState(0);
  const [reference,setReference]=useState(false);
  const [ready,setReady]=useState(false);
  const reduced=useReducedMotion();
  const progress=manual??(reduced?0:scrollProgress);
  useEffect(()=>{if(reduced)setRotate(false);},[reduced]);
  useEffect(()=>{const el=section.current;if(!el)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setReady(true);observer.disconnect();}},{rootMargin:'400px'});observer.observe(el);return()=>observer.disconnect();},[]);
  useEffect(()=>{let scheduled=false;const update=()=>{scheduled=false;const el=section.current;if(!el)return;const r=el.getBoundingClientRect();const amount=Math.max(1,el.offsetHeight-window.innerHeight+82);setScrollProgress(Math.max(0,Math.min(1,(82-r.top)/amount)));};const scroll=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();return()=>{window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};},[]);
  const activePart=parts.find(p=>p.id===selected)!;
  const activeModel=getVehicleModel(modelId);
  function selectPart(id:string){setSelected(id);setManual(id==='body'?.55:1);}
  return <section className={`explorer-track ${reduced?'reduced':''}`} id="repuestos" ref={section}>
    <div className="explorer-sticky">
      <div className="section-width explorer-heading">
        <div><span className="eyebrow light-eyebrow"><span className="section-number">02</span> EXPLORA LO QUE TE MUEVE</span><h2>Extraordinario por fuera.<br/><span>Fascinante por dentro.</span></h2></div>
        <div className="explore-hint"><Mouse size={22}/><p>Elige tu modelo. Gira para explorar.<br/><strong>Separa las piezas a tu ritmo.</strong></p></div>
      </div>
      <div className="explorer-layout section-width">
        <div className="scene-column">
          <div className="scene-meta"><span className="live-dot"/> EXPLORADOR 3D <span className="concept-tag">Referencia visual</span></div>
          <div className="vehicle-model-picker">
            <label htmlFor="vehicle-model">MODELO</label>
            <select id="vehicle-model" value={modelId} aria-label="Modelo del explorador 3D" onChange={event=>{setModelId(event.target.value as VehicleModelId);setManual(0);setSelected('body');setRotate(false);}}>
              {vehicleModels.map(model=><option key={model.id} value={model.id}>{model.name}</option>)}
            </select>
          </div>
          <div className="scene-views" aria-label="Ángulo del vehículo">{([['perspective','3/4'],['front','Frente'],['side','Lateral'],['rear','Atrás']] as const).map(([id,label])=><button key={id} aria-pressed={view===id} onClick={()=>{setView(id);setResetView(value=>value+1);setRotate(false);}}>{label}</button>)}<button aria-pressed={reference} onClick={()=>setReference(!reference)}>Foto real</button></div>
          {reference&&<figure className="scene-reference"><img src={activeModel.image} alt={`Fotografía de referencia ${activeModel.name}`}/><figcaption>{activeModel.name} · Imagen de catálogo</figcaption><button aria-label="Cerrar foto de referencia" onClick={()=>setReference(false)}><X size={14}/></button></figure>}
          <div className="scene-canvas">{ready?<Suspense fallback={<div className="scene-loading"><Box size={34}/><span>Preparando tu experiencia…</span></div>}><VehicleScene modelId={modelId} progress={progress} selectedPart={progress>.08?selected:null} onSelectPart={selectPart} color={color} autoRotate={rotate} view={view} resetView={resetView}/></Suspense>:<div className="scene-loading"><Box size={34}/><span>Explora en tres dimensiones</span></div>}</div>
          <span className="sr-only" role="status" aria-live="polite">Modelo seleccionado: {activeModel.name}</span>
          <div className="scene-tools">
            <div className="paint-controls" aria-label="Acabado del vehículo">{[['#c5cbc8','Plata'],['#edebe1','Perla'],['#343c39','Grafito'],['#ae272c','Rojo']].map(([hex,name])=><button key={hex} style={{background:hex}} className={color===hex?'selected':''} onClick={()=>setColor(hex)} aria-label={`Acabado ${name}`} aria-pressed={color===hex}/>)}</div>
            <span className="drag-hint"><Move size={15}/> Arrastra para girar</span>
            <button className={`scene-icon ${rotate?'active':''}`} onClick={()=>setRotate(!rotate)} disabled={reduced} aria-pressed={rotate} aria-label={rotate?'Detener giro automático':'Activar giro automático'}><RotateCcw size={17}/></button>
            <button className="scene-icon" onClick={()=>{setManual(0);setSelected('body');setRotate(false);setView('perspective');setResetView(value=>value+1);}} aria-label="Ensamblar vehículo"><Layers3 size={17}/></button>
          </div>
        </div>
        <aside className="parts-panel">
          <div className="parts-label">SELECCIONA UN SISTEMA <span>05</span></div>
          <div className="parts-list">{parts.map(part=><button key={part.id} className={selected===part.id?'selected':''} onClick={()=>selectPart(part.id)} aria-pressed={selected===part.id}><span className="part-number">{part.number}</span><span>{part.name}</span><ArrowUpRight size={17}/></button>)}</div>
          <div className="part-detail" key={selected}><span className="eyebrow red-text">MIRA MÁS DE CERCA</span><h3>{activePart.label}</h3><p>{activePart.description}</p><span className="part-examples">{activePart.examples}</span><button className="button light full" onClick={()=>onQuote(`Repuestos · ${activeModel.name} · ${activePart.name}`)}>Consultar este sistema <ArrowRight size={17}/></button><small>Compatibilidad y referencia: validar por VIN.</small></div>
        </aside>
      </div>
      <div className="explorer-bottom section-width">
        <div className="explosion-control">
          <div className="progress-caption"><span>{progress<.12?'Vehículo ensamblado':progress<.48?'Abriendo la carrocería':progress<.8?'Descubriendo la mecánica':'Vista de los componentes'}</span><button onClick={()=>setManual(manual===null?.85:null)}>{manual===null?'Control manual':'Seguir con el scroll'} <ArrowRight size={13}/></button></div>
          <input aria-label="Nivel de despiece del vehículo" type="range" min="0" max="100" value={Math.round(progress*100)} onChange={e=>setManual(Number(e.target.value)/100)} style={{'--progress':`${progress*100}%`} as React.CSSProperties}/>
          <div className="range-labels"><button onClick={()=>setManual(0)}>Ensamblado</button><button onClick={()=>setManual(.35)}>Apertura</button><button onClick={()=>setManual(.55)}>Carrocería</button><button onClick={()=>setManual(1)}>Despiece</button></div>
        </div>
        <p className="technical-note">Visualización conceptual. La geometría y disposición no corresponden a un despiece técnico Toyota.</p>
        <a className="skip-explorer" href="#usados">Continuar explorando <ArrowDown size={15}/></a>
      </div>
    </div>
  </section>;
}
