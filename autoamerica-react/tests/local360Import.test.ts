import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FRAME_NAMES, jpegDimensions, inspectFrames, importFrames } from '../scripts/importar-360-local.mjs';

// Synthetic JPEG headers for parser tests, NOT vehicle images or rendering fixtures.
function jpeg(width=1600,height=606,tag=0){
  const out=Buffer.from([0xff,0xd8,0xff,0xe0,0,3,tag,0xff,0xc0,0,8,8,0,0,0,0,0,0xff,0xd9]);
  out.writeUInt16BE(height,12);out.writeUInt16BE(width,14);return out;
}
function fixture(t:any){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'aa-local360-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const source=path.join(root,'source'),dest=path.join(root,'public','360');fs.mkdirSync(source);
 FRAME_NAMES.forEach((n:string,i:number)=>fs.writeFileSync(path.join(source,n),jpeg(1600,606,i)));
 return {source,dest};
}
test('local 360 importer parses dimensions without network access',()=>assert.deepEqual(jpegDimensions(jpeg()),{width:1600,height:606}));
test('local 360 importer rejects an HTML response',()=>assert.throws(()=>jpegDimensions(Buffer.from('<html>error</html>')),/JPEG/));
test('local 360 importer rejects an incomplete JPEG segment',()=>assert.throws(()=>jpegDimensions(jpeg().subarray(0,15)),/truncado/));
test('local 360 dry run validates all frames without writing',t=>{
 const {source,dest}=fixture(t);const result=importFrames(source,dest);assert.equal(result.applied,false);assert.equal(result.entries.length,36);assert.equal(result.distinctFiles,36);assert.equal(fs.existsSync(dest),false);
});
test('local 360 apply copies frames but preserves the source',t=>{
 const {source,dest}=fixture(t);const result=importFrames(source,dest,true);assert.equal(result.copied,36);assert.equal(fs.readdirSync(source).length,36);assert.equal(fs.readdirSync(dest).length,36);
});
test('local 360 import is idempotent for identical frames',t=>{
 const {source,dest}=fixture(t);importFrames(source,dest,true);assert.equal(importFrames(source,dest,true).copied,0);
});
test('local 360 conflicts are detected before any copying',t=>{
 const {source,dest}=fixture(t);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'frame-36.jpg'),'keep');
 assert.throws(()=>importFrames(source,dest,true),/CONFLICTO/);assert.deepEqual(fs.readdirSync(dest),['frame-36.jpg']);assert.equal(fs.readFileSync(path.join(dest,'frame-36.jpg'),'utf8'),'keep');
});
test('local 360 incomplete sequences do not create a destination',t=>{
 const {source,dest}=fixture(t);fs.unlinkSync(path.join(source,'frame-17.jpg'));assert.throws(()=>importFrames(source,dest,true),/Falta/);assert.equal(fs.existsSync(dest),false);
});
test('local 360 rejects the old 400-pixel frame before copying',t=>{
 const {source,dest}=fixture(t);fs.writeFileSync(path.join(source,'frame-06.jpg'),jpeg(400,154));assert.throws(()=>importFrames(source,dest,true),/se esperan 1600x606/);assert.equal(fs.existsSync(dest),false);
});
test('local 360 reports byte-identical duplicates without inferring camera positions',t=>{
 const {source,dest}=fixture(t);fs.copyFileSync(path.join(source,'frame-01.jpg'),path.join(source,'frame-02.jpg'));assert.equal(inspectFrames(source,dest).distinctFiles,35);
});
test('local 360 rejects source equal to destination',t=>{
 const {source}=fixture(t);assert.throws(()=>inspectFrames(source,source),/diferentes/);
});
