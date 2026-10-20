import { useEffect,useRef,useState } from 'react';
import { ArrowUpRight,MapPin,Navigation,Map as MapIcon,Clock } from 'lucide-react';
import { locations } from '../data';
import type { Location } from '../data';
import { mapLinks } from '../lib/mapLinks';

function EmbeddedMap({location}:{location:Location}){
  const [consent,setConsent]=useState(false);const [loading,setLoading]=useState(true);const [slow,setSlow]=useState(false);const [attempt,setAttempt]=useState(0);
  const link=mapLinks(location);
  useEffect(()=>{if(!consent)return;setLoading(true);setSlow(false);const id=setTimeout(()=>setSlow(true),9000);return()=>clearTimeout(id);},[location.name,consent,attempt]);
  return <div className="aa-google-map"><div className="aa-map-heading"><span><MapPin size={17}/>{location.name}</span><small>{location.city}, Antioquia</small></div>
    {!consent?<div className="aa-map-consent"><span className="aa-map-art" aria-hidden="true"><MapIcon size={78}/><MapPin size={32}/></span><h3>Tu próximo destino,<br/>en el mapa.</h3><p>Explora la ubicación y sus alrededores con Google Maps.</p><button className="button red" onClick={()=>setConsent(true)}>Cargar Google Maps <ArrowUpRight size={17}/></button><small>Al cargar, tu navegador se conecta con Google.<br/>También puedes abrir la ruta sin cargar el mapa aquí.</small></div>
      :<div className="aa-map-frame"><iframe key={location.name+attempt} src={link.embed} title={`Google Maps: Autoamérica ${location.name}, ${location.address}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" onLoad={()=>setLoading(false)}/>{loading&&!slow&&<span className="aa-map-progress" role="status">Cargando Google Maps…</span>}{slow&&loading&&<div className="aa-map-slow" role="status"><p>Google Maps tarda en responder.</p><a href={link.search} target="_blank" rel="noreferrer">Abrir mapa en otra pestaña</a><button onClick={()=>setAttempt(a=>a+1)}>Reintentar</button></div>}</div>}
    <div className="aa-map-footer"><span>Ubicación por dirección publicada.</span><a href={link.search} target="_blank" rel="noreferrer">Abrir Google Maps <ArrowUpRight size={14}/></a></div>
  </div>;
}
export default function LocationMap(){
  const [service,setService]=useState('Todas');const [active,setActive]=useState(locations[0].name);
  const filtered=locations.filter(l=>service==='Todas'||l.services.toLowerCase().includes(service.toLowerCase()));
  const location=filtered.find(l=>l.name===active)||filtered[0];
  return <section className="aa-locations section-pad" id="sedes" aria-labelledby="aa-locations-title"><div className="section-width"><div className="aa-section-title"><div><span className="aa-kicker"><i/> EL RESPALDO, CERCA DE TI</span><h2 id="aa-locations-title">Nos vemos<br/><em>en el siguiente destino.</em></h2></div><p>Elige tu sede, consulta sus servicios<br/>y deja que Google Maps te guíe.</p></div><div className="aa-pills aa-location-filters" aria-label="Filtrar sedes por servicio">{['Todas','Nuevos','Usados','Taller','Repuestos'].map(s=><button key={s} aria-pressed={service===s} onClick={()=>setService(s)}>{s}</button>)}</div>
    {location?<div className="aa-locations-grid"><div><div className="aa-branch-list" aria-label="Seleccionar sede">{filtered.map(l=><button key={l.name} aria-pressed={l.name===location.name} onClick={()=>setActive(l.name)}><MapPin size={19}/><span><strong>{l.name}</strong><small>{l.city} · {l.services}</small></span><ArrowUpRight size={17}/></button>)}</div><article className="aa-branch-details" aria-live="polite"><span className="aa-kicker">AUTOAMÉRICA {location.area.toUpperCase()}</span><h3>{location.name}</h3><p><MapPin size={16}/>{location.address}</p><p><Clock size={16}/>{location.hours}</p><a className="button red" href={mapLinks(location).directions} target="_blank" rel="noreferrer"><Navigation size={16}/> Cómo llegar</a></article></div><EmbeddedMap location={location}/></div>:<p>No hay sedes con este servicio.</p>}
    <div className="aa-locations-foot"><p>Confirma los horarios por servicio antes de tu visita. El punto exacto debe validarse con cada sede.</p><a href="https://autoamerica.com.co/sedes-y-horarios/" target="_blank" rel="noreferrer">Directorio oficial <ArrowUpRight size={15}/></a></div>
  </div></section>;
}
