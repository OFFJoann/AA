import { vehicles as referenceVehicles } from './data';
import usedSnapshot from '../public/used-vehicles.json';
import type { Vehicle } from './data';

export type CatalogKind = 'new' | 'used';
export type CatalogRecord = {
  id: string;
  kind: CatalogKind;
  status: 'draft' | 'published' | 'withdrawn';
  name: string;
  category: string;
  power: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  location: string;
  image: string;
  description: string;
  tag: string;
  url: string;
  availability: 'confirm' | 'available' | 'reserved' | 'sold';
  origin: 'reference' | 'marketing';
};

export type UsedVehicle = {
  id: string; name: string; year: number; mileage: number; price: number;
  transmission: string; location: string; image: string; url: string;
  category?: string; origin?: CatalogRecord['origin'];
};

/** The reference data are public snapshots. Administration edits remain in this tab. */
export function createInitialCatalog(): CatalogRecord[] {
  const fresh: CatalogRecord[] = referenceVehicles.map(vehicle => ({
    ...vehicle, id: `new:${vehicle.id}`, kind: 'new', status: 'published',
    year: 0, price: 0, mileage: 0, transmission: 'Por confirmar',
    location: 'Palacé', availability: 'confirm', origin: 'reference',
  }));
  const used: CatalogRecord[] = usedSnapshot.map(vehicle => ({
    ...vehicle, id: `used:${vehicle.id}`, kind: 'used', status: 'published',
    category: 'SUV', power: vehicle.name.includes('HEV') ? 'Híbrido' : 'Gasolina',
    description: 'Vehículo de la muestra pública de Autoamérica. Confirma su estado y disponibilidad con un asesor.',
    tag: 'UNA NUEVA HISTORIA TE ESPERA', availability: 'confirm', origin: 'reference',
  }));
  return [...fresh, ...used];
}

export function isPublished(record: CatalogRecord) {
  return record.status === 'published' && record.availability !== 'sold';
}

export function toNewVehicle(record: CatalogRecord): Vehicle {
  return {
    id: record.id, name: record.name, category: record.category, power: record.power,
    image: record.image, description: record.description, url: record.url, tag: record.tag,
    price: record.price, year: record.year, location: record.location,
    transmission: record.transmission, origin: record.origin,
  };
}

export function toUsedVehicle(record: CatalogRecord): UsedVehicle {
  return {
    id: record.id, name: record.name, year: record.year, mileage: record.mileage,
    price: record.price, transmission: record.transmission, location: record.location,
    image: record.image, url: record.url,
    category: record.origin === 'marketing' ? 'Demo de mercadeo' : 'Usado Toyota',
    origin: record.origin,
  };
}
