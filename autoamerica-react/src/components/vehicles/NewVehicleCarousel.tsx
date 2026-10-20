import { useEffect, useRef, useState } from 'react';
import { ArrowLeft,ArrowRight,ArrowUpRight,Check,Plus,ChevronRight } from 'lucide-react';
import type { Vehicle } from '../../data';
import VehicleImage from './VehicleImage';
import { formatMoney } from '../../lib/presentation';
import { useMotionPreference } from '../../hooks/useMotionPreference';

type Props={items:Vehicle[];selected:string[];onCompare:(id:string)=>void;onDiscover:(v:Vehicle)=>void;onQuote:(s:string)=>void;onCredit:(s:string,p?:number)=>void};
export default function NewVehicleCarousel({items,selected,onCompare,onDiscover,onQuote,onCredit}:Props){
  const [category,setCategory]=useState('Todos');
  const [activeId,setActiveId]=useState(items[0]?.id||'');
  const strip=useRef<HTMLDivElement>(null);
  const reduced=useMotionPreference();
  const filtered=items.filter(v=>category==='Todos'||(category==='Híbridos'&&/h[ií]brido/i.test(v.power))||(category==='SUV'&&v.category==='SUV')||(category==='Pick-ups'&&/^pick.?up$/i.test(v.category)));
  const active=filtered.find(v=>v.id===activeId)||filtered[0];
  const index=active?filtered.findIndex(v=>v.id===active.id):0;
  const ids=filtered.map(v=>v.id).join('|');
  useEffect(()=>{const host=strip.current;if(!active||!host)return;const target=host.querySelector<HTMLButtonElement>(`[data-model="${CSS.escape(active.id)}"]`);if(target)host.scrollTo({left:host.scrollLeft+target.getBoundingClientRect().left-host.getBoundingClientRect().left,behavior:reduced?'instant':'smooth'});},[active?.id,reduced]);
  function move(direction:number){if(!filtered.length)return;setActiveId(filtered[(index+direction+filtered.length)%filtered.length].id);}
  const dragStart=useRef<{x:number;y:number}|null>(null);
  return <section className="aa-showroom section-pad" id="modelos" aria-labelledby="aa-model-title">
    <div className="section-width"><div className="aa-section-title"><div><span className="aa-kicker"><i/> ELIGE CÓMO QUIERES MOVERTE</span><h2 id="aa-model-title">Un Toyota.<br/><em>Infinitas posibilidades.</em></h2></div><p>Primero elige el que te mueve.<br/>Después, descubre todo lo que lo hace único.</p></div>
      <div className="aa-model-top"><div className="aa-pills" aria-label="Categorías de vehículos nuevos">{['Todos','Híbridos','SUV','Pick-ups'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);setActiveId('');}}>{c}</button>)}</div><span>{String(filtered.length).padStart(2,'0')} modelos en esta selección</span></div>
      {active?<div className="aa-model-stage" role="region" aria-roledescription="carrusel" aria-label="Vehículos nuevos Toyota" tabIndex={0}
        onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}
        onTouchStart={e=>{const t=e.touches[0];dragStart.current={x:t.clientX,y:t.clientY};}}
        onTouchEnd={e=>{const t=e.changedTouches[0],s=dragStart.current; if(s&&Math.abs(t.clientX-s.x)>65&&Math.abs(t.clientY-s.y)<65)move(t.clientX<s.x?1:-1);dragStart.current=null;}}>
        <div className="aa-model-description" key={active.id+'copy'}><span className="aa-kicker">{active.power} <span className="aa-category-slash">/</span> {active.category}</span><h3>{active.name}</h3><p>{active.description}</p><div className="aa-model-price"><small>PRECIO DE LA VERSIÓN</small><strong>{formatMoney(active.price)}</strong></div><div className="aa-model-buttons"><button className="button red" onClick={()=>onDiscover(active)}>Conocer modelo <ArrowUpRight size={18}/></button><button className="text-button" onClick={()=>onQuote(active.name)}>Cotizar <ChevronRight size={18}/></button></div><button className="aa-compare-pick" onClick={()=>onCompare(active.id)} aria-pressed={selected.includes(active.id)}>{selected.includes(active.id)?<Check size={16}/>:<Plus size={16}/>} {selected.includes(active.id)?'Añadido al comparador':'Añadir al comparador'}</button></div>
        <div className="aa-model-visual" key={active.id+'image'}><span className="aa-model-type" aria-hidden="true">{active.category.toUpperCase()}</span><VehicleImage src={active.image} alt={`Toyota ${active.name}`} priority/><span className="aa-reference-label">IMAGEN COMERCIAL DE REFERENCIA</span></div>
        <div className="aa-model-controls"><button className="icon-button" aria-label="Vehículo anterior" onClick={()=>move(-1)} disabled={filtered.length<2}><ArrowLeft size={18}/></button><span aria-live="polite" aria-atomic="true">{String(index+1).padStart(2,'0')} <b>/ {String(filtered.length).padStart(2,'0')}</b><span className="sr-only"> {active.name}</span></span><button className="icon-button" aria-label="Vehículo siguiente" onClick={()=>move(1)} disabled={filtered.length<2}><ArrowRight size={18}/></button><button className="aa-finance-link" onClick={()=>onCredit(active.name,active.price)}>Simular crédito <ArrowUpRight size={14}/></button></div>
      </div>:<div className="aa-empty"><h3>No hay modelos en esta categoría.</h3><button className="button outline" onClick={()=>setCategory('Todos')}>Ver todos</button></div>}
      <div className="aa-model-strip" key={ids} ref={strip} aria-label="Seleccionar un Toyota">{filtered.map((v,i)=><button key={v.id} data-model={v.id} aria-label={`Seleccionar ${v.name}`} aria-pressed={active?.id===v.id} onClick={()=>setActiveId(v.id)}><span className="aa-model-index">{String(i+1).padStart(2,'0')}</span><VehicleImage src={v.image} alt={v.name}/><span>{v.name}<small>{v.power}</small></span><ArrowUpRight size={17}/></button>)}</div>
      <p className="aa-footnote">Selecciona un modelo para vivir su historia. La versión, el equipamiento y la disponibilidad se confirman con un asesor.</p>
    </div>
  </section>;
}
