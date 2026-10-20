import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectGlb } from '../scripts/lib/glb-inspector.mjs';
function glb(document:any) {
  let json=Buffer.from(JSON.stringify(document));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]);
  const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(20+json.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
  return Buffer.concat([header,json]);
}
const model={asset:{version:'2.0'},meshes:[{name:'body',primitives:[{}]},{name:'wheel',primitives:[{}]}],nodes:[{name:'root',children:[1,2]},{name:'body',mesh:0},{name:'wheel',mesh:1}]};
test('GLB inventories mesh nodes without asserting OEM parts',()=>{const r=inspectGlb(glb(model));assert.equal(r.meshNodeCount,2);assert.equal(r.physicalPartsVerified,0);assert.equal(r.nodes[1].parentNode,0);});
test('GLB rejects a PNG or web page',()=>assert.throws(()=>inspectGlb(Buffer.alloc(50)),/No es GLB/));
test('GLB rejects truncated header',()=>assert.throws(()=>inspectGlb(Buffer.alloc(10)),/corto/));
test('GLB rejects declared size mismatch',()=>{const b=glb(model);b.writeUInt32LE(500,8);assert.throws(()=>inspectGlb(b),/Longitud/);});
test('GLB rejects missing referenced mesh',()=>assert.throws(()=>inspectGlb(glb({...model,nodes:[{mesh:20}]})),/Indice/));
test('GLB rejects graph cycles',()=>assert.throws(()=>inspectGlb(glb({...model,nodes:[{children:[1]},{children:[0]}]})),/Ciclo/));
test('GLB detects unnamed and duplicate nodes',()=>{const r=inspectGlb(glb({...model,nodes:[{mesh:0,name:'x'},{mesh:1,name:'x'},{mesh:0}]}));assert.deepEqual(r.duplicateNames,['x']);assert.ok(r.warnings.some(w=>w.includes('nombres')));});
test('GLB counts external resources but never requests them',()=>{const r=inspectGlb(glb({...model,images:[{uri:'https://example.invalid/image.png'},{uri:'data:image/png;base64,AAA'}]}));assert.equal(r.externalReferences,1);});
test('GLB warns on a single exterior-only mesh instead of inventing internals',()=>{const r=inspectGlb(glb({...model,nodes:[{mesh:0,name:'car'}]}));assert.ok(r.warnings.some(w=>w.includes('Menos')));});
test('GLB detects nodes using a skin',()=>{const r=inspectGlb(glb({...model,nodes:[{mesh:0,name:'car',skin:0}]}));assert.ok(r.warnings.some(w=>w.includes('skin')));});
