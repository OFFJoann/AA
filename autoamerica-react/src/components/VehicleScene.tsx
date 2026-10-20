import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import VehicleFallback from './VehicleFallback';
import { getVehicleModel } from '../vehicleModels';
import type { VehicleModelId } from '../vehicleModels';
import { buildVehicleExterior } from './vehicleExterior';
import { motionAmount, motionPlan } from './explosionLayout';
import type { MotionPlan } from './explosionLayout';

export interface VehicleSceneProps {
  modelId?: VehicleModelId;
  progress: number;
  selectedPart: string | null;
  color: string;
  onSelectPart?: (id: string) => void;
  className?: string;
  autoRotate?: boolean;
  view?: 'perspective' | 'front' | 'side' | 'rear';
  resetView?: number;
}

type Family = 'body' | 'engine' | 'brakes' | 'suspension' | 'battery';
type ExplodedPart = {
  group: THREE.Group;
  start: THREE.Vector3;
  offset: THREE.Vector3;
  plan: MotionPlan;
};

/** Original visual study of the Prado 250 exterior; mechanical assemblies are schematic. */
export default function VehicleScene(props: VehicleSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  const invalidate = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  latest.current = props;

  useEffect(() => { invalidate.current(); }, [props.progress, props.color, props.selectedPart, props.autoRotate, props.view, props.resetView]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const model = getVehicleModel(props.modelId);
    const pickup = model.silhouette === 'pickup';
    setFailed(false);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', `Modelo 3D inspirado en ${model.name}. Arrastra para girarlo; usa la lista de sistemas para seleccionar piezas.`);
    canvas.setAttribute('role', 'img');
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;outline:none;';
    host.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.03;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1.6, 0.1, 65);
    camera.position.set(8.0, 3.8, 8.8);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0.1, 1.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.19;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.rotateSpeed = 0.48;
    controls.autoRotateSpeed = 0.42;
    // OrbitControls sets touch-action:none; restore vertical page scrolling.
    canvas.style.touchAction = 'pan-y';
    controls.update();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const studio = new RoomEnvironment();
    const environment = pmrem.fromScene(studio, 0.03);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.9;
    studio.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xe8efff, 0x252b27, 1.25));
    const key = new THREE.DirectionalLight(0xfff8ed, 3.1);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 3;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.normalBias = 0.04;
    key.shadow.bias = -0.0001;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb8d2ee, 2.2);
    rim.position.set(-4, 5, -5);
    scene.add(rim);
    const frontFill = new THREE.DirectionalLight(0xffffff, 0.8);
    frontFill.position.set(7, 2, -2);
    scene.add(frontFill);

    const car = new THREE.Group();
    scene.add(car);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), new THREE.ShadowMaterial({ opacity: 0.28, color: 0x000000 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.005;
    floor.receiveShadow = true;
    scene.add(floor);

    const platform = new THREE.Mesh(new THREE.RingGeometry(3.68, 3.695, 100), new THREE.MeshBasicMaterial({ color: 0x6c7776, transparent: true, opacity: 0.19, side: THREE.DoubleSide }));
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = 0.002;
    scene.add(platform);

    const paint = new THREE.MeshPhysicalMaterial({ color: props.color, metalness: 0.48, roughness: 0.27, clearcoat: 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide });
    const aluminum = new THREE.MeshStandardMaterial({ color: 0xa1acb4, metalness: 0.86, roughness: 0.27 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x262c30, metalness: 0.68, roughness: 0.39 });
    const black = new THREE.MeshStandardMaterial({ color: 0x111719, metalness: 0.12, roughness: 0.64 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x0e1215, roughness: 0.87 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x17282c, metalness: 0, roughness: .19, clearcoat: .40, clearcoatRoughness: .12, envMapIntensity: .55, side: THREE.DoubleSide });
    const lens = new THREE.MeshPhysicalMaterial({ color: 0xbac9ce, metalness: 0.15, roughness: 0.12, clearcoat: 1 });
    const indicator = new THREE.MeshStandardMaterial({ color: 0xe69a31, emissive: 0xb76416, emissiveIntensity: 0.18, roughness: 0.3 });
    const seam = new THREE.MeshStandardMaterial({ color: 0x202a29, roughness: 0.72 });
    const red = new THREE.MeshStandardMaterial({ color: 0xc6282b, metalness: 0.50, roughness: 0.28 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xea7228, metalness: 0.28, roughness: 0.37 });
    const led = new THREE.MeshStandardMaterial({ color: 0xedf9ff, emissive: 0xc5e9ff, emissiveIntensity: 0.8, roughness: 0.25 });
    const tailLight = new THREE.MeshStandardMaterial({ color: 0xe92535, emissive: 0xc91229, emissiveIntensity: 1.25, roughness: 0.25 });
    const batteryCell = new THREE.MeshStandardMaterial({ color: 0x405867, metalness: 0.67, roughness: 0.35 });
    const sourceMaterials = [paint, aluminum, darkMetal, black, rubber, glass, lens, indicator, seam, red, orange, led, tailLight, batteryCell];
    const textures: THREE.Texture[] = [];
    const materialCache = new Map<string, THREE.MeshStandardMaterial>();
    const familyMaterials: Array<{ material: THREE.MeshStandardMaterial; family: Family; originalEmissive: THREE.Color; originalIntensity: number }> = [];
    const painted: THREE.MeshStandardMaterial[] = [];
    const selectable: THREE.Mesh[] = [];
    const exploded: ExplodedPart[] = [];

    function materialFor(source: THREE.MeshStandardMaterial, family: Family) {
      const id = source.uuid + ':' + family;
      const cached = materialCache.get(id);
      if (cached) return cached;
      const material = source.clone();
      materialCache.set(id, material);
      familyMaterials.push({ material, family, originalEmissive: material.emissive.clone(), originalIntensity: material.emissiveIntensity });
      if (source === paint) painted.push(material);
      return material;
    }
    function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.MeshStandardMaterial, family: Family, position: [number, number, number] = [0, 0, 0]) {
      const item = new THREE.Mesh(geometry, materialFor(material, family));
      item.position.set(...position);
      item.castShadow = true;
      item.receiveShadow = true;
      item.userData.family = family;
      selectable.push(item);
      parent.add(item);
      return item;
    }
    function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.MeshStandardMaterial, family: Family, radius = 0.035) {
      return mesh(parent, radius ? new RoundedBoxGeometry(...size, 2, Math.min(radius, Math.min(...size) / 2)) : new THREE.BoxGeometry(...size), material, family, position);
    }
    function cylinder(parent: THREE.Object3D, radius: number, length: number, position: [number, number, number], material: THREE.MeshStandardMaterial, family: Family, axis: 'x' | 'y' | 'z' = 'y', segments = 28) {
      const item = mesh(parent, new THREE.CylinderGeometry(radius, radius, length, segments), material, family, position);
      if (axis === 'x') item.rotation.z = Math.PI / 2;
      if (axis === 'z') item.rotation.x = Math.PI / 2;
      return item;
    }
    function rod(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.MeshStandardMaterial, family: Family) {
      const item = cylinder(parent, radius, a.distanceTo(b), [0, 0, 0], material, family);
      item.position.copy(a).add(b).multiplyScalar(0.5);
      item.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      return item;
    }
    function sidePolygon(parent: THREE.Object3D, points: Array<[number, number]>, z: number, thickness: number, material: THREE.MeshStandardMaterial, family: Family, bevel = 0.012) {
      const shape = new THREE.Shape();
      shape.moveTo(...points[0]);
      points.slice(1).forEach(point => shape.lineTo(...point));
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, steps: 1, curveSegments: 24 });
      geometry.translate(0, 0, z - thickness / 2);
      return mesh(parent, geometry, material, family);
    }
    function moving(group: THREE.Group, offset: [number, number, number], from = 0, to = 1, _spin?: [number, number, number]) {
      const plan = motionPlan(group.name, { offset, from, to });
      exploded.push({ group, start: group.position.clone(), offset: new THREE.Vector3(...plan.offset), plan });
    }
    function newGroup(name: string) {
      const group = new THREE.Group();
      group.name = name;
      car.add(group);
      return group;
    }

    // Thin ribbons follow the actual panel contours instead of floating rectangular seams.
    function contour(parent: THREE.Object3D, points: Array<[number, number, number]>, material = seam, radius = 0.004) {
      const curve = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 1; i < points.length; i++) curve.add(new THREE.LineCurve3(new THREE.Vector3(...points[i - 1]), new THREE.Vector3(...points[i])));
      return mesh(parent, new THREE.TubeGeometry(curve, Math.max(8, points.length * 3), radius, 5, false), material, 'body');
    }
    function surface(parent: THREE.Object3D, points: Array<[number, number, number]>, material: THREE.MeshStandardMaterial) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
      const indices: number[] = [];
      for (let i = 1; i < points.length - 1; i++) indices.push(0, i, i + 1);
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return mesh(parent, geometry, material, 'body');
    }
    function cabinPanel(parent: THREE.Object3D, points: Array<[number, number]>, sign: number, material: THREE.MeshStandardMaterial, inset = 0) {
      const item = sidePolygon(parent, points, sign * 1.0, 0.018, material, 'body', 0.006);
      const positions = item.geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i++) {
        positions.setZ(i, positions.getZ(i) - sign * (Math.max(0, positions.getY(i) - 1.39) * 0.19 + inset));
      }
      item.geometry.computeVertexNormals();
      return item;
    }
    function skinDepth(y: number) {
      return 1.077 + Math.sin(THREE.MathUtils.clamp((y - 0.48) / 0.98, 0, 1) * Math.PI) * 0.025;
    }
    function doorSkin(parent: THREE.Object3D, left: number, right: number, sign: number) {
      const vertices: number[] = [];
      const indices: number[] = [];
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const x = THREE.MathUtils.lerp(left, right, i / steps);
        const bottom = 0.60 + Math.max(0, -x - 0.88) * 1.75;
        for (let j = 0; j <= steps; j++) {
          const y = THREE.MathUtils.lerp(bottom, 1.432, j / steps);
          vertices.push(x, y, sign * skinDepth(y));
          if (i < steps && j < steps) {
            const a = i * (steps + 1) + j;
            const triangle = [a, a + steps + 1, a + 1, a + 1, a + steps + 1, a + steps + 2];
            indices.push(...(sign > 0 ? triangle : triangle.reverse()));
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      mesh(parent, geometry, paint, 'body');
    }
    function panelLine(parent: THREE.Object3D, points: Array<[number, number]>, sign: number) {
      contour(parent, points.map(([x, y]) => [x, y, sign * (skinDepth(y) + 0.003)]));
    }
    function lettering(parent: THREE.Object3D, text: string, position: [number, number, number], width: number, height: number, back = false) {
      const label = document.createElement('canvas');
      label.width = 1024;
      label.height = 256;
      const context = label.getContext('2d');
      if (!context) return;
      context.fillStyle = '#cdd4d1';
      context.font = '600 126px Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 512, 139, 970);
      const texture = new THREE.CanvasTexture(label);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.4, metalness: 0.35, depthWrite: false });
      sourceMaterials.push(material);
      const item = mesh(parent, new THREE.PlaneGeometry(width, height), material, 'body', position);
      item.rotation.y = back ? -Math.PI / 2 : Math.PI / 2;
      item.castShadow = false;
    }

    // Ladder frame, visible when the body separates.
    const chassis = newGroup('Chasis');
    for (const z of [-0.61, 0.61]) box(chassis, [4.40, 0.17, 0.14], [0, 0.43, z], darkMetal, 'suspension');
    for (const x of [-1.5, -0.75, 0.4, 1.5]) box(chassis, [0.13, 0.12, 1.34], [x, 0.43, 0], darkMetal, 'suspension');
    box(chassis, [2.8, 0.10, 1.68], [-0.5, 0.76, 0], black, 'body');
    cylinder(chassis, 0.058, 2.6, [-0.25, 0.46, 0], aluminum, 'engine', 'x');
    for (const x of [-1.50, 1.50]) {
      cylinder(chassis, 0.066, 1.78, [x, 0.49, 0], darkMetal, 'suspension', 'z');
      const differential = mesh(chassis, new THREE.SphereGeometry(0.17, 20, 16), darkMetal, 'suspension', [x, 0.49, 0]);
      differential.scale.set(1.1, 0.82, 1);
    }

    // Prado-inspired shoulder, upright cabin and chamfered (rather than circular) arches.
    const axlePositions = [-1.50, 1.50];
    if (model.id === 'prado') {
    function archPoints(x: number, outer = false): Array<[number, number]> {
      const w = outer ? 0.64 : 0.56;
      const top = outer ? 1.14 : 1.065;
      return [[x - w, 0.48], [x - w, 0.78], [x - w * 0.67, top - 0.045], [x - w * 0.42, top], [x + w * 0.42, top], [x + w * 0.67, top - 0.045], [x + w, 0.78], [x + w, 0.48]];
    }
    for (const sign of [-1, 1]) {
      const side = newGroup(sign === 1 ? 'Panel lateral derecho' : 'Panel lateral izquierdo');
      const outline: Array<[number, number]> = [[-2.49, 0.55], ...archPoints(-1.5), ...archPoints(1.5), [2.48, 0.56], [2.47, 1.24], [2.29, 1.40], [1.30, 1.45], [-2.29, 1.44], [-2.48, 1.27]];
      const panel = sidePolygon(side, outline, sign * 1.005, 0.09, paint, 'body', 0.025);
      // A subtle crown in the door skin catches the studio reflections.
      const skin = panel.geometry.getAttribute('position');
      for (let i = 0; i < skin.count; i++) {
        const y = skin.getY(i);
        skin.setZ(i, skin.getZ(i) + sign * Math.sin(THREE.MathUtils.clamp((y - 0.48) / 0.98, 0, 1) * Math.PI) * 0.018);
      }
      panel.geometry.computeVertexNormals();
      doorSkin(side, 0.012, 0.87, sign);
      doorSkin(side, -1.17, -0.012, sign);
      for (const x of axlePositions) {
        const inner = archPoints(x);
        const outer = archPoints(x, true);
        sidePolygon(side, [...outer, ...inner.slice().reverse()], sign * 1.068, 0.072, black, 'body', 0.018);
        // Inner liners add actual depth between the fender lip and the tyre.
        contour(side, inner.map(([px, py]) => [px, py, sign * 0.99]), black, 0.033);
      }
      sidePolygon(side, [[-0.90, 0.49], [0.91, 0.49], [0.91, 0.61], [-0.87, 0.61]], sign * 1.055, 0.05, black, 'body');
      box(side, [1.87, 0.067, 0.23], [-0.01, 0.425, sign * 1.07], black, 'body', 0.018);
      box(side, [1.77, 0.014, 0.16], [-0.01, 0.466, sign * 1.11], darkMetal, 'body', 0.005);
      for (const z of [1.07, 1.12, 1.17]) box(side, [1.72, 0.008, 0.009], [-0.01, 0.477, sign * z], aluminum, 'body', 0.003);

      cabinPanel(side, [[-2.43, 1.39], [-2.30, 1.97], [0.73, 2.00], [1.36, 1.40]], sign, paint, 0.025);
      cabinPanel(side, [[-2.32, 1.45], [-2.23, 1.92], [0.72, 1.95], [1.24, 1.45]], sign, black, -0.004);
      cabinPanel(side, [[0.035, 1.475], [1.15, 1.475], [0.695, 1.904], [0.035, 1.904]], sign, glass, -0.020);
      cabinPanel(side, [[-1.115, 1.475], [-0.082, 1.475], [-0.082, 1.907], [-1.115, 1.907]], sign, glass, -0.020);
      cabinPanel(side, [[-2.27, 1.48], [-1.235, 1.48], [-1.235, 1.902], [-2.19, 1.902]], sign, glass, -0.020);
      contour(side, [[-2.29, 1.445, sign * 1.017], [1.29, 1.445, sign * 1.017]], black, 0.011);
      // Door shut lines stop at the wheel openings and follow the lower sill.
      panelLine(side, [[0.0, 1.43], [0.0, 1.20], [0.0, 0.97], [0.0, 0.76], [0.0, 0.59], [0.75, 0.59], [0.87, 0.72], [0.88, 0.97], [0.88, 1.20], [0.88, 1.43]], sign);
      panelLine(side, [[-1.19, 1.43], [-1.19, 1.20], [-1.19, 1.12], [-0.91, 0.82], [-0.91, 0.59], [0, 0.59]], sign);
      panelLine(side, [[1.30, 1.43], [1.31, 1.17]], sign);
      for (const x of [0.19, -0.94]) {
        box(side, [0.22, 0.069, 0.012], [x, 1.335, sign * 1.066], darkMetal, 'body', 0.029);
        box(side, [0.20, 0.036, 0.046], [x + 0.015, 1.348, sign * 1.085], paint, 'body', 0.016);
      }
      if (sign === 1) {
        panelLine(side, [[-1.97, 1.34], [-1.71, 1.34], [-1.71, 1.14], [-1.97, 1.14], [-1.97, 1.34]], sign);
      }
      rod(side, new THREE.Vector3(1.05, 1.45, sign * 0.99), new THREE.Vector3(1.02, 1.49, sign * 1.16), 0.048, black, 'body');
      box(side, [0.23, 0.21, 0.18], [1.04, 1.60, sign * 1.18], black, 'body', 0.035);
      box(side, [0.235, 0.17, 0.185], [1.045, 1.63, sign * 1.19], paint, 'body', 0.033);
      box(side, [0.010, 0.14, 0.145], [0.922, 1.625, sign * 1.19], lens, 'body', 0.009);
      box(side, [0.13, 0.015, 0.008], [1.075, 1.58, sign * 1.287], indicator, 'body', 0.004);
      moving(side, [-0.09, 0.14, sign * 1.0], 0.16, 0.82, [0, sign * 0.13, 0]);
    }

    const roof = newGroup('Techo y cristales');
    box(roof, [3.13, 0.105, 1.85], [-0.78, 2.008, 0], paint, 'body', 0.048);
    box(roof, [1.29, 0.012, 1.19], [-0.33, 2.067, 0], black, 'body', 0.035);
    box(roof, [1.19, 0.009, 1.09], [-0.33, 2.075, 0], glass, 'body', 0.025);
    for (const z of [-0.80, 0.80]) {
      box(roof, [2.62, 0.045, 0.055], [-0.79, 2.13, z], darkMetal, 'body', 0.020);
      for (const x of [-1.88, 0.30]) box(roof, [0.22, 0.07, 0.083], [x, 2.09, z], black, 'body', 0.024);
    }
    surface(roof, [[1.335, 1.425, -0.96], [1.335, 1.425, 0.96], [0.755, 1.974, 0.878], [0.755, 1.974, -0.878]], glass);
    contour(roof, [[1.34, 1.42, -0.96], [1.34, 1.42, 0.96]], black, 0.025);
    for (const sign of [-1, 1]) {
      rod(roof, new THREE.Vector3(1.33, 1.43, sign * 0.985), new THREE.Vector3(0.77, 1.98, sign * 0.905), 0.037, paint, 'body');
      rod(roof, new THREE.Vector3(1.35, 1.46, sign * 0.21), new THREE.Vector3(1.27, 1.49, sign * 0.72), 0.012, black, 'body');
    }
    surface(roof, [[-2.458, 1.43, 0.91], [-2.458, 1.43, -0.91], [-2.33, 1.95, -0.86], [-2.33, 1.95, 0.86]], glass);
    box(roof, [0.25, 0.07, 1.88], [-2.29, 1.998, 0], paint, 'body', 0.024);
    box(roof, [0.017, 0.02, 0.63], [-2.427, 1.994, 0], tailLight, 'body', 0.005);
    const antenna = mesh(roof, new THREE.SphereGeometry(0.09, 16, 12), black, 'body', [-1.78, 2.07, 0]);
    antenna.scale.set(1.7, 0.65, 0.45);
    moving(roof, [-0.22, 1.72, 0], 0.04, 0.68, [0, 0, -0.035]);

    const hood = newGroup('Capó');
    // A continuous crowned bonnet with stamped shoulders, not a flat box.
    const hoodVertices: number[] = [];
    const hoodIndices: number[] = [];
    const hoodSegments = 20;
    for (let i = 0; i <= hoodSegments; i++) {
      const t = i / hoodSegments;
      for (let j = 0; j <= hoodSegments; j++) {
        const u = j / hoodSegments * 2 - 1;
        const shoulder = Math.exp(-Math.pow((Math.abs(u) - 0.70) / 0.12, 2)) * 0.027;
        hoodVertices.push(1.31 + t * 1.13, 1.472 - t * 0.055 + (1 - u * u) * 0.032 + shoulder, u * (0.961 - t * 0.014));
        if (i < hoodSegments && j < hoodSegments) {
          const a = i * (hoodSegments + 1) + j;
          hoodIndices.push(a, a + 1, a + hoodSegments + 1, a + 1, a + hoodSegments + 2, a + hoodSegments + 1);
        }
      }
    }
    const hoodGeometry = new THREE.BufferGeometry();
    hoodGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hoodVertices, 3));
    hoodGeometry.setIndex(hoodIndices);
    hoodGeometry.computeVertexNormals();
    mesh(hood, hoodGeometry, paint, 'body');
    for (const sign of [-1, 1]) sidePolygon(hood, [[1.31, 1.438], [2.44, 1.385], [2.44, 1.417], [1.31, 1.472]], sign * 0.957, 0.025, paint, 'body', 0.005);
    box(hood, [0.045, 0.075, 1.90], [2.432, 1.414, 0], paint, 'body', 0.012);
    for (const sign of [-1, 1]) contour(hood, [[1.31, 1.47, sign * 0.97], [2.435, 1.415, sign * 0.956]], seam, 0.004);
    moving(hood, [0.70, 1.18, 0], 0.15, 0.74, [0, 0, -0.21]);

    const nose = newGroup('Frontal');
    box(nose, [0.16, 0.72, 1.98], [2.43, 1.01, 0], paint, 'body', 0.055);
    // Continuous upper grille and lamps sit flush with the body.
    box(nose, [0.055, 0.285, 1.91], [2.522, 1.244, 0], black, 'body', 0.026);
    box(nose, [0.018, 0.014, 1.86], [2.556, 1.391, 0], aluminum, 'body', 0.004);
    for (let i = 0; i < 19; i++) box(nose, [0.018, 0.20, 0.014], [2.556, 1.255, -0.51 + i * 0.057], darkMetal, 'body', 0.003);
    for (const y of [1.16, 1.24, 1.32]) box(nose, [0.025, 0.013, 1.10], [2.566, y, 0], darkMetal, 'body', 0.003);
    box(nose, [0.017, 0.09, 0.67], [2.586, 1.263, 0], black, 'body', 0.004);
    lettering(nose, 'T O Y O T A', [2.599, 1.265, 0], 0.63, 0.095);
    box(nose, [0.19, 0.25, 2.01], [2.455, 0.56, 0], black, 'body', 0.045);
    box(nose, [0.13, 0.29, 0.96], [2.52, 0.835, 0], black, 'body', 0.018);
    for (let i = 0; i < 12; i++) box(nose, [0.020, 0.21, 0.015], [2.591, 0.82, -0.44 + i * 0.08], darkMetal, 'body', 0.002);
    box(nose, [0.022, 0.19, 0.45], [2.611, 0.91, 0], black, 'body', 0.006);
    lettering(nose, 'PRADO', [2.626, 0.91, 0], 0.37, 0.085);
    box(nose, [0.13, 0.07, 1.31], [2.51, 0.437, 0], aluminum, 'body', 0.018);
    for (const z of [-0.41, 0, 0.41]) box(nose, [0.018, 0.045, 0.15], [2.585, 0.43, z], darkMetal, 'body', 0.005);
    for (const sign of [-1, 1]) {
      box(nose, [0.027, 0.182, 0.371], [2.561, 1.276, sign * 0.753], lens, 'body', 0.012);
      for (let j = 0; j < 3; j++) {
        box(nose, [0.020, 0.106, 0.083], [2.582, 1.272, sign * (0.628 + j * 0.102)], darkMetal, 'body', 0.009);
        const projector = box(nose, [0.025, 0.074, 0.028], [2.598, 1.278, sign * (0.641 + j * 0.102)], led, 'body', 0.008);
        projector.rotation.x = sign * -0.25;
      }
      box(nose, [0.025, 0.014, 0.312], [2.599, 1.362, sign * 0.742], led, 'body', 0.004);
      box(nose, [0.036, 0.16, 0.052], [2.583, 1.278, sign * 0.936], indicator, 'body', 0.006);
      box(nose, [0.17, 0.32, 0.48], [2.50, 0.934, sign * 0.75], paint, 'body', 0.055);
      box(nose, [0.019, 0.095, 0.16], [2.595, 0.873, sign * 0.75], black, 'body', 0.012);
      box(nose, [0.023, 0.044, 0.085], [2.609, 0.878, sign * 0.75], lens, 'body', 0.009);
      cylinder(nose, 0.019, 0.009, [2.592, 0.727, sign * 0.91], darkMetal, 'body', 'x', 12);
    }
    moving(nose, [0.50, 0.05, 0], 0.29, 0.92);

    const rear = newGroup('Portón y defensa trasera');
    box(rear, [0.14, 0.79, 1.98], [-2.44, 1.045, 0], paint, 'body', 0.035);
    box(rear, [0.14, 0.22, 2.02], [-2.49, 0.53, 0], black, 'body', 0.035);
    box(rear, [0.06, 0.045, 1.29], [-2.57, 0.432, 0], aluminum, 'body', 0.012);
    for (const sign of [-1, 1]) {
      box(rear, [0.07, 0.46, 0.14], [-2.533, 1.28, sign * 0.91], black, 'body', 0.023);
      for (const y of [1.16, 1.37, 1.46]) box(rear, [0.025, 0.064, 0.099], [-2.577, y, sign * 0.91], tailLight, 'body', 0.010);
      box(rear, [0.027, 0.052, 0.10], [-2.578, 1.26, sign * 0.91], lens, 'body', 0.008);
      box(rear, [0.01, 0.035, 0.18], [-2.567, 0.53, sign * 0.76], tailLight, 'body', 0.007);
    }
    contour(rear, [[-2.517, 1.42, -0.78], [-2.517, 0.72, -0.78], [-2.517, 0.68, 0.78], [-2.517, 1.42, 0.78]], seam, 0.004);
    box(rear, [0.015, 0.18, 0.49], [-2.52, 0.94, 0], black, 'body', 0.009);
    lettering(rear, 'PRADO', [-2.535, 0.94, 0], 0.37, 0.085, true);
    lettering(rear, 'T O Y O T A', [-2.522, 1.30, 0], 0.61, 0.07, true);
    rod(rear, new THREE.Vector3(-2.46, 1.48, -0.08), new THREE.Vector3(-2.43, 1.53, 0.51), 0.010, black, 'body');
    moving(rear, [-0.46, 0.10, 0], 0.30, 0.93);
    } else {
      buildVehicleExterior({
        modelId: model.id,
        materials: { paint, aluminum, darkMetal, black, glass, lens, led, tailLight, seam },
        mesh, box, rod, sidePolygon, surface, contour, newGroup, moving, lettering,
      });
    }

    // Interior remains attached to the chassis after the exterior separates.
    const interior = newGroup('Habitáculo');
    for (const x of [0.32, pickup ? -0.56 : -0.93]) {
      for (const z of [-0.44, 0.44]) {
        box(interior, [0.57, 0.18, 0.59], [x, 0.93, z], black, 'body', 0.065);
        const back = box(interior, [0.14, 0.61, 0.58], [x - 0.20, 1.27, z], black, 'body', 0.065);
        back.rotation.z = -0.12;
        box(interior, [0.12, 0.19, 0.27], [x - 0.24, 1.64, z], black, 'body', 0.04);
      }
    }
    box(interior, [0.34, 0.18, 1.69], [1.1, 1.29, 0], darkMetal, 'body', 0.05);
    const steering = mesh(interior, new THREE.TorusGeometry(0.20, 0.025, 10, 32), black, 'body', [0.78, 1.40, 0.48]);
    steering.rotation.y = Math.PI / 2 - 0.25;
    box(interior, [0.028, 0.22, 0.36], [0.89, 1.53, 0], glass, 'body', 0.018);

    const engine = newGroup('Motor y transmisión');
    engine.position.set(1.45, 0.89, 0);
    box(engine, [0.90, 0.41, 0.72], [0, 0.12, 0], aluminum, 'engine', 0.045);
    box(engine, [0.74, 0.14, 0.66], [0, 0.40, 0], black, 'engine', 0.04);
    box(engine, [0.48, 0.018, 0.22], [-0.04, 0.479, 0], aluminum, 'engine', 0.008);
    for (let i = 0; i < 4; i++) {
      cylinder(engine, 0.090, 0.44, [-0.29 + i * 0.19, 0.24, 0.35], aluminum, 'engine', 'z');
      box(engine, [0.045, 0.035, 0.37], [-0.26 + i * 0.17, 0.49, 0], darkMetal, 'engine', 0.005);
    }
    cylinder(engine, 0.145, 0.16, [0.51, 0.07, 0], darkMetal, 'engine', 'x');
    cylinder(engine, 0.12, 0.40, [-0.61, -0.04, 0], aluminum, 'engine', 'x');
    box(engine, [0.21, 0.25, 0.30], [0.07, 0.15, -0.49], orange, 'engine', 0.025);
    for (const z of [-0.21, 0.21]) rod(engine, new THREE.Vector3(-0.28, 0.31, z), new THREE.Vector3(-0.48, -0.01, z), 0.03, aluminum, 'engine');
    moving(engine, [1.20, 0.73, -0.18], 0.37, 1, [0, 0, 0.05]);

    const hybrid = model.silhouette === 'crossover';
    const battery = newGroup(hybrid ? 'Módulo de energía' : 'Batería de 12 V');
    if (hybrid) {
      // Compact schematic HEV module fits between the rails and below the floor.
      battery.position.set(-.50, .61, 0);
      box(battery, [.75, .13, .98], [0, 0, 0], aluminum, 'battery', .018);
      for (let x = 0; x < 4; x++) for (let z = 0; z < 3; z++) {
        box(battery, [.15, .018, .25], [-.27 + x * .18, .074, -.30 + z * .30], batteryCell, 'battery', .004);
      }
      box(battery, [.55, .014, .025], [0, .088, -.42], orange, 'battery', .004);
    } else {
      battery.position.set(2.02, 1.12, -.70);
      box(battery, [.40, .27, .27], [0, 0, 0], black, 'battery', .018);
      box(battery, [.41, .035, .28], [0, .145, 0], darkMetal, 'battery', .008);
      for (const sign of [-1, 1]) cylinder(battery, .025, .04, [sign * .13, .18, 0], sign > 0 ? red : aluminum, 'battery');
    }
    moving(battery, [0, .2, -1.68]);

    // Revolved tyre profile gives a flat tread and rounded sidewalls, unlike a torus.
    const roadWheel = model.silhouette === 'crossover';
    const rimScale = roadWheel ? 1.10 : 1;
    const tyreProfile = [[0.272, -0.126], [0.32, -0.142], [0.396, -0.143], [0.443, -0.123], [0.469, -0.090], [0.475, -0.065], [0.475, 0.065], [0.469, 0.090], [0.443, 0.123], [0.396, 0.143], [0.32, 0.142], [0.272, 0.126]].map(([r, z]) => new THREE.Vector2(r < .33 ? r * rimScale : r, z));
    const tyreGeometry = new THREE.LatheGeometry(tyreProfile, 80);
    tyreGeometry.rotateX(Math.PI / 2);
    const treadGeometry = new THREE.BoxGeometry(roadWheel ? .018 : .027, roadWheel ? .004 : .008, .058);
    for (const x of axlePositions) {
      for (const sign of [-1, 1]) {
        const wheel = newGroup(`Rueda ${x} ${sign}`);
        wheel.position.set(x, 0.49, sign * 0.99);
        if (sign === -1) wheel.rotation.y = Math.PI;
        mesh(wheel, tyreGeometry, rubber, 'brakes');
        const tread = new THREE.InstancedMesh(treadGeometry, materialFor(rubber, 'brakes'), 72 * 4);
        tread.castShadow = true;
        const transform = new THREE.Object3D();
        for (let row = 0; row < 4; row++) {
          for (let i = 0; i < 72; i++) {
            const angle = (i + row % 2 * 0.45) / 72 * Math.PI * 2;
            transform.position.set(Math.sin(angle) * 0.474, Math.cos(angle) * 0.474, (row - 1.5) * 0.052);
            transform.rotation.set(0, row % 2 ? 0.24 : -0.24, -angle);
            transform.updateMatrix();
            tread.setMatrixAt(row * 72 + i, transform.matrix);
          }
        }
        tread.userData.family = 'brakes';
        selectable.push(tread);
        wheel.add(tread);
        cylinder(wheel, .274 * rimScale, 0.10, [0, 0, 0.034], black, 'brakes', 'z', 64);
        mesh(wheel, new THREE.TorusGeometry(.268 * rimScale, 0.012, 8, 64), aluminum, 'brakes', [0, 0, 0.132]);
        for (const radius of [roadWheel ? .35 : .315, .414]) mesh(wheel, new THREE.TorusGeometry(radius, 0.003, 4, 64), rubber, 'brakes', [0, 0, 0.143]);
        const spokeCount = model.silhouette === 'crossover' ? 5 : 6;
        for (let i = 0; i < spokeCount; i++) {
          const angle = i * Math.PI * 2 / spokeCount;
          for (const split of [-0.095, 0.095]) {
            const a = angle + split;
            const spoke = box(wheel, [0.025, .21 * rimScale, 0.032], [Math.sin(a) * .163 * rimScale, Math.cos(a) * .163 * rimScale, 0.127], darkMetal, 'brakes', 0.006);
            spoke.rotation.z = -a;
            const face = box(wheel, [roadWheel ? .018 : .009, .19 * rimScale, 0.006], [Math.sin(a) * .169 * rimScale, Math.cos(a) * .169 * rimScale, 0.146], aluminum, 'brakes', 0.002);
            face.rotation.z = -a;
          }
          cylinder(wheel, 0.013, 0.015, [Math.sin(angle) * 0.065, Math.cos(angle) * 0.065, 0.153], aluminum, 'brakes', 'z', 10);
        }
        cylinder(wheel, 0.047, 0.025, [0, 0, 0.145], darkMetal, 'brakes', 'z', 28);
        moving(wheel, [x > 0 ? 0.18 : -0.18, 0.025, sign * 1.04], 0.24, 0.95);

        const brake = newGroup(`Disco de freno ${x} ${sign}`);
        brake.position.set(x, 0.49, sign * 0.90);
        cylinder(brake, 0.23, 0.035, [0, 0, 0], aluminum, 'brakes', 'z', 48);
        cylinder(brake, 0.09, 0.14, [0, 0, 0], darkMetal, 'brakes', 'z', 24);
        for (let i = 0; i < 16; i++) {
          const angle = i / 16 * Math.PI * 2;
          cylinder(brake, 0.010, 0.003, [Math.sin(angle) * 0.18, Math.cos(angle) * 0.18, sign * 0.019], black, 'brakes', 'z', 8);
        }
        box(brake, [0.11, 0.25, 0.10], [0.18, 0.03, 0], darkMetal, 'brakes', 0.025);
        moving(brake, [x > 0 ? 0.19 : -0.19, 0.03, sign * 0.53], 0.40, 1);

        const shock = newGroup(`Suspensión ${x} ${sign}`);
        shock.position.set(x, 0.62, sign * 0.76);
        cylinder(shock, 0.045, 0.70, [0, 0.07, 0], aluminum, 'suspension');
        cylinder(shock, 0.067, 0.29, [0, -0.14, 0], darkMetal, 'suspension');
        const helix: THREE.Vector3[] = [];
        for (let i = 0; i < 100; i++) {
          const t = i / 99;
          helix.push(new THREE.Vector3(Math.sin(t * Math.PI * 12) * 0.105, t * 0.44 - 0.08, Math.cos(t * Math.PI * 12) * 0.105));
        }
        mesh(shock, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), 100, 0.019, 6, false), red, 'suspension');
        cylinder(shock, 0.134, 0.037, [0, 0.37, 0], darkMetal, 'suspension');
        rod(shock, new THREE.Vector3(0, -0.10, 0), new THREE.Vector3(-0.32, -0.21, -sign * 0.20), 0.026, aluminum, 'suspension');
        rod(shock, new THREE.Vector3(0, -0.10, 0), new THREE.Vector3(0.32, -0.21, -sign * 0.20), 0.026, aluminum, 'suspension');
        moving(shock, [x > 0 ? 0.12 : -0.12, 0.45, sign * 0.31], 0.32, 0.95);
      }
    }

    const guideMaterial = new THREE.LineDashedMaterial({ color: 0x9aadb4, dashSize: 0.035, gapSize: 0.045, transparent: true, opacity: 0 });
    const guides: Array<{ line: THREE.Line; part: ExplodedPart; anchor: THREE.Vector3 }> = [];
    for (const part of exploded) {
      if (!['Techo y cristales', 'Capó', 'Motor y transmisión', 'Módulo de energía'].includes(part.group.name)) continue;
      const anchor = part.group.name === 'Techo y cristales' ? new THREE.Vector3(-0.5, 2.1, 0) : part.group.name === 'Capó' ? new THREE.Vector3(1.9, 1.5, 0) : part.start.clone();
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([anchor, anchor]), guideMaterial);
      car.add(line);
      guides.push({ line, part, anchor });
    }
    car.scale.set(...model.scale);
    platform.scale.set(model.scale[0], model.scale[2], 1);
    const fitScale = Math.max(...model.scale);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let inView = true;
    let disposed = false;
    let frameId = 0;
    let currentProgress = THREE.MathUtils.clamp(latest.current.progress || 0, 0, 1);
    let lastColor = '';
    let lastSelection: string | null | undefined = undefined;
    let lastTime = 0;
    let lastView: VehicleSceneProps['view'];
    let lastReset: number | undefined;
    let desiredDistance = 10;
    const tempOffset = new THREE.Vector3();
    let pointerDown = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function fitCamera() {
      const width = Math.max(host!.clientWidth, 1);
      const height = Math.max(host!.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const visibleHeight = Math.max(3.65 + currentProgress * 2.25, (6.75 + currentProgress * 3.1) / camera.aspect) * fitScale;
      desiredDistance = visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      tempOffset.copy(camera.position).sub(controls.target).normalize().multiplyScalar(desiredDistance);
      camera.position.copy(controls.target).add(tempOffset);
      requestFrame();
    }
    function requestFrame() {
      if (!frameId && !disposed && inView && !document.hidden) frameId = requestAnimationFrame(renderFrame);
    }
    invalidate.current = requestFrame;
    function renderFrame(time: number) {
      frameId = 0;
      if (disposed || !inView || document.hidden) return;
      const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
      lastTime = time;
      const p = latest.current;
      const target = THREE.MathUtils.clamp(p.progress || 0, 0, 1);
      currentProgress = reduced ? target : THREE.MathUtils.damp(currentProgress, target, 7.5, dt);
      if (Math.abs(target - currentProgress) < 0.0007) currentProgress = target;
      for (const part of exploded) {
        const offset = motionAmount(currentProgress, part.plan);
        part.group.position.copy(part.start).add(new THREE.Vector3(...offset));
      }
      guideMaterial.opacity = Math.max(0, currentProgress - 0.18) * 0.21;
      for (const { line, part, anchor } of guides) {
        const offset = part.group.position.clone().sub(part.start);
        const attribute = line.geometry.getAttribute('position') as THREE.BufferAttribute;
        attribute.setXYZ(0, anchor.x, anchor.y, anchor.z);
        attribute.setXYZ(1, anchor.x + offset.x, anchor.y + offset.y, anchor.z + offset.z);
        attribute.needsUpdate = true;
        line.computeLineDistances();
      }
      if (lastColor !== p.color) {
        painted.forEach(material => material.color.set(p.color));
        lastColor = p.color;
      }
      if (lastSelection !== p.selectedPart) {
        for (const entry of familyMaterials) {
          const selected = entry.family === p.selectedPart && entry.family !== 'body';
          entry.material.emissive.copy(selected ? new THREE.Color(0x6197ac) : entry.originalEmissive);
          entry.material.emissiveIntensity = selected ? 0.20 : entry.originalIntensity;
        }
        lastSelection = p.selectedPart;
      }
      const visibleHeight = Math.max(3.65 + currentProgress * 2.25, (6.75 + currentProgress * 3.1) / camera.aspect) * fitScale;
      desiredDistance = visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      controls.target.y = (1.04 + currentProgress * 0.85) * model.scale[1];
      if (lastView !== p.view || lastReset !== p.resetView) {
        const direction = p.view === 'front' ? new THREE.Vector3(1, .18, 0) : p.view === 'side' ? new THREE.Vector3(0, .16, 1) : p.view === 'rear' ? new THREE.Vector3(-1, .18, 0) : new THREE.Vector3(8, 2.65, 8.8);
        // Clear pending orbit damping so a reset is deterministic after dragging.
        controls.enableDamping = false;
        controls.update();
        camera.position.copy(controls.target).add(direction.normalize().multiplyScalar(desiredDistance));
        controls.update();
        controls.enableDamping = true;
        lastView = p.view;
        lastReset = p.resetView;
      }
      tempOffset.copy(camera.position).sub(controls.target);
      const length = THREE.MathUtils.damp(tempOffset.length(), desiredDistance, 5, dt);
      camera.position.copy(controls.target).add(tempOffset.normalize().multiplyScalar(length));
      controls.autoRotate = !!p.autoRotate && !reduced;
      const controlsChanged = controls.update(dt);
      renderer.render(scene, camera);
      if (Math.abs(target - currentProgress) > 0.0007 || Math.abs(length - desiredDistance) > 0.004 || controlsChanged || controls.autoRotate) requestFrame();
    }
    function onPointerDown(event: PointerEvent) {
      pointerDown.set(event.clientX, event.clientY);
      setIsDragging(true);
    }
    function onPointerUp(event: PointerEvent) {
      setIsDragging(false);
      if (pointerDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 7) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(selectable, false)[0];
      if (hit?.object.userData.family) latest.current.onSelectPart?.(hit.object.userData.family as string);
    }
    function onPointerCancel() { setIsDragging(false); }
    function onVisibility() {
      if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
      else requestFrame();
    }
    function onMotion() { reduced = motionQuery.matches; requestFrame(); }
    function onContextLost(event: Event) { event.preventDefault(); setFailed(true); }
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('webglcontextlost', onContextLost);
    controls.addEventListener('change', requestFrame);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotion);
    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? true;
      if (inView) requestFrame();
      else { cancelAnimationFrame(frameId); frameId = 0; }
    }, { rootMargin: '100px' });
    observer.observe(host);
    const resize = new ResizeObserver(fitCamera);
    resize.observe(host);
    fitCamera();
    requestFrame();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      invalidate.current = () => {};
      observer.disconnect();
      resize.disconnect();
      controls.removeEventListener('change', requestFrame);
      controls.dispose();
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          const values = Array.isArray(object.material) ? object.material : [object.material];
          values.forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      sourceMaterials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      environment.dispose();
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (host.contains(canvas)) host.removeChild(canvas);
    };
  }, [props.modelId]);

  return (
    <div className={props.className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 250 }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab', opacity: failed ? 0 : 1 }} />
      {failed && <div style={{ position: 'absolute', inset: 0 }}><VehicleFallback {...props} /></div>}
    </div>
  );
}
