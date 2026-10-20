export type Point3 = [number, number, number];
export interface MotionPlan {
  offset: Point3;
  from: number;
  to: number;
  /** Complete the lateral extraction before raising the component. */
  liftAfter?: number;
}

// Shared by every vehicle: extraction directions preserve the wheel-arch
// alignment; rotating complete world-space panels made them cross the tyres.
export function motionPlan(name: string, fallback: MotionPlan): MotionPlan {
  if (name === 'Techo y cristales') return { offset: [0, 2.25, 0], from: 0, to: .32 };
  if (name === 'Capó') return { offset: [.26, 1.60, 0], from: .02, to: .34 };
  if (name.startsWith('Panel lateral')) return { offset: [0, .82, Math.sign(fallback.offset[2]) * 1.68], from: .20, to: .55, liftAfter: .72 };
  if (name === 'Frontal') return { offset: [.92, 0, 0], from: .12, to: .42 };
  if (name === 'Portón y defensa trasera') return { offset: [-.86, 0, 0], from: .12, to: .42 };
  if (name === 'Platón abierto') return { offset: [0, 1.15, 0], from: .46, to: .74 };
  if (name === 'Motor y transmisión') return { offset: [.05, .72, 0], from: .57, to: 1 };
  if (name === 'Módulo de energía') return { offset: [0, .15, -1.68], from: .58, to: 1, liftAfter: .82 };
  if (name === 'Batería de 12 V') return { offset: [0, .78, -.18], from: .58, to: 1 };
  if (name.startsWith('Rueda')) return { offset: [0, 0, Math.sign(fallback.offset[2]) * 1.03], from: .56, to: 1 };
  if (name.startsWith('Disco')) return { offset: [0, 0, Math.sign(fallback.offset[2]) * .55], from: .68, to: 1 };
  if (name.startsWith('Suspensión')) return { offset: [0, .18, Math.sign(fallback.offset[2]) * .08], from: .72, to: 1 };
  return fallback;
}

export function motionAmount(progress: number, plan: MotionPlan): Point3 {
  const raw = Math.max(0, Math.min(1, (progress - plan.from) / (plan.to - plan.from)));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  if (plan.liftAfter !== undefined) {
    const lateral = smooth(Math.min(1, raw / plan.liftAfter));
    const vertical = smooth(Math.max(0, (raw - plan.liftAfter) / (1 - plan.liftAfter)));
    return [plan.offset[0] * lateral, plan.offset[1] * vertical, plan.offset[2] * lateral];
  }
  return plan.offset.map(value => value * smooth(raw)) as Point3;
}
