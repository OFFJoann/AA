import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import '../../styles/vehicle-360.css';

type Props = { title: string; basePath: string; count?: number; verifiedMarket?: boolean };
const pad = (n:number)=>String(n).padStart(2,'0');

export default function Vehicle360Viewer({title,basePath,count=36,verifiedMarket=false}:Props) {
  const [index,setIndex]=useState(0);
  const [loaded,setLoaded]=useState(0);
  const [error,setError]=useState(false);
  const [fullscreen,setFullscreen]=useState(false);
  const wrap=useRef<HTMLDivElement>(null);
  const pointer=useRef<{x:number;position:number;id:number}|null>(null);
  const countSafe=Math.max(1,Math.floor(count));
  const base=basePath.replace(/\/$/,'');
  const frame=useCallback((n:number)=>`${base}/frame-${pad(((n%countSafe)+countSafe)%countSafe+1)}.jpg`,[base,countSafe]);
  const change=useCallback((diff:number)=>setIndex(i=>((i+diff)%countSafe+countSafe)%countSafe),[countSafe]);

  useEffect(()=>{
    let cancelled=false;
    let successes=0;
    setIndex(0);setLoaded(0);setError(false);
    // Load first frame immediately; remaining frames progressively, not all at once.
    const first=new Image();
    first.onload=()=>{if(!cancelled){setLoaded(1);let offset=1;const next=()=>{
      if(cancelled||offset>=countSafe)return;
      const photo=new Image();
      photo.onload=()=>{if(cancelled){return;}successes++;setLoaded(1+successes);offset++;next();};
      photo.onerror=()=>{if(cancelled)return;offset++;next();};
      photo.src=frame(offset);
    };next();}};
    first.onerror=()=>{if(!cancelled)setError(true);};
    first.src=frame(0);
    return()=>{cancelled=true;first.onload=null;first.onerror=null;};
  },[frame,countSafe]);

  useEffect(()=>{
    const listener=()=>setFullscreen(document.fullscreenElement===wrap.current);
    document.addEventListener('fullscreenchange',listener);
    return()=>document.removeEventListener('fullscreenchange',listener);
  },[]);

  const start=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(event.button!==0||error)return;
    pointer.current={x:event.clientX,position:index,id:event.pointerId};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const p=pointer.current;
    if(!p||p.id!==event.pointerId)return;
    const steps=Math.trunc((event.clientX-p.x)/13);
    setIndex(((p.position-steps)%countSafe+countSafe)%countSafe);
  };
  const end=()=>{pointer.current=null;};
  const key=(event:ReactKeyboardEvent<HTMLDivElement>)=>{
    if(event.key==='ArrowRight'){event.preventDefault();change(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();change(-1);}
  };
  const toggleFullscreen=async()=>{
    if(!wrap.current)return;
    try {if(document.fullscreenElement)await document.exitFullscreen();else await wrap.current.requestFullscreen();}
    catch { /* Browser may deny fullscreen; leave inline viewer usable. */ }
  };
  return <section className="aa360" aria-label={`Vista giratoria de ${title}`} ref={wrap}>
    <header className="aa360__header"><div><small>EXPLORADOR EXTERIOR</small><h2>{title} <span>360°</span></h2></div><button className="aa360__fullscreen" type="button" onClick={toggleFullscreen}>{fullscreen?'Salir de pantalla completa':'Pantalla completa'}</button></header>
    <div className="aa360__stage" role="group" tabIndex={0} aria-label="Arrastra para girar, o usa las flechas izquierda y derecha" onKeyDown={key} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      {error?<div className="aa360__failure" role="status">No se encontró la primera imagen. Verifica la carpeta public/assets/360/corolla-cross.</div>:<img draggable={false} src={frame(index)} alt={`${title}: ángulo ${index+1} de ${countSafe}`} onError={()=>setError(true)}/>}
      <span className="aa360__hint">⇆ Arrastra para girar</span>
    </div>
    <footer className="aa360__footer"><button type="button" onClick={()=>change(-1)} aria-label="Girar hacia la izquierda">←</button><span aria-live="off">Ángulo {pad(index+1)} / {pad(countSafe)} · {loaded}/{countSafe} cargadas</span><button type="button" onClick={()=>change(1)} aria-label="Girar hacia la derecha">→</button></footer>
    <p className="aa360__notice">Referencia visual: Corolla Cross Hybrid SE 2026, mercado estadounidense. No representa necesariamente las versiones comercializadas en Colombia. Material para revisión interna; requiere autorización antes de publicación comercial.</p>
    {!verifiedMarket&&<p className="aa360__notice">Esta vista 360° utiliza fotografías, no un modelo tridimensional desmontable.</p>}
  </section>;
}
