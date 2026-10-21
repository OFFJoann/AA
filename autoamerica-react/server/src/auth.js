import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export const SESSION_HOURS = 8;
const COOKIE_NAME = 'aa_crm';

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, expectedHex) {
  const actual = scryptSync(String(password), salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function createSession(db, userId) {
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + SESSION_HOURS * 3600 * 1000;
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now);
  db.prepare('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)')
    .run(sha256(token), userId, expiresAt, now);
  return { token, expiresAt };
}

export function getSessionUser(db, token) {
  if (!token) return null;
  const row = db.prepare(`SELECT u.id, u.email, u.name, u.role, s.expires_at
    FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`).get(sha256(token));
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
    return null;
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export function destroySession(db, token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index > 0) out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

export const sessionToken = (req) => parseCookies(req.headers.cookie)[COOKIE_NAME];

export function sessionCookie(token) {
  const maxAge = SESSION_HOURS * 3600;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

export const clearedCookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;

export function requireAuth(db) {
  return function (req, res, next) {
    const user = getSessionUser(db, sessionToken(req));
    if (!user) return res.status(401).json({ error: 'Sesión requerida.' });
    req.user = user;
    next();
  };
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const hostUrl = new URL(`http://${req.headers.host || ''}`);
    return originUrl.hostname === hostUrl.hostname;
  } catch { return false; }
}
