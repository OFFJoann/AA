import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { VehicleSceneProps } from './VehicleScene';
import { getVehicleModel } from '../vehicleModels';

type V3 = [number, number, number];
type Family = 'body' | 'engine' | 'brakes' | 'suspension' | 'battery';
type Face = { points: V3[]; color: string; family: Family; normal?: V3; line?: boolean; width?: number; opacity?: number };
type RenderFace = Face & { d: string; depth: number; fill: string };
const WHITE = '#dce4e4';
const METAL = '#85949c';
const DARK = '#283339';
const BLACK = '#171f23';
const GLASS = '#284653';
const RED = '#dc4034';
const ORANGE = '#e98b39';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (value: number, from: number, to: number) => { const v = clamp((value - from) / (to - from)); return v * v * (3 - 2 * v); };
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const subtract = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm = (v: V3): V3 => { const length = Math.hypot(...v) || 1; return [v[0] / length, v[1] / length, v[2] / length]; };
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function shade(color: string, normal: V3, selected: boolean) {
  const expanded = /^#[0-9a-f]{3}$/i.test(color) ? '#' + [...color.slice(1)].map(c => c + c).join('') : color;
  const numeric = parseInt(expanded.replace('#', ''), 16);
  const rgb = [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255];
  const light = 0.63 + Math.max(0, dot(normal, norm([-0.28, 0.88, 0.60]))) * 0.43;
  const tint = [244, 106, 69];
  return '#' + rgb.map((channel, i) => Math.round(Math.min(255, channel * light * (selected ? 0.67 : 1) + (selected ? tint[i] * 0.33 : 0))).toString(16).padStart(2, '0')).join('');
}

/** CPU/SVG projection of an original schematic SUV. No WebGL or external asset is required. */
export default function VehicleFallback(props: VehicleSceneProps) {
  const model = getVehicleModel(props.modelId);
  if (model.id === 'prado') return <SchematicFallback {...props}/>;
  return <div className={`vehicle-reference-fallback ${props.className ?? ''}`}>
    <img src={model.image} alt={`Referencia exterior de ${model.name}`}/>
    <p>{model.name}<small>Vista de referencia. El giro 3D y el despiece requieren WebGL.</small></p>
  </div>;
}

