import { ArrowDown,ArrowUpRight,Compass,Search } from 'lucide-react';
import type { Vehicle } from '../../data';
export default function LandingHero({featured,onDiscover,onQuote}:{featured?:Vehicle;onDiscover:(v:Vehicle)=>void;onQuote:(s:string)=>void}) {
  return <>
    <section className="aa-hero" id="inicio" aria-labelledby="aa-hero-title">
      <img className="aa-hero-photo" src="/assets/hero.webp" alt="Toyota Land Cruiser Prado 250, fotografía de la publicación oficial de Autoamérica" fetchPriority="high" width="914" height="609"/>
      <div className="aa-hero-vignette"/>
      <div className="aa-hero-grid" aria-hidden="true"/>
      <div className="section-width aa-hero-inner">
        <div className="aa-hero-copy"><span className="aa-kicker"><i/> TOYOTA TE LLEVA. AUTOAMÉRICA TE ACOMPAÑA.</span>
          <h1 id="aa-hero-title">No sigas<br/>el camino.<br/><em>Siéntelo.</em></h1>
          <p>Hay destinos que se eligen.<br/>Y vehículos que te hacen ir más allá.</p>
          <div className="aa-hero-actions"><a className="button red" href="#modelos">Encuentra tu Toyota <ArrowUpRight size={20}/></a><button className="aa-hero-text" onClick={()=>onQuote('Prueba de manejo Toyota')}>Vívelo al volante <ArrowUpRight size={17}/></button></div>
        </div>
        <div className="aa-hero-caption"><span>ESPÍRITU DE AVENTURA</span><strong>Land Cruiser Prado</strong><button onClick={()=>featured?onDiscover(featured):document.getElementById('modelos')?.scrollIntoView()} aria-label="Descubrir Land Cruiser Prado"><ArrowUpRight size={26}/></button></div>
        <div className="aa-hero-foot"><a href="#modelos"><ArrowDown size={17}/> DESLIZA. TU HISTORIA EMPIEZA AQUÍ.</a><span>FOTOGRAFÍA COMERCIAL DE REFERENCIA · AUTOAMÉRICA</span></div>
      </div>
      <span className="aa-hero-watermark" aria-hidden="true">EXPLORA.</span>
    </section>
    <div className="aa-journeys section-width"><a href="#modelos"><span className="aa-journey-num">01</span><span><small>DISEÑADO PARA LO QUE VIENE</small><strong>Quiero un Toyota nuevo</strong></span><ArrowUpRight/></a><a href="#usados"><span className="aa-journey-num">02</span><span><small>TU PRÓXIMA HISTORIA</small><strong>Busco un usado multimarca</strong></span><Search/></a><a href="#servicios"><span className="aa-journey-num">03</span><span><small>EL RESPALDO QUE CONOCES</small><strong>Cuido mi camino</strong></span><Compass/></a></div>
  </>;
}
