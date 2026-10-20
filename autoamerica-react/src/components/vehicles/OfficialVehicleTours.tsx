import { ExternalLink, RotateCcw } from 'lucide-react';
import { officialTours } from '../../data/vehicleBackgrounds';
import { modelKey } from '../../lib/vehicleBackground';
export default function OfficialVehicleTours({ id, origin }: { id: string; origin?: string }) {
  const key = modelKey(id, origin);
  const tour = key ? officialTours[key] : undefined;
  if (!tour) return null;
  return <aside className="aa-official-tours" aria-label="Referencias de vistas de Toyota">
    <span className="aa-official-tours-title"><RotateCcw size={15}/> Explora en el sitio oficial</span>
    <div><a href={tour.exterior} target="_blank" rel="noopener noreferrer">Vista exterior 360° <ExternalLink size={13}/><span className="sr-only"> en Toyota, abre otra pestaña</span></a>
      {tour.interior && <a href={tour.interior} target="_blank" rel="noopener noreferrer">Tour interior <ExternalLink size={13}/><span className="sr-only"> en Toyota, abre otra pestaña</span></a>}</div>
    <small>{tour.warning} Estos enlaces no son un visor integrado en Autoamérica.</small>
  </aside>;
}