function SchematicFallback({ progress, color, selectedPart, onSelectPart, className, autoRotate = false }: VehicleSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const [yaw, setYaw] = useState(Math.PI * 0.265);
  const [dragging, setDragging] = useState(false);
  const pointer = useRef({ startX: 0, startYaw: 0, moved: false, active: false, family: null as string | null });
  useEffect(() => {
    if (!autoRotate || !host.current) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    let last = 0;
    let disposed = false;
    const animate = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || motion.matches) return;
      if (!last) last = time;
      const elapsed = time - last;
      // Keep SVG work to 25 frames per second; pause while the visitor drags.
      if (elapsed >= 40) {
        if (!pointer.current.active) setYaw(value => value + Math.min(elapsed, 100) * 0.00010);
        last = time;
      }
      frame = requestAnimationFrame(animate);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!disposed && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      refresh();
    });
    observer.observe(host.current);
    document.addEventListener('visibilitychange', refresh);
    motion.addEventListener('change', refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      motion.removeEventListener('change', refresh);
    };
  }, [autoRotate]);
  const p = clamp(progress || 0);
  const scene = useMemo(() => {
    const faces: Face[] = [];
    let offset: V3 = [0, 0, 0];
    const polygon = (points: V3[], paint: string, family: Family, normal?: V3) => faces.push({ points: points.map(point => add(point, offset)), color: paint, family, normal });
    const line = (points: V3[], paint: string, family: Family, width = 1.15, opacity = 1) => faces.push({ points: points.map(point => add(point, offset)), color: paint, family, line: true, width, opacity });
    const group = (movement: V3, from: number, to: number, build: () => void) => {
      const amount = ease(p, from, to);
      offset = [movement[0] * amount, movement[1] * amount, movement[2] * amount];
      build();
      offset = [0, 0, 0];
    };
    const box = (center: V3, size: V3, paint: string, family: Family) => {
      const [x, y, z] = center, [a, b, c] = size.map(n => n / 2);
      polygon([[x + a, y - b, z - c], [x + a, y + b, z - c], [x + a, y + b, z + c], [x + a, y - b, z + c]], paint, family, [1, 0, 0]);
      polygon([[x - a, y - b, z + c], [x - a, y + b, z + c], [x - a, y + b, z - c], [x - a, y - b, z - c]], paint, family, [-1, 0, 0]);
      polygon([[x - a, y + b, z - c], [x - a, y + b, z + c], [x + a, y + b, z + c], [x + a, y + b, z - c]], paint, family, [0, 1, 0]);
      polygon([[x - a, y - b, z + c], [x - a, y - b, z - c], [x + a, y - b, z - c], [x + a, y - b, z + c]], paint, family, [0, -1, 0]);
      polygon([[x - a, y - b, z + c], [x + a, y - b, z + c], [x + a, y + b, z + c], [x - a, y + b, z + c]], paint, family, [0, 0, 1]);
      polygon([[x + a, y - b, z - c], [x - a, y - b, z - c], [x - a, y + b, z - c], [x + a, y + b, z - c]], paint, family, [0, 0, -1]);
    };
    const profile = (outline: Array<[number, number]>, centerZ: number, depth: number, paint: string, family: Family) => {
      const area = outline.reduce((sum, v, i) => { const next = outline[(i + 1) % outline.length]; return sum + v[0] * next[1] - next[0] * v[1]; }, 0);
      const points = area > 0 ? outline : [...outline].reverse();
      polygon(points.map(([x, y]) => [x, y, centerZ + depth / 2]), paint, family, [0, 0, 1]);
      polygon([...points].reverse().map(([x, y]) => [x, y, centerZ - depth / 2]), paint, family, [0, 0, -1]);
      points.forEach(([x, y], i) => {
        const [a, b] = points[(i + 1) % points.length];
        polygon([[x, y, centerZ - depth / 2], [a, b, centerZ - depth / 2], [a, b, centerZ + depth / 2], [x, y, centerZ + depth / 2]], paint, family);
      });
    };
    const ring = (center: V3, outer: number, inner: number, depth: number, paint: string, family: Family, segments = 24) => {
      const [x, y, z] = center;
      for (let i = 0; i < segments; i++) {
        const a = i / segments * Math.PI * 2, b = (i + 1) / segments * Math.PI * 2;
        const point = (angle: number, r: number, side: number): V3 => [x + Math.cos(angle) * r, y + Math.sin(angle) * r, z + side * depth / 2];
        polygon([point(a, outer, -1), point(b, outer, -1), point(b, outer, 1), point(a, outer, 1)], paint, family, [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0]);
        for (const sign of [-1, 1]) polygon([point(a, inner, sign), point(b, inner, sign), point(b, outer, sign), point(a, outer, sign)], paint, family, [0, 0, sign]);
      }
    };
    const disc = (center: V3, radius: number, paint: string, family: Family, normalZ = 1, segments = 20) => polygon(Array.from({ length: segments }, (_, i) => [center[0] + Math.cos(i / segments * Math.PI * 2) * radius, center[1] + Math.sin(i / segments * Math.PI * 2) * radius, center[2]] as V3), paint, family, [0, 0, normalZ]);

    // Frame and power train.
    for (const z of [-0.59, 0.59]) box([0, 0.52, z], [4.64, 0.17, 0.17], DARK, 'suspension');
    for (const x of [-1.65, -0.65, 0.4, 1.65]) box([x, 0.52, 0], [0.14, 0.13, 1.35], METAL, 'suspension');
    box([-0.45, 0.75, 0], [2.85, 0.12, 1.7], BLACK, 'body');
    box([-0.02, 0.49, 0], [3.42, 0.085, 0.085], METAL, 'engine');
    for (const x of [-1.65, 1.65]) { box([x, 0.60, 0], [0.12, 0.12, 1.90], METAL, 'suspension'); box([x, 0.6, 0], [0.29, 0.22, 0.31], DARK, 'suspension'); }

    // The side silhouette has genuine cutouts, so wheels are never painted over.
    for (const sign of [-1, 1]) group([-0.06, 0.12, sign * 0.94], 0.13, 0.86, () => {
      const outline: Array<[number, number]> = [[-2.57, 0.67], [-2.34, 0.67]];
      for (const wheelX of [-1.65, 1.65]) {
        if (wheelX > 0) outline.push([0.96, 0.64]);
        for (let i = 0; i <= 10; i++) { const angle = Math.PI - i / 10 * Math.PI; outline.push([wheelX + Math.cos(angle) * 0.69, 0.64 + Math.sin(angle) * 0.69]); }
      }
      outline.push([2.56, 0.69], [2.57, 1.28], [2.36, 1.47], [1.31, 1.52], [-2.33, 1.52], [-2.57, 1.26]);
      profile(outline, sign * 1.0, 0.095, color, 'body');
      // Black sculpted arches follow the open body profile.
      for (const x of [-1.65, 1.65]) line(Array.from({ length: 18 }, (_, i) => [x + Math.cos(i / 17 * Math.PI) * 0.709, 0.64 + Math.sin(i / 17 * Math.PI) * 0.709, sign * 1.060] as V3), BLACK, 'body', 6.3);
      profile([[-2.33, 1.50], [-2.15, 1.88], [-1.68, 2.14], [0.7, 2.14], [1.37, 1.50]], sign * 0.962, 0.065, color, 'body');
      const window = (outline: Array<[number, number]>) => polygon(outline.map(([x, y]) => [x, y, sign * 1.004]), GLASS, 'body', [0, 0, sign]);
      window([[0.03, 1.58], [1.22, 1.58], [0.658, 2.065], [0.03, 2.065]]);
      window([[-1.14, 1.58], [-0.10, 1.58], [-0.10, 2.065], [-1.14, 2.065]]);
      window([[-2.215, 1.58], [-1.28, 1.58], [-1.28, 2.065], [-1.66, 2.065], [-2.05, 1.825]]);
      line([[-2.24, 1.551, sign * 1.052], [1.26, 1.551, sign * 1.052]], WHITE, 'body', 1.6, 0.7);
      line([[-1.07, 2.03, sign * 1.010], [-0.26, 1.66, sign * 1.010]], '#b1d0d8', 'body', 0.9, 0.35);
      line([[0.13, 2.02, sign * 1.010], [0.99, 1.66, sign * 1.010]], '#b1d0d8', 'body', 0.9, 0.35);
      for (const x of [-1.19, -0.035, 1.29]) line([[x, 0.77, sign * 1.061], [x, 1.46, sign * 1.061]], DARK, 'body', 1.0, 0.8);
      for (const x of [-0.33, 0.90]) box([x, 1.407, sign * 1.075], [0.19, 0.041, 0.032], DARK, 'body');
      box([-0.15, 0.62, sign * 1.07], [2.72, 0.09, 0.20], BLACK, 'body');
      box([-0.15, 0.68, sign * 1.11], [2.59, 0.021, 0.13], METAL, 'body');
      box([1.02, 1.69, sign * 1.155], [0.31, 0.15, 0.235], color, 'body');
      box([0.99, 1.69, sign * 1.285], [0.20, 0.102, 0.01], GLASS, 'body');
      box([1.13, 1.659, sign * 1.28], [0.10, 0.019, 0.015], WHITE, 'body');
    });

    group([-0.20, 1.58, 0], 0.025, 0.70, () => {
      box([-0.52, 2.19, 0], [2.98, 0.135, 1.88], color, 'body');
      box([-0.37, 2.265, 0], [1.89, 0.021, 1.24], GLASS, 'body');
      for (const z of [-0.80, 0.80]) box([-0.56, 2.31, z], [2.51, 0.041, 0.055], METAL, 'body');
      polygon([[1.33, 1.53, 0.91], [1.33, 1.53, -0.91], [0.71, 2.13, -0.91], [0.71, 2.13, 0.91]], GLASS, 'body');
      polygon([[-2.31, 1.55, -0.9], [-2.31, 1.55, 0.9], [-1.995, 2.13, 0.9], [-1.995, 2.13, -0.9]], GLASS, 'body');
      line([[1.25, 1.63, -0.75], [0.80, 2.04, 0.55]], '#a4c7d3', 'body', 1.2, 0.37);
      box([-2.08, 2.19, 0], [0.29, 0.07, 1.89], color, 'body');
    });
    group([0.68, 1.0, 0], 0.16, 0.73, () => {
      profile([[1.32, 1.47], [2.50, 1.38], [2.49, 1.50], [1.35, 1.61]], 0, 1.91, color, 'body');
      for (const z of [-0.63, 0.63]) line([[1.42, 1.618, z], [2.42, 1.526, z * 0.89]], WHITE, 'body', 1.0, 0.5);
    });
    group([0.54, 0.025, 0], 0.32, 0.96, () => {
      box([2.49, 1.08, 0], [0.19, 0.69, 1.97], color, 'body');
      box([2.612, 1.071, 0], [0.055, 0.37, 1.27], BLACK, 'body');
      for (let i = 0; i < 5; i++) box([2.650, 0.942 + i * 0.065, 0], [0.027, 0.015, 1.17], METAL, 'body');
      box([2.56, 0.74, 0], [0.14, 0.18, 2.04], DARK, 'body');
      box([2.651, 0.67, 0], [0.034, 0.053, 1.23], METAL, 'body');
      box([2.665, 0.858, 0], [0.025, 0.13, 0.48], BLACK, 'body');
      for (const sign of [-1, 1]) {
        box([2.612, 1.388, sign * 0.74], [0.05, 0.156, 0.48], BLACK, 'body');
        box([2.654, 1.443, sign * 0.74], [0.025, 0.028, 0.455], '#e5f6fc', 'body');
        for (let i = 0; i < 3; i++) box([2.654, 1.367, sign * (0.595 + i * 0.13)], [0.024, 0.043, 0.076], '#cfedf6', 'body');
        box([2.654, 1.398, sign * 0.955], [0.026, 0.104, 0.04], '#e5f6fc', 'body');
      }
    });
    group([-0.43, 0.065, 0], 0.31, 0.95, () => {
      box([-2.47, 1.23, 0], [0.20, 0.93, 1.98], color, 'body');
      box([-2.58, 0.76, 0], [0.10, 0.17, 2.01], DARK, 'body');
      box([-2.586, 1.479, 0], [0.041, 0.035, 1.68], RED, 'body');
      box([-2.582, 1.14, 0], [0.027, 0.18, 0.52], BLACK, 'body');
      for (const z of [-0.87, 0.87]) box([-2.583, 1.40, z], [0.038, 0.17, 0.12], RED, 'body');
    });

    // Interior, deliberately schematic and independent from exterior pieces.
    for (const x of [0.32, -0.93]) for (const z of [-0.44, 0.44]) {
      box([x, 0.93, z], [0.56, 0.17, 0.56], DARK, 'body');
      box([x - 0.20, 1.24, z], [0.135, 0.52, 0.56], DARK, 'body');
      box([x - 0.20, 1.59, z], [0.13, 0.16, 0.28], DARK, 'body');
    }
    box([1.1, 1.26, 0], [0.33, 0.18, 1.69], DARK, 'body');
    box([0.91, 1.44, 0], [0.025, 0.23, 0.36], GLASS, 'body');

    group([1.10, 0.72, -0.15], 0.38, 1, () => {
      box([1.43, 0.98, 0], [0.86, 0.46, 0.70], METAL, 'engine');
      box([1.41, 1.275, 0], [0.76, 0.135, 0.63], DARK, 'engine');
      box([1.40, 1.352, 0], [0.46, 0.018, 0.22], WHITE, 'engine');
      for (let i = 0; i < 4; i++) {
        box([1.15 + i * 0.175, 1.33, 0], [0.043, 0.067, 0.49], BLACK, 'engine');
        box([1.14 + i * 0.185, 1.09, 0.40], [0.12, 0.16, 0.19], METAL, 'engine');
      }
      box([0.82, 0.91, 0], [0.36, 0.23, 0.27], METAL, 'engine');
      box([1.50, 1.08, -0.47], [0.22, 0.23, 0.24], ORANGE, 'engine');
      box([1.94, 0.95, 0], [0.12, 0.24, 0.27], DARK, 'engine');
    });
    group([-0.47, 0.31, -1.85], 0.53, 1, () => {
      box([-0.50, 0.58, 0], [1.67, 0.19, 1.22], METAL, 'battery');
      box([-0.50, 0.692, 0], [1.53, 0.029, 1.07], BLACK, 'battery');
      for (let x = 0; x < 6; x++) for (let z = 0; z < 3; z++) box([-1.123 + x * 0.25, 0.744, -0.35 + z * 0.35], [0.206, 0.08, 0.28], '#537c8e', 'battery');
      for (const z of [-0.48, 0.48]) box([-0.50, 0.80, z], [1.45, 0.023, 0.027], ORANGE, 'battery');
      box([0.39, 0.60, 0.18], [0.15, 0.13, 0.24], ORANGE, 'battery');
    });

    for (const x of [-1.65, 1.65]) for (const sign of [-1, 1]) {
      group([x > 0 ? 0.18 : -0.18, 0.015, sign * 1.07], 0.23, 0.95, () => {
        const z = sign * 1.07;
        ring([x, 0.62, z], 0.58, 0.35, 0.33, '#212b30', 'brakes');
        ring([x, 0.62, z + sign * 0.175], 0.353, 0.319, 0.021, METAL, 'brakes');
        disc([x, 0.62, z + sign * 0.184], 0.318, BLACK, 'brakes', sign);
        for (let i = 0; i < 6; i++) {
          const angle = i / 6 * Math.PI * 2;
          const radial = (r: number, shift: number): V3 => [x + Math.cos(angle + shift) * r, 0.62 + Math.sin(angle + shift) * r, z + sign * 0.207];
          polygon([radial(0.078, -0.29), radial(0.31, -0.11), radial(0.31, 0.07), radial(0.078, 0.29)], METAL, 'brakes', [0, 0, sign]);
          disc([x + Math.cos(angle) * 0.095, 0.62 + Math.sin(angle) * 0.095, z + sign * 0.212], 0.012, WHITE, 'brakes', sign, 7);
        }
        disc([x, 0.62, z + sign * 0.217], 0.063, METAL, 'brakes', sign);
        for (let i = 0; i < 21; i++) {
          const angle = i / 21 * Math.PI * 2;
          const dx = Math.cos(angle), dy = Math.sin(angle);
          line([[x + dx * 0.585, 0.62 + dy * 0.585, z - 0.13], [x + dx * 0.585, 0.62 + dy * 0.585, z + 0.13]], '#101a20', 'brakes', 1.1, 0.8);
        }
      });
      group([x > 0 ? 0.17 : -0.17, 0.02, sign * 0.55], 0.40, 1, () => {
        const z = sign * 0.88;
        ring([x, 0.62, z], 0.283, 0.086, 0.054, METAL, 'brakes', 20);
        for (let i = 0; i < 12; i++) {
          const angle = i / 12 * Math.PI * 2;
          disc([x + Math.cos(angle) * 0.22, 0.62 + Math.sin(angle) * 0.22, z + sign * 0.030], 0.013, DARK, 'brakes', sign, 6);
        }
        box([x + 0.23, 0.66, z], [0.14, 0.31, 0.14], RED, 'brakes');
      });
      group([x > 0 ? 0.13 : -0.13, 0.43, sign * 0.32], 0.31, 0.95, () => {
        const z = sign * 0.77;
        box([x, 0.88, z], [0.060, 0.70, 0.060], METAL, 'suspension');
        box([x, 0.64, z], [0.10, 0.26, 0.10], DARK, 'suspension');
        line(Array.from({ length: 72 }, (_, i) => { const t = i / 71; return [x + Math.sin(t * Math.PI * 11) * 0.103, 0.69 + t * 0.43, z + Math.cos(t * Math.PI * 11) * 0.103] as V3; }), RED, 'suspension', 3.0);
        box([x, 1.15, z], [0.25, 0.035, 0.24], DARK, 'suspension');
        line([[x - 0.31, 0.52, z - sign * 0.21], [x, 0.65, z], [x + 0.31, 0.52, z - sign * 0.21]], METAL, 'suspension', 3.4);
      });
    }

    const pitch = 0.365;
    const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw);
    const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch);
    const camera: V3 = [sinYaw * cosPitch, sinPitch, cosYaw * cosPitch];
    const project = ([x, y, z]: V3): [number, number, number] => [x * cosYaw - z * sinYaw, (x * sinYaw + z * cosYaw) * sinPitch - y * cosPitch, (x * sinYaw + z * cosYaw) * cosPitch + y * sinPitch];
    const projected = faces.flatMap(face => face.points.map(project));
    const minX = Math.min(...projected.map(point => point[0])), maxX = Math.max(...projected.map(point => point[0]));
    const minY = Math.min(...projected.map(point => point[1])), maxY = Math.max(...projected.map(point => point[1]));
    const scale = Math.min(850 / (maxX - minX), 435 / (maxY - minY));
    const shiftX = 500 - (minX + maxX) / 2 * scale;
    const shiftY = 309 - (minY + maxY) / 2 * scale;
    const toScreen = (point: V3): [number, number] => { const [x, y] = project(point); return [x * scale + shiftX, y * scale + shiftY]; };
    const path = (points: V3[], close: boolean) => points.map((point, i) => { const [x, y] = toScreen(point); return (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2); }).join(' ') + (close ? 'Z' : '');
    const surfaces: RenderFace[] = [];
    for (const face of faces) {
      const normal = face.normal || norm(cross(subtract(face.points[1], face.points[0]), subtract(face.points[2] || face.points[1], face.points[0])));
      if (!face.line && dot(normal, camera) < 0.015) continue;
      const depth = face.points.reduce((sum, point) => sum + project(point)[2], 0) / face.points.length + (face.line ? 0.013 : 0);
      surfaces.push({ ...face, d: path(face.points, !face.line), depth, fill: face.line ? face.color : shade(face.color, norm(normal), face.family === selectedPart) });
    }
    surfaces.sort((a, b) => a.depth - b.depth);
    const ground = path(Array.from({ length: 72 }, (_, i) => [Math.cos(i / 72 * Math.PI * 2) * 3.4, -0.075, Math.sin(i / 72 * Math.PI * 2) * 2.55] as V3), true);
    const shadow = path(Array.from({ length: 60 }, (_, i) => [Math.cos(i / 60 * Math.PI * 2) * 2.9, 0.025, Math.sin(i / 60 * Math.PI * 2) * 1.30] as V3), true);
    const guide = (a: V3, b: V3) => path([a, b], false);
    const roofAmount = ease(p, 0.025, 0.70), engineAmount = ease(p, 0.38, 1);
    return { surfaces, ground, shadow, guides: [guide([-0.6, 2.12, 0], [-0.6 - roofAmount * 0.2, 2.12 + roofAmount * 1.58, 0]), guide([1.43, 0.98, 0], [1.43 + engineAmount * 1.10, 0.98 + engineAmount * 0.72, -engineAmount * 0.15])] };
  }, [p, color, selectedPart, yaw]);

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    const family = event.target instanceof Element ? event.target.getAttribute('data-family') : null;
    pointer.current = { startX: event.clientX, startYaw: yaw, moved: false, active: true, family };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!pointer.current.active) return;
    const delta = event.clientX - pointer.current.startX;
    if (Math.abs(delta) > 5) pointer.current.moved = true;
    if (pointer.current.moved) setYaw(pointer.current.startYaw + delta * 0.0075);
  };
  const onPointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.type === 'pointerup' && pointer.current.active && !pointer.current.moved && pointer.current.family) onSelectPart?.(pointer.current.family);
    pointer.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };
  const buttonStyle = { border: '1px solid #62707866', background: '#162126bb', color: '#dbe6e8', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', fontSize: 16, lineHeight: 1 };
  return (
    <div ref={host} className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 250 }}>
      <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Vista vectorial del vehículo conceptual. Arrastra horizontalmente para girar y utiliza los controles de despiece y sistemas." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'pan-y', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}>
        <defs><filter id="vehicle-vector-shadow"><feGaussianBlur stdDeviation="11" /></filter></defs>
        <path d={scene.ground} fill="none" stroke="#8babb7" strokeOpacity="0.14" strokeWidth="1" />
        <path d={scene.shadow} fill="#000000" opacity={0.31 - p * 0.10} filter="url(#vehicle-vector-shadow)" />
        {p > 0.12 && scene.guides.map((d, i) => <path key={'guide' + i} d={d} fill="none" stroke="#a3bfca" strokeWidth="1" strokeDasharray="4 5" opacity={0.3 * p} />)}
        {scene.surfaces.map((face, i) => <path key={i} data-family={face.family} d={face.d} fill={face.line ? 'none' : face.fill} stroke={face.line ? face.fill : selectedPart === face.family ? '#fca17b' : '#09171e'} strokeWidth={face.line ? face.width : 0.48} strokeOpacity={face.line ? face.opacity ?? 1 : selectedPart === face.family ? 0.34 : 0.18} strokeLinejoin="round" strokeLinecap="round" />)}
      </svg>
      <div style={{ position: 'absolute', bottom: 55, left: 0, color: '#8fa3ad', fontSize: 8, letterSpacing: '.06em', pointerEvents: 'none' }}>VISTA ALTERNATIVA · SIN WEBGL</div>
      <div style={{ position: 'absolute', right: 0, bottom: 49, display: 'flex', alignItems: 'center', gap: 6 }}>
        <button type="button" aria-label="Girar vista a la izquierda" onClick={() => setYaw(value => value - 0.27)} style={buttonStyle}>↶</button>
        <button type="button" aria-label="Restablecer vista del vehículo" onClick={() => setYaw(Math.PI * 0.265)} style={{ ...buttonStyle, fontSize: 10, padding: '7px 9px' }}>RESTABLECER</button>
        <button type="button" aria-label="Girar vista a la derecha" onClick={() => setYaw(value => value + 0.27)} style={buttonStyle}>↷</button>
      </div>
    </div>
  );
}
