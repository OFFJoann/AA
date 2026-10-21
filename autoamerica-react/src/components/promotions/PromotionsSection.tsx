import { useEffect, useRef } from 'react';
import { ArrowUpRight, CalendarClock } from 'lucide-react';
import { SiteLink } from '../../navigation/SiteNavigation';
import type { Promotion } from '../../promotions';

export default function PromotionsSection({ items }: { items: Promotion[] }) {
  const section = useRef<HTMLElement>(null);
  const active = items.filter(item => item.active);
  useEffect(() => {
    if (!active.length || window.location.hash !== '#promociones') return;
    section.current?.scrollIntoView({ behavior: 'instant' });
  }, [active.length]);
  if (!active.length) return null;
  return <section id="promociones" ref={section} className="aa-promos" aria-labelledby="promos-title">
    <div className="section-width">
      <header className="aa-promos-head">
        <span className="aa-kicker"><i/> PROMOCIONES / VIGENTES</span>
        <h2 id="promos-title">Beneficios para<br/>tu próximo camino.</h2>
      </header>
      <div className="aa-promos-grid">
        {active.map(promotion => <article className="aa-promo" key={promotion.id}>
          {promotion.image && <div className="aa-promo-media"><img src={promotion.image} alt={promotion.title} loading="lazy"/></div>}
          <div className="aa-promo-body">
            {promotion.badge && <span className="aa-promo-badge">{promotion.badge}</span>}
            <h3>{promotion.title}</h3>
            {promotion.text && <p>{promotion.text}</p>}
            {promotion.expires && <span className="aa-promo-expires"><CalendarClock size={14}/> {promotion.expires}</span>}
            {promotion.ctaLabel && promotion.ctaUrl && (promotion.ctaUrl.startsWith('/')
              ? <SiteLink className="aa-promo-cta" href={promotion.ctaUrl}>{promotion.ctaLabel} <ArrowUpRight size={17}/></SiteLink>
              : <a className="aa-promo-cta" href={promotion.ctaUrl} target="_blank" rel="noreferrer">{promotion.ctaLabel} <ArrowUpRight size={17}/></a>)}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
