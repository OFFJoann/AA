export type VehicleModelId = 'prado' | 'corolla-cross' | 'hilux' | 'yaris-cross' | 'rav4';

export interface VehicleModel {
  id: VehicleModelId;
  name: string;
  image: string;
  silhouette: 'offroad' | 'crossover' | 'pickup';
  scale: [number, number, number];
}

// Visual proportions matched to the catalog photographs, not engineering dimensions.
export const vehicleModels: VehicleModel[] = [
  { id: 'prado', name: 'Land Cruiser Prado', image: '/assets/prado.webp', silhouette: 'offroad', scale: [1, 1, .95] },
  { id: 'corolla-cross', name: 'Corolla Cross HEV', image: '/assets/corolla-cross.webp', silhouette: 'crossover', scale: [.90, .88, .87] },
  { id: 'hilux', name: 'Hilux', image: '/assets/hilux.webp', silhouette: 'pickup', scale: [1.08, .96, .89] },
  { id: 'yaris-cross', name: 'Yaris Cross HEV', image: '/assets/yaris-cross.webp', silhouette: 'crossover', scale: [.87, .85, .84] },
  { id: 'rav4', name: 'RAV4 HEV', image: '/assets/rav4.webp', silhouette: 'crossover', scale: [.94, .90, .89] },
];

export function getVehicleModel(id: VehicleModelId = 'prado'): VehicleModel {
  return vehicleModels.find(model => model.id === id) ?? vehicleModels[0];
}
