import express from 'express';
import { randomUUID } from 'node:crypto';
import {
  openDatabase, seed, seedVideos, seedPromotions, rowToRecord, recordToColumns, validateRecord,
  rowToPromotion, promotionToColumns, validatePromotion,
} from './db.js';
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

router.get('/promotions', (req, res) => {
  const wantsAll = String(req.query?.all || '') === '1';
  if (wantsAll && !getSessionUser(db, sessionToken(req))) return res.status(401).json({ error: 'Sesión requerida.' });
  const rows = wantsAll
    ? db.prepare('SELECT * FROM promotions ORDER BY sort ASC, updated_at DESC').all()
    : db.prepare('SELECT * FROM promotions WHERE active = 1 ORDER BY sort ASC, updated_at DESC').all();
  res.json(rows.map(rowToPromotion));
});

router.post('/promotions', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  const error = validatePromotion(req.body);
  if (error) return res.status(400).json({ error });
  const id = String(req.body?.id || '').trim() || randomUUID();
  if (id.length > 80) return res.status(400).json({ error: 'El identificador es demasiado largo.' });
  const columns = promotionToColumns({ ...req.body, id });
  const now = Date.now();
  const exists = db.prepare('SELECT id FROM promotions WHERE id = ?').get(columns.id);
  if (exists) {
    db.prepare(`UPDATE promotions SET title=?,body=?,badge=?,image=?,cta_label=?,cta_url=?,expires=?,active=?,sort=?,updated_at=? WHERE id=?`)
      .run(columns.title, columns.body, columns.badge, columns.image, columns.cta_label, columns.cta_url,
        columns.expires, columns.active, columns.sort, now, columns.id);
  } else {
    db.prepare(`INSERT INTO promotions (id,title,body,badge,image,cta_label,cta_url,expires,active,sort,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(columns.id, columns.title, columns.body, columns.badge, columns.image, columns.cta_label,
        columns.cta_url, columns.expires, columns.active, columns.sort, now);
  }
  res.status(201).json(rowToPromotion(db.prepare('SELECT * FROM promotions WHERE id = ?').get(columns.id)));
});

router.put('/promotions/:id', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  if (String(req.params.id) !== String(req.body?.id)) return res.status(400).json({ error: 'El id no coincide.' });
  const error = validatePromotion(req.body);
  if (error) return res.status(400).json({ error });
  const exists = db.prepare('SELECT id FROM promotions WHERE id = ?').get(req.params.id);
  if (!exists) return res.status(404).json({ error: 'Promoción no encontrada.' });
  const columns = promotionToColumns(req.body);
  db.prepare(`UPDATE promotions SET title=?,body=?,badge=?,image=?,cta_label=?,cta_url=?,expires=?,active=?,sort=?,updated_at=? WHERE id=?`)
    .run(columns.title, columns.body, columns.badge, columns.image, columns.cta_label, columns.cta_url,
      columns.expires, columns.active, columns.sort, Date.now(), columns.id);
  res.json(rowToPromotion(db.prepare('SELECT * FROM promotions WHERE id = ?').get(columns.id)));
});

router.delete('/promotions/:id', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  db.prepare('DELETE FROM promotions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.post('/promotions/reset', auth, (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido.' });
  db.prepare('DELETE FROM promotions').run();
  seedPromotions(db);
  res.json(db.prepare('SELECT * FROM promotions ORDER BY sort ASC, updated_at DESC').all().map(rowToPromotion));
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


