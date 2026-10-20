#!/usr/bin/env node
/** Usage: node scripts/inspeccionar-glb.mjs "C:\Activos\modelo.glb"
 * Reads only the specified local file and writes a JSON summary to stdout. No outputs saved by this program. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { inspectGlb } from './lib/glb-inspector.mjs';
try {
  if(process.argv.length!==3)throw new Error('Uso: node scripts/inspeccionar-glb.mjs "RUTA_LOCAL_DEL_MODELO.glb"');
  const file=process.argv[2],stat=fs.lstatSync(file);
  if(stat.isSymbolicLink()||!stat.isFile()||stat.size>128*1024*1024)throw new Error('Debe ser un archivo normal de hasta 128 MB.');
  const bytes=fs.readFileSync(file),report=inspectGlb(bytes);
  console.log(JSON.stringify({...report,sha256:crypto.createHash('sha256').update(bytes).digest('hex')},null,2));
} catch(e){console.error('NO VALIDADO: '+e.message);process.exitCode=1;}
