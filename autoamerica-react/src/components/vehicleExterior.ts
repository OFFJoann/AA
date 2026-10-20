import * as THREE from 'three';
import type { VehicleModelId } from '../vehicleModels';

type Point = [number, number, number];
type Outline = Array<[number, number]>;
type Material = THREE.MeshStandardMaterial;
type Family = 'body' | 'engine' | 'brakes' | 'suspension' | 'battery';

export interface ExteriorBuilder {
  modelId: VehicleModelId;
  materials: { paint: Material; aluminum: Material; darkMetal: Material; black: Material; glass: Material; lens: Material; led: Material; tailLight: Material; seam: Material };
  mesh: (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: Material, family: Family, position?: Point) => THREE.Mesh;
  box: (parent: THREE.Object3D, size: Point, position: Point, material: Material, family: Family, radius?: number) => THREE.Mesh;
  rod: (parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, material: Material, family: Family) => THREE.Mesh;
  sidePolygon: (parent: THREE.Object3D, points: Outline, z: number, thickness: number, material: Material, family: Family, bevel?: number) => THREE.Mesh;
  surface: (parent: THREE.Object3D, points: Point[], material: Material) => THREE.Mesh;
  contour: (parent: THREE.Object3D, points: Point[], material?: Material, radius?: number) => THREE.Mesh;
  newGroup: (name: string) => THREE.Group;
  moving: (group: THREE.Group, offset: Point, from?: number, to?: number, spin?: Point) => void;
  lettering: (parent: THREE.Object3D, text: string, position: Point, width: number, height: number, back?: boolean) => void;
}

