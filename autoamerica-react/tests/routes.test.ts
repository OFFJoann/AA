import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoute,vehiclePath,canonicalLocation,pageTitle } from '../src/lib/routes.ts';
import { sceneState,trackProgress } from '../src/lib/cinematic.ts';
import { findTechnicalProfile,eligibleMedia,technicalProfiles,technicalSources } from '../src/data/technicalProfiles.ts';
const origin='https://aa.example';
for(const [path,page] of [['/','home'],['/nuevos','new'],['/usados','used'],['/posventa','aftersales'],['/posventa/repuestos','parts'],['/sedes','locations']] as const){
 test(`separate route ${path}`,()=>assert.equal(resolveRoute(path).page,page));
}
test('model ID round trip',()=>{for(const id of ['new:prado','new:hilux','new:corolla-cross','new:rav4','new:yaris-cross','new:17321','marketing-new-123'])assert.equal(resolveRoute(vehiclePath(id)).vehicleId,id);});
test('unknown paths do not show homepage',()=>assert.equal(resolveRoute('/lo-que-no-existe').page,'not-found'));
test('invalid percent encodings are handled',()=>assert.equal(resolveRoute('/nuevos/%E0%A4%A').page,'not-found'));
test('encoded path traversal does not become a model',()=>assert.equal(resolveRoute('/nuevos/..%2Fadmin').page,'not-found'));
test('trailing slash is accepted',()=>assert.equal(resolveRoute('/usados/').page,'used'));
test('old hashes preserve filters and campaign queries',()=>assert.equal(canonicalLocation('/?utm_source=test&u_q=Mazda#usados',origin),'/usados?utm_source=test&u_q=Mazda'));
test('old vehicle bookmarks map to canonical path',()=>assert.equal(canonicalLocation('/#vehiculo/new%3Aprado',origin),'/nuevos/prado'));
test('old service bookmarks map to independent page',()=>assert.equal(canonicalLocation('/#servicios',origin),'/posventa'));
test('chapter hash is not mistaken for a page',()=>assert.equal(canonicalLocation('/nuevos/prado#ficha-tecnica',origin),'/nuevos/prado#ficha-tecnica'));
test('foreign redirect refused',()=>assert.throws(()=>canonicalLocation('https://foreign.example',origin)));
test('route title',()=>assert.match(pageTitle(resolveRoute('/usados')),/Usados/));
test('cinematic endpoints clamp correctly',()=>{assert.equal(sceneState(-2,7).active,0);assert.equal(sceneState(2,7).active,6);assert.equal(sceneState(NaN,7).active,0)});
test('crossfade is bounded and holds for reading',()=>{const s=sceneState(.5/6,7);assert.equal(s.blend,0);for(let p=0;p<=1;p+=.01){const s=sceneState(p,7);assert.ok(s.blend>=0&&s.blend<=1);assert.ok(s.active>=0&&s.active<7);}});
test('scroll choreography is reversible without hidden state',()=>{const points=Array.from({length:101},(_,i)=>i/100);const result=points.map(p=>sceneState(p,7));assert.deepEqual(points.reverse().map(p=>sceneState(p,7)).reverse(),result);});
test('single scene does not fade out',()=>{assert.equal(sceneState(.9,1).from,0);assert.equal(sceneState(.9,1).blend,0)});
test('track math accounts for sticky header',()=>{assert.equal(trackProgress(80,4000,800,80),0);assert.equal(trackProgress(-3120,4000,800,80),1);assert.equal(trackProgress(0,100,800,80),0)});
test('four technical models have independent profiles',()=>{assert.equal(technicalProfiles.length,4);assert.equal(new Set(technicalProfiles.map(p=>p.id)).size,4);});
test('all technical rows have an explicit official/dealer source',()=>{for(const p of technicalProfiles)for(const v of p.variants)for(const g of v.groups)for(const row of g.rows){assert.ok(technicalSources[row.source]);assert.match(technicalSources[row.source].url,/^https:\/\/(www\.toyota\.com\.co|autoamerica\.com\.co)\//);}});
test('marketing edits never inherit reference specs merely by ID',()=>assert.equal(findTechnicalProfile('new:prado','marketing'),undefined));
test('Prado TX never acquires TX-L-specific imagery',()=>{const p=findTechnicalProfile('new:prado')!;assert.ok(!eligibleMedia(p,'tx-24').some(m=>m.id==='prado-studio'||m.id==='prado-cabin'));});
test('Cross 2026 PDF is never relabelled 2027',()=>{const p=findTechnicalProfile('new:corolla-cross')!;assert.ok(p.variants.filter(v=>v.source==='cross-pdf').every(v=>v.year===2026));assert.ok(p.variants.filter(v=>v.year===2027).every(v=>v.source==='cross-aa')); assert.match(p.notice,/2027/);});
test('RAV4 HEV never inherits a PHEV download or unverified photograph',()=>{const p=findTechnicalProfile('new:rav4')!;assert.equal(p.media.length,0);assert.deepEqual(p.sources,['rav4-aa']);});
test('hybrid power is differentiated from individual electric motor',()=>{const p=findTechnicalProfile('new:corolla-cross')!;const rows=p.variants.find(v=>v.id==='xei-18')!.groups.find(g=>g.id==='motor')!.rows;assert.ok(rows.some(r=>r.label==='Potencia del sistema combinado'&&r.value.startsWith('121')));assert.ok(rows.some(r=>r.label==='Potencia del motor el\u00e9ctrico MG2'&&r.value==='71 hp'));});

test('archived Cross 2026 never receives a current 2027 reference image',()=>{const p=findTechnicalProfile('new:corolla-cross')!;assert.equal(eligibleMedia(p,'xei-18').length,0);assert.ok(eligibleMedia(p,'xei-27').length>0);});
test('Prado diesel never uses the gasoline studio image',()=>{const p=findTechnicalProfile('new:prado')!;assert.ok(!eligibleMedia(p,'txl-28').some(m=>m.id==='prado-studio'));assert.ok(eligibleMedia(p,'txl-24').some(m=>m.id==='prado-studio'));});
