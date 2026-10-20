import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { modelKey } from '../src/lib/vehicleBackground.ts';
import { resolveRoute } from '../src/lib/routes.ts';

const story=fs.readFileSync(new URL('../src/components/vehicles/VehicleStory.tsx',import.meta.url),'utf8');
const viewer=fs.readFileSync(new URL('../src/components/vehicles/Vehicle360Viewer.tsx',import.meta.url),'utf8');

test('360 integration accepts the actual routed catalog ID',()=>{
  const route=resolveRoute('/nuevos/corolla-cross');
  assert.equal(route.vehicleId,'new:corolla-cross');
  assert.equal(modelKey(route.vehicleId!,'reference'),'corolla-cross');
});
test('360 reference is not inherited by a marketing-edited record',()=>{
  assert.equal(modelKey('new:corolla-cross','marketing'),undefined);
});
test('360 reference is not attached to a used record',()=>{
  assert.equal(modelKey('used:corolla-cross','reference'),undefined);
});
test('360 JSX uses normalized ID rather than the broken bare comparison',()=>{
  assert.ok(story.includes("const hasLocal360=modelKey(vehicle.id,vehicle.origin)==='corolla-cross'"));
  assert.ok(!story.includes("vehicle.id==='corolla-cross'"));
  assert.ok(story.includes('hasLocal360&&<div id="vista-360"'));
  assert.ok(story.includes('<Vehicle360Viewer title="Toyota Corolla Cross Hybrid SE 2026" basePath="/assets/360/corolla-cross" />'));
});
test('360 shortcut targets the integrated viewer',()=>{
  assert.ok(story.includes('href="#vista-360"'));
  assert.equal((story.match(/id="vista-360"/g)||[]).length,1);
});
test('360 component keeps the local frame path, controls and US notice',()=>{
  assert.ok(viewer.includes('/frame-${pad('));
  assert.ok(viewer.includes('onPointerMove={move}'));
  assert.ok(viewer.includes('requestFullscreen'));
  assert.ok(viewer.includes('mercado estadounidense'));
});
test('both existing reference tours and the technical sheet are retained',()=>{
  assert.ok(story.includes('<OfficialVehicleTours id={vehicle.id} origin={vehicle.origin}/>'));
  assert.ok(story.includes('<TechnicalSheet key={variant.id} profile={profile} variant={variant}/>'));
});
test('all previous route pages remain reachable',()=>{
  for(const route of ['/','/nuevos','/usados','/posventa','/posventa/repuestos','/sedes'])
    assert.notEqual(resolveRoute(route).page,'not-found');
});
