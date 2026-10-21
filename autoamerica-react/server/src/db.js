import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './auth.js';

const seedDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'seed');

export function openDatabase() {
  const path = process.env.DATABASE_PATH || join(seedDir, '..', 'data', 'app.db');
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS catalog (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      status TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      power TEXT NOT NULL,
      year INTEGER NOT NULL DEFAULT 0,
      price INTEGER NOT NULL DEFAULT 0,
      mileage INTEGER NOT NULL DEFAULT 0,
      transmission TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      availability TEXT NOT NULL DEFAULT 'confirm',
      origin TEXT NOT NULL DEFAULT 'marketing',
      brand TEXT,
      model TEXT,
      body_type TEXT,
      certified INTEGER,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS videos (
      vehicle_id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  seed(db);
  return db;
}

export function seed(db) {
  const now = Date.now();
  const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (userCount === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@autoamerica.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'autoamerica2026';
    const name = process.env.ADMIN_NAME || 'Administrador';
    const { salt, hash } = hashPassword(password);
    db.prepare('INSERT INTO users (email,name,role,password_hash,salt,created_at) VALUES (?,?,?,?,?,?)')
      .run(email, name, 'admin', hash, salt, now);
    console.log(`[seed] usuario admin creado: ${email}`);
  }
  const catalogCount = db.prepare('SELECT COUNT(*) AS n FROM catalog').get().n;
  if (catalogCount === 0) {
    const records = JSON.parse(readFileSync(join(seedDir, 'catalog.json'), 'utf8'));
    const insert = db.prepare(`INSERT INTO catalog
      (id,kind,status,name,category,power,year,price,mileage,transmission,location,image,description,tag,url,availability,origin,brand,model,body_type,certified,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    for (const r of records) {
      insert.run(r.id, r.kind, r.status, r.name, r.category, r.power, r.year ?? 0, r.price ?? 0,
        r.mileage ?? 0, r.transmission ?? '', r.location ?? '', r.image ?? '', r.description ?? '',
        r.tag ?? '', r.url ?? '', r.availability ?? 'confirm', r.origin ?? 'marketing',
        r.brand ?? null, r.model ?? null, r.bodyType ?? null,
        typeof r.certified === 'boolean' ? (r.certified ? 1 : 0) : null, now);
    }
    console.log(`[seed] catálogo inicial: ${records.length} registros`);
  }
  const videoCount = db.prepare('SELECT COUNT(*) AS n FROM videos').get().n;
  if (videoCount === 0) seedVideos(db);
}

export function seedVideos(db) {
  const now = Date.now();
  const defaults = JSON.parse(readFileSync(join(seedDir, 'videos.json'), 'utf8'));
  const insert = db.prepare('INSERT INTO videos (vehicle_id,url,updated_at) VALUES (?,?,?)');
  for (const [id, url] of Object.entries(defaults)) insert.run(id, url, now);
}

export function rowToRecord(row) {
  return {
    id: row.id, kind: row.kind, status: row.status, name: row.name, category: row.category,
    power: row.power, year: row.year, price: row.price, mileage: row.mileage,
    transmission: row.transmission, location: row.location, image: row.image,
    description: row.description, tag: row.tag, url: row.url, availability: row.availability,
    origin: row.origin, brand: row.brand ?? undefined, model: row.model ?? undefined,
    bodyType: row.body_type ?? undefined, certified: row.certified == null ? undefined : row.certified === 1,
  };
}

export function recordToColumns(record) {
  return {
    id: String(record.id), kind: record.kind, status: record.status, name: record.name,
    category: record.category, power: record.power, year: Number(record.year) || 0,
    price: Number(record.price) || 0, mileage: Number(record.mileage) || 0,
    transmission: record.transmission ?? '', location: record.location ?? '', image: record.image ?? '',
    description: record.description ?? '', tag: record.tag ?? '', url: record.url ?? '',
    availability: record.availability, origin: record.origin,
    brand: record.brand ?? null, model: record.model ?? null,
    body_type: record.bodyType ?? null,
    certified: typeof record.certified === 'boolean' ? (record.certified ? 1 : 0) : null,
  };
}

export function validateRecord(record) {
  if (!record || typeof record !== 'object') return 'Solicitud vacía.';
  if (!['new', 'used'].includes(record.kind)) return 'El tipo debe ser new o used.';
  for (const field of ['name', 'category', 'power', 'location', 'description']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) return `El campo ${field} es obligatorio.`;
  }
  if (!['draft', 'published', 'withdrawn'].includes(record.status)) return 'Estado editorial no válido.';
  if (!['confirm', 'available', 'reserved', 'sold'].includes(record.availability)) return 'Disponibilidad no válida.';
  for (const field of ['year', 'price', 'mileage']) {
    const value = Number(record[field]);
    if (!Number.isFinite(value) || value < 0) return `El campo ${field} debe ser un número mayor o igual a cero.`;
  }
  return null;
}
