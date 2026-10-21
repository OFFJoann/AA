import express from 'express';
import { openDatabase, seed, seedVideos, rowToRecord, recordToColumns, validateRecord } from './db.js';
import {
  verifyPassword, createSession, getSessionUser, destroySession,
  sessionToken, sessionCookie, clearedCookie, requireAuth, sameOrigin,
} from './auth.js';

let db = openDatabase();
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));

const router = express.Router();
const auth = requireAuth(db);

router.get('/health', (_req, res) => { res.json({ ok: true, service: 'autoamerica-crm-api' }); });

router.post('/auth/login', (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  const email = String(req.body?.email || '').toLowerCase().trim();
  const password = String(req.body?.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }
  const { token } = createSession(db, user.id);
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post('/auth/logout', (req, res) => {
  destroySession(db, sessionToken(req));
  res.setHeader('Set-Cookie', clearedCookie);
  res.json({ ok: true });
});

router.get('/auth/session', (req, res) => {
  const user = getSessionUser(db, sessionToken(req));
  if (!user) return res.status(401).json({ error: 'Sesión requerida.' });
  res.json({ user });
});

router.get('/catalog', (_req, res) => {
  const rows = db.prepare('SELECT * FROM catalog ORDER BY kind, name').all();
  res.json(rows.map(rowToRecord));
});

router.post('/catalog', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  const record = req.body;
  const error = validateRecord(record);
  if (error) return res.status(400).json({ error });
  const columns = recordToColumns({ ...record, origin: 'marketing' });
  const exists = db.prepare('SELECT id FROM catalog WHERE id = ?').get(columns.id);
  const now = Date.now();
  if (exists) {
    db.prepare(`UPDATE catalog SET kind=?,status=?,name=?,category=?,power=?,year=?,price=?,mileage=?,transmission=?,location=?,image=?,description=?,tag=?,url=?,availability=?,origin=?,brand=?,model=?,body_type=?,certified=?,updated_at=? WHERE id=?`)
      .run(columns.kind, columns.status, columns.name, columns.category, columns.power, columns.year,
        columns.price, columns.mileage, columns.transmission, columns.location, columns.image,
        columns.description, columns.tag, columns.url, columns.availability, columns.origin,
        columns.brand, columns.model, columns.body_type, columns.certified, now, columns.id);
  } else {
    db.prepare(`INSERT INTO catalog (id,kind,status,name,category,power,year,price,mileage,transmission,location,image,description,tag,url,availability,origin,brand,model,body_type,certified,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(columns.id, columns.kind, columns.status, columns.name, columns.category, columns.power,
        columns.year, columns.price, columns.mileage, columns.transmission, columns.location,
        columns.image, columns.description, columns.tag, columns.url, columns.availability,
        columns.origin, columns.brand, columns.model, columns.body_type, columns.certified, now);
  }
  res.status(201).json(rowToRecord(db.prepare('SELECT * FROM catalog WHERE id = ?').get(columns.id)));
});

router.put('/catalog/:id', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  if (String(req.params.id) !== String(req.body?.id)) return res.status(400).json({ error: 'El id no coincide.' });
  const error = validateRecord(req.body);
  if (error) return res.status(400).json({ error });
  const exists = db.prepare('SELECT id FROM catalog WHERE id = ?').get(req.params.id);
  if (!exists) return res.status(404).json({ error: 'Registro no encontrado.' });
  const columns = recordToColumns({ ...req.body, origin: 'marketing' });
  db.prepare(`UPDATE catalog SET kind=?,status=?,name=?,category=?,power=?,year=?,price=?,mileage=?,transmission=?,location=?,image=?,description=?,tag=?,url=?,availability=?,origin=?,brand=?,model=?,body_type=?,certified=?,updated_at=? WHERE id=?`)
    .run(columns.kind, columns.status, columns.name, columns.category, columns.power, columns.year,
      columns.price, columns.mileage, columns.transmission, columns.location, columns.image,
      columns.description, columns.tag, columns.url, columns.availability, columns.origin,
      columns.brand, columns.model, columns.body_type, columns.certified, Date.now(), columns.id);
  res.json(rowToRecord(db.prepare('SELECT * FROM catalog WHERE id = ?').get(columns.id)));
});

router.delete('/catalog/:id', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  db.prepare('DELETE FROM catalog WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.post('/catalog/reset', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  db.prepare('DELETE FROM catalog').run();
  db.prepare('DELETE FROM videos').run();
  seed(db);
  res.json(db.prepare('SELECT * FROM catalog ORDER BY kind, name').all().map(rowToRecord));
});

router.get('/videos', (_req, res) => {
  const rows = db.prepare('SELECT vehicle_id, url FROM videos').all();
  const map = {};
  for (const row of rows) map[row.vehicle_id] = row.url;
  res.json(map);
});

router.put('/videos/:id', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  const id = String(req.params.id);
  const url = String(req.body?.url ?? '').trim();
  if (url) {
    let parsed;
    try { parsed = new URL(url); } catch { return res.status(400).json({ error: 'La URL no es válida.' }); }
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Solo se permiten URLs http/https.' });
    if (url.length > 2000) return res.status(400).json({ error: 'La URL es demasiado larga.' });
    db.prepare(`INSERT INTO videos (vehicle_id,url,updated_at) VALUES (?,?,?)
      ON CONFLICT(vehicle_id) DO UPDATE SET url=excluded.url, updated_at=excluded.updated_at`)
      .run(id, url, Date.now());
  } else {
    db.prepare('DELETE FROM videos WHERE vehicle_id = ?').run(id);
  }
  res.json({ id, url });
});

router.post('/videos/reset', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  db.prepare('DELETE FROM videos').run();
  seedVideos(db);
  const rows = db.prepare('SELECT vehicle_id, url FROM videos').all();
  const map = {};
  for (const row of rows) map[row.vehicle_id] = row.url;
  res.json(map);
});

app.use('/api', router);
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => console.log(`[api] escuchando en :${port}`));


