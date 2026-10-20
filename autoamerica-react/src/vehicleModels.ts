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
  { id: 'prado', name: 'Land Cruiser Prado', image: '/assets/prado.webp', silhouette: 'offroad', scale: [1, 1, 1] },
  { id: 'corolla-cross', name: 'Corolla Cross HEV', image: '/assets/corolla-cross.webp', silhouette: 'crossover', scale: [0.88, 0.88, 0.92] },
  { id: 'hilux', name: 'Hilux', image: '/assets/hilux.webp', silhouette: 'pickup', scale: [1.04, 1, 0.96] },
  { id: 'yaris-cross', name: 'Yaris Cross HEV', image: '/assets/yaris-cross.webp', silhouette: 'crossover', scale: [0.83, 0.84, 0.88] },
  { id: 'rav4', name: 'RAV4 HEV', image: '/assets/rav4.webp', silhouette: 'crossover', scale: [0.91, 0.90, 0.94] },
];

export function getVehicleModel(id: VehicleModelId = 'prado'): VehicleModel {
  return vehicleModels.find(model => model.id === id) ?? vehicleModels[0];
}
