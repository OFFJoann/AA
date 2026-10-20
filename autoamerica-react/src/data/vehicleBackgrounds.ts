import registry from '../../public/media/vehicle-backgrounds.json';
import { approvedVideo, modelKey } from '../lib/vehicleBackground';
export function getVehicleBackground(id: string, origin?: string, variant?: string) {
  const key = modelKey(id, origin);
  if (!key) return undefined;
  const entries = registry.models as Record<string, { video: unknown }>;
  return approvedVideo(entries[key]?.video, id, origin, variant);
}
export type OfficialTour = { exterior: string; interior?: string; market: 'US' | 'CO'; warning: string };
/** External links only: no iframe, panorama files or implied Colombian fitment. */
export const officialTours: Record<string, OfficialTour> = {
  'corolla-cross': {
    exterior: 'https://www.toyota.com/corollacross/',
    interior: 'https://www.toyota.com/corollacross/interior-tour/', market: 'US',
    warning: 'Referencia de Toyota EE. UU.; versiones y equipamiento pueden diferir de Colombia.'
  },
  rav4: {
    exterior: 'https://www.toyota.com/rav4/',
    interior: 'https://www.toyota.com/rav4/interior-tour/', market: 'US',
    warning: 'Referencia de Toyota EE. UU.; versiones, generación y equipamiento pueden diferir de Colombia.'
  },

};
