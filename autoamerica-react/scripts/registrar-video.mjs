#!/usr/bin/env node
/** Local import ONLY. Does not download Toyota assets or infer usage rights. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { approvedVideo } from '../src/lib/vehicleBackground.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const allowed=new Set(['--model','--file','--source-page','--year','--variant','--reviewer','--approval','--apply','--replace']);
const argv=process.argv.slice(2),options={};
try {
 for(let i=0;i<argv.length;i++) {
  const key=argv[i]; if(!allowed.has(key)||key in options) throw new Error('Opcion desconocida o duplicada: '+key);
  if(key==='--apply'||key==='--replace')options[key]=true;
  else { const next=argv[++i]; if(!next||next.startsWith('--'))throw new Error('Falta valor para '+key); options[key]=next; }
 }
 for(const flag of ['--model','--file','--source-page','--year','--variant','--reviewer','--approval'])if(!options[flag])throw new Error('Requerido '+flag);
 const configFile=path.join(root,'public','media','vehicle-backgrounds.json');
 const before=fs.readFileSync(configFile),registry=JSON.parse(before);
 const model=options['--model'];
 if(!Object.hasOwn(registry.models,model))throw new Error('Modelo no admitido; consulta vehicle-backgrounds.json.');
 const input=path.resolve(options['--file']);
 if(fs.lstatSync(input).isSymbolicLink()||!fs.statSync(input).isFile())throw new Error('El origen debe ser un archivo local normal.');
 const ext=path.extname(input).toLowerCase();
 if(!['.mp4','.webm'].includes(ext))throw new Error('Solo MP4 o WebM. Una pagina de Toyota o enlace YouTube no es un archivo de video.');
 const size=fs.statSync(input).size;
 if(size<32||size>30*1024*1024)throw new Error('Video vacio o mayor de 30 MB. Optimiza un clip corto antes de importarlo.');
 const bytes=fs.readFileSync(input);
 const plausible=ext==='.mp4'?bytes.subarray(4,8).toString()==='ftyp':bytes.subarray(0,4).toString('hex')==='1a45dfa3';
 if(!plausible)throw new Error('El encabezado no coincide con el contenedor MP4/WebM.');
 const digest=crypto.createHash('sha256').update(bytes).digest('hex');
 const src=`/media/videos/${model}-${digest.slice(0,12)}${ext}`;
 const entry={modelId:model,src,mime:ext==='.mp4'?'video/mp4':'video/webm',sourcePage:options['--source-page'],market:'CO',modelYear:Number(options['--year']),variant:options['--variant'],reviewedBy:options['--reviewer'],reviewedAt:new Date().toISOString().slice(0,10),approvalReference:options['--approval'],approved:true,matchesColombia:true};
 if(!approvedVideo(entry,model))throw new Error('Metadatos no validos. Revisa modelo, URL oficial, ano, version y referencias.');
 if(registry.models[model].video?.src && registry.models[model].video.src!==src&&!options['--replace'])throw new Error('Ya existe otro video. Revisa y usa --replace solo para reemplazarlo intencionalmente.');
 console.log(`Modelo: ${model}; archivo: ${size} bytes; SHA256: ${digest}`);
 console.log('Declaracion requerida: el revisor confirma correspondencia con la version colombiana y autorizacion comercial, incluidas edicion y uso web. El programa NO lo verifica visual ni legalmente.');
 if(!options['--apply']){console.log('SOLO VALIDACION. No se copio ni modifico nada.');process.exit(0);}
 const destination=path.join(root,'public',src.slice(1));
 const mediaDir=path.dirname(destination);
 for(const p of [root,path.join(root,'public'),path.join(root,'public','media'),mediaDir]) if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw new Error('No se permiten enlaces simbolicos en la ruta de destino.');
 if(fs.existsSync(destination)&&(!fs.statSync(destination).isFile()||crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex')!==digest))throw new Error('Conflicto en archivo de destino.');
 const backupParent=path.resolve(root,'..','..','AA-media-respaldos');
 fs.mkdirSync(backupParent,{recursive:true});
 const backup=fs.mkdtempSync(path.join(backupParent,'media-'));
 fs.writeFileSync(path.join(backup,'vehicle-backgrounds.json'),before,{flag:'wx'});
 fs.mkdirSync(mediaDir,{recursive:true});
 const newlyCopied=!fs.existsSync(destination);
 if(newlyCopied)fs.copyFileSync(input,destination,fs.constants.COPYFILE_EXCL);
 registry.models[model].video=entry; registry.models[model].status='reviewed-by-team';
 const temp=configFile+'.'+crypto.randomUUID()+'.tmp';
 try { fs.writeFileSync(temp,JSON.stringify(registry,null,2)+'\n',{flag:'wx'}); if(!fs.readFileSync(configFile).equals(before))throw new Error('El registro cambio durante la importacion.'); fs.renameSync(temp,configFile); }
 catch(e){if(fs.existsSync(temp))fs.unlinkSync(temp);if(newlyCopied)fs.unlinkSync(destination);throw e;}
 console.log('Importacion local completada. Respaldo: '+backup);
 console.log('Reinicia Vite, prueba video y pausa, y revisa git diff. No se hizo commit ni push.');
} catch(error){console.error('DETENIDO: '+error.message); process.exitCode=1;}
