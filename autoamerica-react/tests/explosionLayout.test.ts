import assert from 'node:assert/strict';
import test from 'node:test';
import { motionAmount, motionPlan } from '../src/components/explosionLayout.ts';

const plan = (name: string, sign = 1) => motionPlan(name, { offset: [0, 0, sign], from: 0, to: 1 });
const offset = (name: string, p: number, sign = 1) => motionAmount(p, plan(name, sign));

test('both sides extract along the wheel-arch axis before lifting', () => {
  for (const sign of [-1, 1]) for (let sample = 0; sample <= 1000; sample++) {
    const p = sample / 1000;
    const side = offset('Panel lateral', p, sign);
    const wheel = offset('Rueda', p, sign);
    assert.equal(side[0], 0, 'longitudinal drift makes the arch intersect the tyre');
    if (side[1] > 0) assert.ok(1.005 + Math.abs(side[2]) - .09 > .99 + Math.abs(wheel[2]) + .15, 'panel must clear the complete tyre before lifting');
    if (Math.abs(wheel[2]) > 0) assert.ok(Math.abs(side[2]) >= 1.68 - 1e-9, 'wheels start only after side extraction');
  }
});

test('roof and bonnet clear the next assemblies before they move', () => {
  for (let sample = 0; sample <= 1000; sample++) {
    const p = sample / 1000;
    if (Math.abs(offset('Panel lateral', p)[2]) > 0) {
      assert.ok(1.39 + offset('Techo y cristales', p)[1] > 2.14 + offset('Panel lateral', p)[1], 'glass must be above side frames');
    }
    if (offset('Motor y transmisión', p)[1] > 0) {
      assert.ok(1.32 + offset('Capó', p)[1] > 1.40 + offset('Motor y transmisión', p)[1], 'bonnet must clear rising engine');
    }
  }
});

test('hybrid module leaves the floor footprint before rising', () => {
  for (let sample = 0; sample <= 1000; sample++) {
    const p = sample / 1000;
    const module = offset('Módulo de energía', p);
    if (module[1] > 0) assert.ok(Math.abs(module[2]) - .49 > .84, 'module must clear the cabin floor');
    assert.ok(Math.abs(module[2]) + .49 < 1.005 + Math.abs(offset('Panel lateral', p, -1)[2]) - .09 || module[2] === 0, 'extracted module remains inside separated body');
  }
});

test('all paths clamp their endpoints and reassemble without hysteresis', () => {
  for (const name of ['Techo y cristales', 'Capó', 'Panel lateral', 'Frontal', 'Portón y defensa trasera', 'Platón abierto', 'Motor y transmisión', 'Módulo de energía', 'Batería de 12 V', 'Rueda', 'Disco', 'Suspensión']) {
    const motion = plan(name);
    assert.ok(motionAmount(-1, motion).every(value => value === 0));
    assert.deepEqual(motionAmount(2, motion), motion.offset);
    for (let sample = 0; sample <= 100; sample++) {
      assert.ok(motionAmount(sample / 100, motion).every(Number.isFinite));
    }
  }
});
