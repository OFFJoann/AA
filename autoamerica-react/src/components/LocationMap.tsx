import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { locations } from '../data';

function EmbeddedMap({ src, title }: { src: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div className="map-embed" ref={host}>
    {visible && <iframe key={attempt} src={src} title={title} onLoad={() => setLoaded(true)} allowFullScreen referrerPolicy="no-referrer-when-downgrade"/>}
    {!loaded && <div className="map-loading" role="status"><MapPin size={24}/><strong>Cargando ubicación en Google Maps…</strong><span>Necesitas conexión a internet para ver el mapa.</span><button onClick={() => { setVisible(true); setAttempt(value => value + 1); }}>Reintentar carga</button></div>}
  </div>;
}

export default function LocationMap() {
  const [active, setActive] = useState(0);
  const location = locations[active];
  // Geocode the published street address. Adding the brand and service notes
  // can make Maps return a general business search instead of a location pin.
  const query = encodeURIComponent(`${location.address.split(' · ')[0]}, ${location.city}, Colombia`);
  const mapUrl = `https://www.google.com/maps?q=${query}&z=16&output=embed&hl=es`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  return <section className="locations-section section-pad" id="sedes">
    <div className="section-width location-grid">
      <div className="location-copy">
        <span className="eyebrow"><span className="section-number">05</span> SIEMPRE CERCA</span>
        <h2>Tu próximo destino.<br/>Estamos cerca.</h2>
        <p>Elige una sede, explora sus alrededores y encuentra la ruta para visitarnos.</p>
        <div className="location-tabs" aria-label="Seleccionar sede">
          {locations.map((item, index) => <button key={item.name} onClick={() => setActive(index)} className={index === active ? 'active' : ''} aria-pressed={index === active}>{item.name}</button>)}
        </div>
        <div className="location-details" aria-live="polite">
          <span className="eyebrow red-text">{location.area}</span>
          <h3>{location.name}</h3>
          <p><MapPin size={17}/>{location.address}</p>
          <span className="location-services">{location.services}</span>
          <p className="hours">{location.hours}</p>
          <a href={directions} target="_blank" rel="noreferrer" className="button red"><Navigation size={16}/> Cómo llegar</a>
        </div>
        <a href="https://autoamerica.com.co/sedes-y-horarios/" className="location-source" target="_blank" rel="noreferrer">Consultar horarios por servicio en Autoamérica <ArrowUpRight size={14}/></a>
      </div>
      <div className="real-map-card">
        <div className="real-map-heading"><span><MapPin size={16}/> {location.name}</span><small>{location.city}, Antioquia</small></div>
        <EmbeddedMap key={location.name} src={mapUrl} title={`Mapa de Autoamérica ${location.name}, ${location.address}`}/>
        <div className="real-map-footer"><span>Explora el mapa con zoom y arrastre.</span><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Abrir Google Maps <ArrowUpRight size={15}/></a></div>
        <p className="map-connection-note">Si tu navegador bloquea el mapa o no tienes conexión, puedes abrir la ubicación con el enlace de Google Maps.</p>
      </div>
    </div>
  </section>;
}
