import { ArrowUpRight, ArrowRight, MapPin, CarFront, Search, Wrench, ShieldCheck } from 'lucide-react';
import { SiteLink } from '../navigation/SiteNavigation';
import VehicleMotionBackground from '../components/vehicles/VehicleMotionBackground';
import PromotionsSection from '../components/promotions/PromotionsSection';
import type { Promotion } from '../promotions';

const doors = [
  { href: '/nuevos', key: 'new', title: 'Vehículos nuevos', eyebrow: 'ESTRENA TU PRÓXIMO TOYOTA', text: 'Encuentra el modelo que va contigo.', action: 'Explorar modelos', Icon: CarFront },
  { href: '/usados', key: 'used', title: 'Usados', eyebrow: 'MULTIMARCA. MÁS POSIBILIDADES.', text: 'Tu próximo carro, a tu medida.', action: 'Buscar mi carro', Icon: Search },
  { href: '/posventa', key: 'service', title: 'Posventa', eyebrow: 'EL RESPALDO CONTINÚA', text: 'Taller, mantenimiento y repuestos.', action: 'Cuidar mi Toyota', Icon: Wrench },
];
export default function HomePage({ promotions }: { promotions: Promotion[] }) {
  return <div className="aa-entry" data-page="home">
    <section className="aa-entry-stage" aria-labelledby="home-title">
      <VehicleMotionBackground modelId="new:prado" poster="/assets/hero-road.webp" priority className="aa-entry-bg"/>
      <div className="aa-entry-light" aria-hidden="true"/>
      <div className="section-width aa-entry-inner">
        <div className="aa-entry-editorial">
          <span className="aa-kicker"><i/> AUTOAMÉRICA / TOYOTA</span>
          <h1 id="home-title">Cada camino.<br/><em>Un nuevo comienzo.</em></h1>
          <p>¿Qué quieres hacer hoy?</p>
        </div>
        <figure className="aa-entry-car"><img src="/assets/hero.webp" alt="Land Cruiser Prado: vista exterior de referencia de la gama" width="914" height="609" fetchPriority="high"/><figcaption>LAND CRUISER PRADO <span>Imagen de referencia · Equipamiento según versión</span></figcaption></figure>
        <nav className="aa-entry-choices" aria-label="Elige tu destino principal">
          {doors.map(({ href, key, title, eyebrow, text, action, Icon }, i) => <SiteLink key={key} href={href} className={`aa-entry-choice aa-entry-choice-${key}`}>
            <div className="aa-entry-choice-head"><span>{String(i + 1).padStart(2, '0')} / {eyebrow}</span><Icon size={24} strokeWidth={1.5}/></div>
            <h2>{title}</h2><p>{text}</p>
            <span className="aa-entry-cta">{action}<span className="aa-entry-arrow"><ArrowUpRight size={23}/></span></span>
          </SiteLink>)}
        </nav>
        <div className="aa-entry-footer"><span><ShieldCheck size={15}/> Autoamérica te acompaña.</span><SiteLink href="/sedes"><MapPin size={15}/> Encuentra tu sede <ArrowRight size={16}/></SiteLink></div>
      </div>
    </section>
    <PromotionsSection items={promotions}/>
  </div>;
}