/** Distinct exterior shapes derived from the existing catalog photographs. */
export function buildVehicleExterior(builder: ExteriorBuilder) {
  const { modelId, mesh, box, rod, sidePolygon, surface, contour, newGroup, moving, lettering } = builder;
  const { paint, aluminum, darkMetal, black, glass, lens, led, tailLight, seam } = builder.materials;
  const pickup = modelId === 'hilux';
  const rav4 = modelId === 'rav4';
  const yaris = modelId === 'yaris-cross';
  const roofY = pickup ? 1.95 : yaris ? 1.97 : 1.94;
  const roofFront = pickup ? 0.62 : yaris ? 0.38 : 0.48;
  const roofRear = pickup ? -0.88 : yaris ? -1.63 : -1.85;
  const rearBottom = pickup ? -1.06 : -2.36;
  const beltY = 1.39;
  const modelLabel = pickup ? 'HILUX' : rav4 ? 'RAV4' : yaris ? 'YARIS CROSS' : 'COROLLA CROSS';
  const taper = (y: number) => 1.01 - Math.max(0, y - beltY) * 0.28;

  function arch(x: number, outer = false): Outline {
    const radius = outer ? 0.63 : 0.555;
    if (rav4) return [[x - radius, 0.48], [x - radius, 0.80], [x - radius * 0.55, 1.10 + (outer ? 0.07 : 0)], [x + radius * 0.55, 1.10 + (outer ? 0.07 : 0)], [x + radius, 0.80], [x + radius, 0.48]];
    const points: Outline = [];
    for (let i = 0; i <= 20; i++) {
      const angle = Math.PI - i / 20 * Math.PI;
      points.push([x + Math.cos(angle) * radius, 0.49 + Math.sin(angle) * radius]);
    }
    return points;
  }
  function windowPanel(parent: THREE.Object3D, outline: Outline, sign: number, material: Material, inset = 0) {
    const item = sidePolygon(parent, outline, sign, 0.018, material, 'body', 0.012);
    const positions = item.geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + sign * (taper(positions.getY(i)) - 1 + inset));
    item.geometry.computeVertexNormals();
    return item;
  }
  function sideDepth(y: number) {
    return 1.057 + Math.sin(Math.max(0, Math.min(1, (y - 0.49) / 0.93)) * Math.PI) * 0.038;
  }
  function shutLine(parent: THREE.Object3D, outline: Outline, sign: number) {
    contour(parent, outline.map(([x, y]) => [x, y, sign * (sideDepth(y) + 0.008)]), seam, 0.0035);
  }
  function frontPanel(parent: THREE.Object3D, outline: Outline, x: number, material: Material) {
    const item = sidePolygon(parent, outline.map(([z, y]) => [-z, y]), 0, 0.025, material, 'body', 0.008);
    item.rotation.y = Math.PI / 2;
    item.position.x = x;
    return item;
  }
  function door(parent: THREE.Object3D, left: number, right: number, sign: number) {
    const vertices: number[] = [];
    const indices: number[] = [];
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
      const x = THREE.MathUtils.lerp(left, right, i / steps);
      const bottom = pickup ? 0.60 : 0.60 + Math.max(0, -x - 0.90) * 1.7;
      for (let j = 0; j <= steps; j++) {
        const y = THREE.MathUtils.lerp(bottom, 1.397, j / steps);
        vertices.push(x, y, sign * sideDepth(y));
        if (i < steps && j < steps) {
          const a = i * (steps + 1) + j;
          const face = [a, a + steps + 1, a + 1, a + 1, a + steps + 1, a + steps + 2];
          indices.push(...(sign > 0 ? face : face.reverse()));
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    mesh(parent, geometry, paint, 'body');
  }

  for (const sign of [-1, 1]) {
    const side = newGroup(`Panel lateral ${sign}`);
    const outline: Outline = [[-2.47, 0.58], ...arch(-1.5), ...arch(1.5), [2.46, 0.60], [2.43, pickup ? 1.36 : 1.30], [1.20, 1.43], [-2.22, 1.43], [-2.47, 1.20]];
    sidePolygon(side, outline, sign * 1.005, 0.065, paint, 'body', 0.020);
    for (const x of [-1.5, 1.5]) sidePolygon(side, [...arch(x, true), ...arch(x).reverse()], sign * 1.056, 0.065, black, 'body', 0.017);
    box(side, [1.83, 0.12, 0.12], [0, 0.53, sign * 1.04], black, 'body', 0.035);
    if (pickup) {
      box(side, [1.87, 0.065, 0.23], [-0.01, 0.435, sign * 1.08], darkMetal, 'body', 0.025);
      box(side, [1.77, 0.012, 0.16], [-0.01, 0.475, sign * 1.11], aluminum, 'body', 0.005);
      box(side, [1.44, 0.035, 0.15], [-1.75, 1.45, sign * 0.98], black, 'body', 0.015);
      shutLine(side, [[-1.06, 1.42], [-1.06, 1.15], [-1.06, 0.65]], sign);
    }
    const cabinOutline: Outline = [[rearBottom, 1.39], [roofRear - 0.16, roofY - 0.13], [roofRear, roofY - 0.025], [roofRear + 0.30, roofY + 0.012], [roofFront - 0.18, roofY + 0.012], [roofFront, roofY - 0.025], [1.25, 1.39]];
    windowPanel(side, cabinOutline, sign, paint, -0.02);
    const surround: Outline = [[rearBottom + 0.13, 1.445], [roofRear + 0.08, roofY - 0.065], [roofFront - 0.025, roofY - 0.065], [1.105, 1.445]];
    windowPanel(side, surround, sign, black, 0.010);
    windowPanel(side, [[0.025, 1.465], [1.005, 1.465], [roofFront - 0.06, roofY - 0.095], [0.025, roofY - 0.095]], sign, glass, 0.032);
    if (pickup) {
      windowPanel(side, [[-0.90, 1.465], [-0.085, 1.465], [-0.085, roofY - 0.095], [roofRear + 0.10, roofY - 0.095]], sign, glass, 0.032);
    } else {
      windowPanel(side, [[-1.18, 1.465], [-0.085, 1.465], [-0.085, roofY - 0.095], [-1.18, roofY - 0.095]], sign, glass, 0.032);
      windowPanel(side, [[rearBottom + 0.20, 1.475], [-1.29, 1.475], [-1.29, roofY - 0.115], [roofRear + 0.12, roofY - 0.115]], sign, glass, 0.032);
    }
    contour(side, [[rearBottom + 0.12, 1.427, sign * 1.038], [1.15, 1.427, sign * 1.038]], darkMetal, 0.008);
    door(side, 0.014, 0.90, sign);
    door(side, pickup ? -0.97 : -1.17, -0.014, sign);
    shutLine(side, [[0, 1.40], [0, 1.18], [0, 0.94], [0, 0.73], [0, 0.59], [0.85, 0.59], [0.91, 0.76], [0.91, 1.0], [0.91, 1.40]], sign);
    shutLine(side, pickup ? [[-0.98, 1.40], [-0.98, 1.16], [-0.98, 0.90], [-0.98, 0.59], [0, 0.59]] : [[-1.20, 1.40], [-1.20, 1.13], [-0.90, 0.80], [-0.90, 0.59], [0, 0.59]], sign);
    for (const x of [0.18, pickup ? -0.79 : -0.91]) {
      box(side, [0.20, 0.052, 0.020], [x, 1.32, sign * 1.082], black, 'body', 0.022);
      box(side, [0.18, 0.029, 0.038], [x, 1.333, sign * 1.100], pickup ? aluminum : paint, 'body', 0.013);
    }
    rod(side, new THREE.Vector3(0.94, 1.45, sign * 0.98), new THREE.Vector3(0.96, 1.49, sign * 1.14), 0.032, black, 'body');
    const mirror = box(side, [0.27, 0.145, 0.20], [1.00, 1.56, sign * 1.16], black, 'body', 0.050);
    mirror.rotation.y = sign * 0.15;
    box(side, [0.26, 0.09, 0.205], [1.00, 1.59, sign * 1.16], pickup ? paint : darkMetal, 'body', 0.035);
    box(side, [0.012, 0.10, 0.147], [0.86, 1.56, sign * 1.16], lens, 'body', 0.012);
    moving(side, [-0.06, 0.12, sign * 0.98], 0.16, 0.82, [0, sign * 0.12, 0]);
  }

  const roof = newGroup('Techo y cristales');
  box(roof, [roofFront - roofRear + 0.035, 0.055, 1.73], [(roofFront + roofRear) / 2, roofY - 0.006, 0], paint, 'body', 0.026);
  const roofVertices: number[] = [];
  const roofIndices: number[] = [];
  for (let i = 0; i <= 16; i++) for (let j = 0; j <= 16; j++) {
    const t = i / 16;
    const u = j / 16 * 2 - 1;
    roofVertices.push(roofRear + t * (roofFront - roofRear), roofY + 0.015 + Math.sin(t * Math.PI) * 0.047 + (1 - u * u) * 0.027, u * 0.876);
    if (i < 16 && j < 16) {
      const a = i * 17 + j;
      roofIndices.push(a, a + 1, a + 17, a + 1, a + 18, a + 17);
    }
  }
  const roofGeometry = new THREE.BufferGeometry();
  roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices, 3));
  roofGeometry.setIndex(roofIndices);
  roofGeometry.computeVertexNormals();
  mesh(roof, roofGeometry, paint, 'body');
  if (!pickup) {
    box(roof, [1.22, 0.012, 1.15], [-0.42, roofY + 0.092, 0], glass, 'body', 0.035);
    for (const sign of [-1, 1]) {
      box(roof, [2.07, 0.035, 0.052], [-0.64, roofY + 0.13, sign * 0.76], darkMetal, 'body', 0.015);
      for (const x of [-1.48, 0.20]) box(roof, [0.14, 0.06, 0.07], [x, roofY + 0.09, sign * 0.76], black, 'body', 0.018);
    }
  }
  surface(roof, [[1.25, 1.42, -0.97], [1.25, 1.42, 0.97], [roofFront + 0.015, roofY - 0.01, 0.85], [roofFront + 0.015, roofY - 0.01, -0.85]], glass);
  for (const sign of [-1, 1]) {
    rod(roof, new THREE.Vector3(1.25, 1.42, sign * 0.99), new THREE.Vector3(roofFront + 0.015, roofY, sign * 0.88), 0.035, paint, 'body');
    rod(roof, new THREE.Vector3(1.255, 1.46, sign * 0.10), new THREE.Vector3(1.17, 1.49, sign * 0.72), 0.009, black, 'body');
  }
  if (pickup) {
    surface(roof, [[rearBottom, 1.39, -0.97], [rearBottom, 1.39, 0.97], [roofRear - 0.03, roofY - 0.02, 0.875], [roofRear - 0.03, roofY - 0.02, -0.875]], paint);
    surface(roof, [[rearBottom + 0.012, 1.48, -0.79], [rearBottom + 0.012, 1.48, 0.79], [roofRear - 0.064, roofY - 0.10, 0.75], [roofRear - 0.064, roofY - 0.10, -0.75]], glass);
  } else {
    surface(roof, [[rearBottom - 0.025, 1.43, 0.91], [rearBottom - 0.025, 1.43, -0.91], [roofRear - 0.03, roofY - 0.02, -0.85], [roofRear - 0.03, roofY - 0.02, 0.85]], glass);
    box(roof, [0.24, 0.07, 1.83], [roofRear - 0.035, roofY + 0.02, 0], paint, 'body', 0.020);
    box(roof, [0.015, 0.018, 0.54], [roofRear - 0.16, roofY + 0.01, 0], tailLight, 'body', 0.004);
  }
  moving(roof, [-0.20, 1.62, 0], 0.04, 0.68, [0, 0, -0.035]);

  if (pickup) {
    const bed = newGroup('Platón abierto');
    box(bed, [1.34, 0.075, 1.85], [-1.76, 0.98, 0], black, 'body', 0.020);
    for (let i = 0; i < 11; i++) box(bed, [1.27, 0.016, 0.025], [-1.76, 1.028, -0.78 + i * 0.156], darkMetal, 'body', 0.005);
    box(bed, [0.065, 0.41, 1.85], [-1.08, 1.21, 0], black, 'body', 0.012);
    for (const sign of [-1, 1]) box(bed, [1.35, 0.41, 0.045], [-1.76, 1.21, sign * 0.91], black, 'body', 0.010);
    moving(bed, [-0.32, 0.63, 0], 0.24, 0.90);
  }

  const hood = newGroup('Capó');
  const vertices: number[] = [];
  const indices: number[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    for (let j = 0; j <= steps; j++) {
      const u = j / steps * 2 - 1;
      const shoulder = Math.exp(-Math.pow((Math.abs(u) - 0.69) / 0.14, 2)) * (rav4 ? 0.035 : 0.020);
      vertices.push(1.22 + t * 1.19, 1.439 - t * (pickup ? 0.07 : 0.13) + (1 - u * u) * 0.042 + shoulder, u * (0.96 - t * 0.045));
      if (i < steps && j < steps) {
        const a = i * (steps + 1) + j;
        indices.push(a, a + 1, a + steps + 1, a + 1, a + steps + 2, a + steps + 1);
      }
    }
  }
  const hoodGeometry = new THREE.BufferGeometry();
  hoodGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  hoodGeometry.setIndex(indices);
  hoodGeometry.computeVertexNormals();
  mesh(hood, hoodGeometry, paint, 'body');
  sidePolygon(hood, [[1.22, 1.39], [2.41, pickup ? 1.32 : 1.26], [2.41, pickup ? 1.369 : 1.309], [1.22, 1.439]], 0, 1.82, paint, 'body', 0.008);
  for (const sign of [-1, 1]) {
    sidePolygon(hood, [[1.22, 1.40], [2.41, pickup ? 1.33 : 1.27], [2.41, pickup ? 1.37 : 1.31], [1.22, 1.44]], sign * 0.937, 0.045, paint, 'body', 0.008);
    contour(hood, [[1.22, 1.443, sign * 0.969], [2.41, pickup ? 1.374 : 1.314, sign * 0.921]], seam, 0.003);
  }
  moving(hood, [0.68, 1.12, 0], 0.15, 0.74, [0, 0, -0.21]);

  const nose = newGroup('Frontal');
  box(nose, [0.16, 0.72, 1.91], [2.39, 0.94, 0], paint, 'body', pickup ? 0.07 : 0.078);
  box(nose, [0.18, 0.19, 1.98], [2.43, 0.50, 0], black, 'body', 0.055);
  box(nose, [0.07, 0.045, 1.33], [2.535, 0.433, 0], aluminum, 'body', 0.015);
  const grilleWidth = pickup ? 1.40 : yaris ? 1.24 : 1.34;
  box(nose, [0.075, pickup ? 0.47 : 0.34, grilleWidth], [2.495, pickup ? 1.00 : 0.99, 0], pickup ? black : darkMetal, 'body', 0.045);
  if (pickup) {
    for (const z of [-0.77, 0.77]) {
      const edge = box(nose, [0.045, 0.43, 0.057], [2.55, 0.99, z], aluminum, 'body', 0.013);
      edge.rotation.x = z > 0 ? -0.25 : 0.25;
    }
    for (let i = 0; i < 7; i++) box(nose, [0.022, 0.018, 1.34 - Math.abs(i - 3) * 0.045], [2.543, 0.81 + i * 0.062, 0], darkMetal, 'body', 0.006);
  } else {
    // Hexagonal grille inserts share a single geometry/material and one draw call.
    const grilleFinish = box(nose, [0.01, 0.01, 0.01], [2.49, 0.99, 0], modelId === 'corolla-cross' ? paint : darkMetal, 'body').material;
    const cells = new THREE.InstancedMesh(new THREE.TorusGeometry(yaris ? 0.052 : 0.039, 0.007, 4, 6), grilleFinish, 60);
    const transform = new THREE.Object3D();
    let index = 0;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 15; col++) {
      transform.position.set(2.548, 0.875 + row * 0.068, (col - 7) * 0.082 + row % 2 * 0.04);
      transform.rotation.set(0, Math.PI / 2, 0);
      transform.updateMatrix();
      cells.setMatrixAt(index++, transform.matrix);
    }
    nose.add(cells);
  }
  box(nose, [0.08, 0.16, 1.13], [2.49, 0.668, 0], black, 'body', 0.024);
  for (let i = 0; i < 3; i++) box(nose, [0.018, 0.014, 1.04], [2.54, 0.62 + i * 0.04, 0], darkMetal, 'body', 0.004);
  box(nose, [0.026, 0.15, 0.47], [2.58, 0.75, 0], black, 'body', 0.008);
  lettering(nose, modelLabel, [2.599, 0.75, 0], 0.40, 0.075);
  const badge = mesh(nose, new THREE.TorusGeometry(0.063, 0.009, 6, 28), aluminum, 'body', [2.57, pickup ? 1.12 : 1.245, 0]);
  badge.rotation.y = Math.PI / 2;
  badge.scale.set(1.35, 0.85, 1);
  for (const sign of [-1, 1]) {
    const lightShape: Outline = pickup
      ? [[0.49, 1.19], [0.95, 1.22], [0.99, 1.40], [0.51, 1.34]]
      : yaris
        ? [[0.48, 1.19], [0.65, 1.15], [0.94, 1.17], [0.99, 1.36], [0.85, 1.35]]
        : rav4
          ? [[0.48, 1.22], [0.93, 1.19], [0.99, 1.38], [0.56, 1.34]]
          : [[0.46, 1.22], [0.72, 1.17], [0.95, 1.21], [0.99, 1.36], [0.72, 1.30]];
    frontPanel(nose, lightShape.map(([z, y]) => [sign * z, y]), 2.49, black);
    const upper = pickup ? 1.34 : yaris ? 1.30 : 1.31;
    contour(nose, [[2.517, upper - 0.04, sign * 0.54], [2.517, upper, sign * 0.80], [2.517, upper + 0.035, sign * 0.95], [2.517, upper - 0.065, sign * 0.93]], led, 0.008);
    for (const z of [0.73, 0.86]) box(nose, [0.018, 0.052, 0.065], [2.517, pickup ? 1.265 : 1.245, sign * z], lens, 'body', 0.015);
    box(nose, [0.06, rav4 ? 0.33 : 0.25, 0.15], [2.492, 0.86, sign * 0.845], black, 'body', 0.032);
    box(nose, [0.025, 0.041, 0.095], [2.535, 0.75, sign * 0.845], lens, 'body', 0.012);
  }
  moving(nose, [0.49, 0.04, 0], 0.29, 0.92);

  const rear = newGroup('Portón y defensa trasera');
  box(rear, [0.14, 0.78, 1.95], [-2.43, 1.01, 0], paint, 'body', 0.050);
  box(rear, [0.15, 0.20, 1.99], [-2.48, 0.52, 0], black, 'body', 0.035);
  box(rear, [0.025, 0.15, 0.47], [-2.52, 0.88, 0], black, 'body', 0.008);
  lettering(rear, modelLabel, [-2.537, 0.88, 0], 0.40, 0.075, true);
  lettering(rear, 'T O Y O T A', [-2.517, 1.25, 0], 0.62, 0.07, true);
  if (pickup) {
    box(rear, [0.045, 0.05, 0.22], [-2.52, 1.35, 0], darkMetal, 'body', 0.015);
    for (const sign of [-1, 1]) {
      box(rear, [0.065, 0.43, 0.16], [-2.523, 1.20, sign * 0.88], tailLight, 'body', 0.028);
      box(rear, [0.015, 0.07, 0.13], [-2.564, 1.20, sign * 0.88], lens, 'body', 0.009);
    }
  } else {
    for (const sign of [-1, 1]) {
      box(rear, [0.045, 0.12, 0.58], [-2.518, 1.32, sign * 0.66], black, 'body', 0.020);
      box(rear, [0.020, 0.033, 0.52], [-2.550, 1.35, sign * 0.66], tailLight, 'body', 0.010);
      box(rear, [0.020, 0.08, 0.035], [-2.551, 1.32, sign * 0.91], tailLight, 'body', 0.009);
    }
    rod(rear, new THREE.Vector3(-2.37, 1.47, 0), new THREE.Vector3(-2.34, 1.52, 0.48), 0.010, black, 'body');
  }
  moving(rear, [-0.45, 0.10, 0], 0.30, 0.93);
}
