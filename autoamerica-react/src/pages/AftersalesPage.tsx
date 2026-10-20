import { ArrowUpRight, Box, CalendarDays, MapPin, Wrench, CreditCard } from 'lucide-react';
import { SiteLink } from '../navigation/SiteNavigation';
export default function AftersalesPage(){
 return <div className="aa-aftersales" data-page="aftersales">
  <section className="aa-service-hero section-width"><div><span className="aa-kicker"><i/> POSVENTA AUTOAMÉRICA</span><h1>Contigo.<br/>Mucho después<br/>de la entrega.</h1><p>Todo para cuidar tu Toyota, en un solo lugar. Elige el servicio que necesitas.</p><a className="button red" href="https://autoamerica.com.co/pide-tu-cita/" target="_blank" rel="noreferrer">Agendar en el portal oficial <ArrowUpRight size={18}/></a></div><img src="/assets/taller.webp" alt="Servicio de taller de Autoamérica" width="900" height="700"/></section>
  <section className="aa-services-grid section-width" aria-label="Servicios posventa">
    <a href="https://autoamerica.com.co/mantenimiento-planeado-toyota-2/" target="_blank" rel="noreferrer"><Wrench/><h2>Taller y mantenimiento</h2><p>Consulta servicios y programa el cuidado de tu vehículo.</p><span>Ver servicio oficial <ArrowUpRight size={18}/></span></a>
    <SiteLink href="/posventa/repuestos"><Box/><h2>Repuestos y accesorios</h2><p>Explora los sistemas del vehículo y solicita asesoría para la pieza correcta.</p><span>Explorar repuestos <ArrowUpRight size={18}/></span></SiteLink>
    <SiteLink href="/sedes"><MapPin/><h2>Encuentra tu sede</h2><p>Direcciones, horarios y acceso a indicaciones de Google Maps.</p><span>Ver las sedes <ArrowUpRight size={18}/></span></SiteLink>
    <a href="https://autoamerica.com.co/pagos/" target="_blank" rel="noreferrer"><CreditCard/><h2>Pagos en línea</h2><p>Continúa en el portal oficial de Autoamérica. Aquí no procesamos pagos.</p><span>Ir al portal de pagos <ArrowUpRight size={18}/></span></a>
  </section>
  <p className="section-width aa-footnote aa-page-note"><CalendarDays size={16}/> Las citas, solicitudes y pagos se completan en los servicios oficiales enlazados, fuera de esta demostración.</p>
 </div>;
}
