import { useEffect,useRef,useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft,ArrowUpRight,ArrowDown,Box,FileText,Film } from 'lucide-react';
import type { Vehicle } from '../../data';
import VehicleImage from './VehicleImage';
import { formatMoney,safeExternalUrl } from '../../lib/presentation';
import { useMotionPreference } from '../../hooks/useMotionPreference';

type Props={vehicle:Vehicle;onBack:()=>void;onQuote:(s:string)=>void;onCredit:(s:string,p?:number)=>void;onVideo:(s:string,id:string)=>void;onExplorer:()=>void};
/** Each scene has its own progress; no forced wheel interception or scroll hijacking. */
function Scene({number,title,copy,image,alt,wide=false,children}:{number:string;title:string;copy:string;image?:string;alt:string;wide?:boolean;children?:ReactNode}){
  const element=useRef<HTMLElement>(null);const reduced=useMotionPreference();
  useEffect(()=>{
    if(reduced)return;
    const el=element.current;if(!el)return;let frame=0,visible=false;
    const update=()=>{frame=0;if(!visible)return;const rect=el.getBoundingClientRect();const p=Math.min(1,Math.max(0,(window.innerHeight*.8-rect.top)/(window.innerHeight*.8+rect.height*.45)));el.style.setProperty('--story-y',`${((1-p)*80).toFixed(2)}px`);el.style.setProperty('--story-mobile-y',`${((1-p)*30).toFixed(2)}px`);el.style.setProperty('--story-scale',(.9+p*.1).toFixed(4));};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible)schedule();},{rootMargin:'100px'});
    observer.observe(el);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[reduced]);
  return <section ref={element} className={`aa-story-scene ${wide?'aa-story-wide':''} ${reduced?'aa-no-motion':''}`}><div className="aa-story-scene-inner section-width"><div className="aa-story-scene-copy"><span className="aa-kicker">{number} / DESCUBRE CADA DETALLE</span><h2>{title}</h2><p>{copy}</p>{children}</div><div className="aa-story-scene-image"><VehicleImage src={image} alt={alt}/><span>Fotografía comercial de referencia</span></div></div></section>;
}
export default function VehicleStory({vehicle,onBack,onQuote,onCredit,onVideo,onExplorer}:Props){
  const [staticView,setStaticView]=useState(false);const reduced=useMotionPreference();const name=vehicle.name;
  const isPrado=/prado/i.test(name)&&vehicle.origin==='reference';
  const hero=isPrado?'/assets/hero-road.webp':vehicle.image;
  const source=safeExternalUrl(vehicle.url);
  useEffect(()=>{const before=document.title;document.title=`${name} | Autoamérica`;window.scrollTo({top:0,behavior:'instant'});return()=>{document.title=before;};},[vehicle.id,name]);
  return <div className={`aa-story ${reduced||staticView?'aa-static-story':''}`}>
    <div className="aa-story-nav"><div className="section-width"><button className="text-button" onClick={onBack}><ArrowLeft size={17}/> Todos los modelos</button><strong>{name}</strong><a href="#" className="text-button" onClick={e=>{e.preventDefault();document.getElementById('aa-specifications')?.scrollIntoView({behavior:reduced||staticView?'instant':'smooth'});}}><FileText size={16}/> Ficha técnica</a></div></div>
    <section className={`aa-story-hero ${isPrado?'aa-story-photo':'aa-story-cutout'}`}><VehicleImage src={hero} alt={`Toyota ${name}`} priority/><div className="aa-story-hero-shade"/><div className="section-width aa-story-hero-copy"><span className="aa-kicker">TOYOTA / {vehicle.tag||'TU SIGUIENTE HISTORIA'}</span><h1>{name}</h1><p>{vehicle.description}</p><div><button className="button red" onClick={()=>onQuote(name)}>Cotizar este Toyota <ArrowUpRight size={18}/></button><button className="button outline" onClick={()=>setStaticView(!staticView)} aria-pressed={staticView}>{staticView?'Activar experiencia':'Reducir movimiento'}</button></div><a href="#" className="aa-scroll-cue" onClick={e=>{e.preventDefault();document.querySelector('.aa-story-scene')?.scrollIntoView({behavior:reduced||staticView?'instant':'smooth'});}}><ArrowDown size={19}/> La historia continúa al deslizar</a></div></section>
    <Scene number="01" title="Presencia que se siente." copy={`Conoce el diseño de ${name}. Explora su silueta y encuentra el estilo que acompaña tus planes.`} image={vehicle.image} alt={`Vista exterior oficial de Toyota ${name}`}>
      <span className="aa-story-pill">{vehicle.category}</span><span className="aa-story-pill">{vehicle.power}</span>
    </Scene>
    {isPrado?<Scene number="02" title="Tu mundo. Desde otra perspectiva." copy="Acércate al habitáculo de la Land Cruiser Prado 250. Una nueva forma de mirar el siguiente camino." image="/assets/prado-interior.webp" alt="Habitáculo Toyota Land Cruiser Prado 250 publicado por Autoamérica" wide>
      <p className="aa-footnote">Imagen de la publicación de lanzamiento de 2024. El equipamiento de tu versión debe confirmarse.</p>
    </Scene>:<Scene number="02" title="Más cerca de cada detalle." copy={`La elección está en los detalles. Consulta las fotografías del interior y el equipamiento de la versión que te interesa de ${name}.`} image={vehicle.image} alt={`Vista exterior de Toyota ${name}`}>
      <a className="button outline" href={source} target="_blank" rel="noreferrer">Ver galería oficial <ArrowUpRight size={16}/></a><p className="aa-footnote">Esta escena utiliza la vista exterior disponible. No se mezcla el interior de otro modelo.</p>
    </Scene>}
    <section className="aa-specifications section-pad" id="aa-specifications"><div className="section-width"><span className="aa-kicker"><i/> 03 / DATOS PARA DECIDIR</span><div className="aa-section-title"><h2>La emoción, en detalle.</h2><p>La información siempre a mano.<br/>Sin tener que recorrer todas las escenas.</p></div><div className="aa-spec-grid"><div className="aa-spec-card"><span>MODELO</span><h3>{name}</h3><dl>{[
      ['Carrocería',vehicle.category],['Motorización de la gama',vehicle.power],['Año',vehicle.year||'Por confirmar'],['Transmisión',vehicle.transmission||'Por confirmar'],['Sede',vehicle.location||'Por confirmar'],['Precio publicado',formatMoney(vehicle.price)],
    ].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div><aside className="aa-spec-aside"><FileText size={27}/><h3>Elige tu versión.</h3><p>Potencia, dimensiones, seguridad y equipamiento cambian por año y versión. Consulta la ficha publicada por Autoamérica antes de tomar tu decisión.</p><a className="button outline" href={source} target="_blank" rel="noreferrer">Ficha oficial del modelo <ArrowUpRight size={17}/></a><p className="aa-footnote">No se añaden especificaciones que no estén disponibles en el catálogo. Este bloque queda preparado para los datos técnicos de Johan.</p></aside></div></div></section>
    <section className="aa-story-conversion"><div className="section-width"><span className="aa-kicker">04 / TU PRÓXIMO PASO</span><h2>Lo extraordinario<br/>comienza contigo.</h2><div className="aa-conversion-actions"><button className="button red" onClick={()=>onQuote(name)}>Quiero cotizar <ArrowUpRight size={18}/></button><button className="button light" onClick={()=>onCredit(name,vehicle.price)}>Simular crédito <ArrowUpRight size={18}/></button><button className="button light" onClick={()=>onVideo(name,vehicle.id)}><Film size={18}/> Video cinematográfico</button><button className="button outline" onClick={onExplorer}><Box size={18}/> Explorar en 3D</button></div><p>El visor 3D es conceptual; no es un modelo técnico oficial del vehículo.</p></div></section>
  </div>;
}
