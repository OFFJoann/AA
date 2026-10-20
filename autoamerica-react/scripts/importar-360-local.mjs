/** Copy the user's existing 36 frames, offline, with preflight and no overwrite. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const FRAME_NAMES = Object.freeze(Array.from({ length: 36 }, (_, i) =>
  `frame-${String(i + 1).padStart(2, '0')}.jpg`));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const SOF = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);

export function jpegDimensions(data) {
  if (data.length < 12 || data[0] !== 0xff || data[1] !== 0xd8)
    throw new Error('No es un archivo JPEG con cabecera valida.');
  let offset = 2;
  while (offset < data.length) {
    if (data[offset++] !== 0xff) throw new Error('Marcador JPEG invalido.');
    while (data[offset] === 0xff) offset++;
    const marker = data[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > data.length) throw new Error('JPEG incompleto.');
    const length = data.readUInt16BE(offset);
    if (length < 2 || offset + length > data.length) throw new Error('Segmento JPEG truncado.');
    if (SOF.has(marker)) {
      if (length < 8) throw new Error('Cabecera de dimensiones incompleta.');
      return { width: data.readUInt16BE(offset + 5), height: data.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  throw new Error('No se localizaron las dimensiones del JPEG.');
}

function assertNoSymlink(target) {
  let current = path.resolve(target);
  while (true) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink())
      throw new Error(`No se admiten enlaces simbolicos en esta operacion: ${current}`);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

/** Dimension checks inspect the JPEG header; they do not establish model or rights. */
export function inspectFrames(source, destination) {
  source = path.resolve(source);
  destination = path.resolve(destination);
  assertNoSymlink(source);
  assertNoSymlink(destination);
  if (source === destination) throw new Error('Origen y destino deben ser carpetas diferentes.');
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory())
    throw new Error(`No existe la carpeta de origen: ${source}`);
  if (fs.existsSync(destination) && !fs.statSync(destination).isDirectory())
    throw new Error('El destino existe pero no es una carpeta.');
  const entries = FRAME_NAMES.map(name => {
    const file = path.join(source, name);
    if (!fs.existsSync(file)) throw new Error(`Falta ${name}. No se copio ningun archivo.`);
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Origen no regular: ${name}`);
    if (stat.size < 12 || stat.size > 20 * 1024 * 1024) throw new Error(`Tamano inesperado: ${name}`);
    const bytes = fs.readFileSync(file);
    const { width, height } = jpegDimensions(bytes);
    if (width !== 1600 || height !== 606)
      throw new Error(`${name}: ${width}x${height}; se esperan 1600x606. No se copio nada.`);
    const sha256 = hash(bytes);
    const target = path.join(destination, name);
    let action = 'copiar';
    if (fs.existsSync(target)) {
      if (!fs.lstatSync(target).isFile() || fs.lstatSync(target).isSymbolicLink())
        throw new Error(`Destino no regular: ${name}`);
      if (hash(fs.readFileSync(target)) !== sha256)
        throw new Error(`CONFLICTO: ${name} ya existe con otro contenido. No se sobrescribe.`);
      action = 'conservar';
    }
    return { name, width, height, bytes: bytes.length, sha256, action };
  });
  return { source, destination, entries, distinctFiles: new Set(entries.map(e => e.sha256)).size };
}

export function importFrames(source, destination, apply = false) {
  const plan = inspectFrames(source, destination);
  if (!apply) return { ...plan, applied: false, copied: 0 };
  const created = [];
  try {
    fs.mkdirSync(plan.destination, { recursive: true });
    for (const entry of plan.entries) {
      if (entry.action === 'conservar') continue;
      const bytes = fs.readFileSync(path.join(plan.source, entry.name));
      if (hash(bytes) !== entry.sha256) throw new Error(`El origen cambio: ${entry.name}`);
      const target = path.join(plan.destination, entry.name);
      fs.writeFileSync(target, bytes, { flag: 'wx' });
      created.push({ target, sha256: entry.sha256 });
    }
    return { ...plan, applied: true, copied: created.length };
  } catch (error) {
    // Undo only files created by this invocation, and only if still unchanged.
    for (const entry of created.reverse()) {
      if (fs.existsSync(entry.target) && hash(fs.readFileSync(entry.target)) === entry.sha256)
        fs.unlinkSync(entry.target);
    }
    throw error;
  }
}

function main() {
  const args = process.argv.slice(2);
  let source;
  let apply = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1] && !args[i + 1].startsWith('--')) source = args[++i];
    else if (args[i] === '--apply') apply = true;
    else throw new Error('Uso: node scripts/importar-360-local.mjs --source "CARPETA_HD" [--apply]');
  }
  if (!source) throw new Error('Falta --source "CARPETA_HD". No se modifico nada.');
  const destination = fileURLToPath(new URL('../public/assets/360/corolla-cross/', import.meta.url));
  const result = importFrames(source, destination, apply);
  console.log(`Imagenes verificadas por cabecera: ${result.entries.length}/36 a 1600x606.`);
  console.log(`Archivos distintos SHA-256: ${result.distinctFiles}/36.`);
  if (result.distinctFiles !== 36) console.warn('AVISO: hay duplicados; revisar continuidad visual.');
  console.log(`Destino: ${result.destination}`);
  console.log(apply ? `COPIADAS: ${result.copied}. IDENTICAS CONSERVADAS: ${36-result.copied}.` : 'SOLO VALIDACION. No se escribio nada. Para copiar: --apply');
  console.log('No se alteraron los originales ni se ejecuto Git. No se valida equivalencia CO ni permiso comercial.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
