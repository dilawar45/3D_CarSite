import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill for GLTFExporter
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};

const outputDir = path.resolve('public', 'assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ── Materials Helper ──
function createMaterials(carColorHex = 0x223344) {
  return {
    paint: new THREE.MeshPhysicalMaterial({
      color: carColorHex,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    }),
    darkTrim: new THREE.MeshStandardMaterial({
      color: 0x111113,
      metalness: 0.2,
      roughness: 0.7,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x1a2228,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      ior: 1.5,
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.85,
      metalness: 0.1,
    }),
    rimAlloy: new THREE.MeshStandardMaterial({
      color: 0xd0d5dd,
      metalness: 0.9,
      roughness: 0.2,
    }),
    brakeCaliper: new THREE.MeshStandardMaterial({
      color: 0xd11a2a,
      metalness: 0.7,
      roughness: 0.3,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xddf0ff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.2,
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: 0xff1122,
      emissive: 0xff0022,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    }),
    interior: new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
      metalness: 0.1,
    }),
  };
}

// ── Wheel Generator ──
function createWheel(mats, radius = 0.42, width = 0.28, isRugged = false) {
  const wheelGroup = new THREE.Group();

  // Tire
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 32, 1, false);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, mats.tireRubber);
  wheelGroup.add(tire);

  // Tread blocks for rugged look
  if (isRugged) {
    const blockCount = 18;
    for (let i = 0; i < blockCount; i++) {
      const angle = (i / blockCount) * Math.PI * 2;
      const blockGeo = new THREE.BoxGeometry(width * 0.95, 0.03, 0.06);
      const block = new THREE.Mesh(blockGeo, mats.tireRubber);
      block.position.set(0, Math.sin(angle) * (radius + 0.01), Math.cos(angle) * (radius + 0.01));
      block.rotation.x = -angle;
      wheelGroup.add(block);
    }
  }

  // Rim barrel
  const rimRadius = radius * 0.65;
  const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, width * 0.98, 24);
  rimGeo.rotateZ(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, mats.rimAlloy);
  wheelGroup.add(rim);

  // Spokes
  const spokeCount = isRugged ? 6 : 10;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(width * 0.4, rimRadius * 0.85, 0.03);
    const spoke = new THREE.Mesh(spokeGeo, mats.rimAlloy);
    spoke.position.set(width * 0.3, Math.sin(angle) * rimRadius * 0.45, Math.cos(angle) * rimRadius * 0.45);
    spoke.rotation.x = -angle;
    wheelGroup.add(spoke);
  }

  // Brake Caliper & Disc
  const discGeo = new THREE.CylinderGeometry(rimRadius * 0.75, rimRadius * 0.75, 0.03, 24);
  discGeo.rotateZ(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, mats.rimAlloy);
  disc.position.x = -width * 0.1;
  wheelGroup.add(disc);

  const caliperGeo = new THREE.BoxGeometry(0.06, 0.12, 0.18);
  const caliper = new THREE.Mesh(caliperGeo, mats.brakeCaliper);
  caliper.position.set(-width * 0.1, rimRadius * 0.4, 0);
  wheelGroup.add(caliper);

  return wheelGroup;
}

// ── Model 1: Toyota Land Cruiser Prado J250 (2024+) ──
function buildPradoModel() {
  const root = new THREE.Group();
  root.name = 'Prado_J250';
  // Prado 2024 signature heritage sand / dark titanium color
  const mats = createMaterials(0xC4B28A); // Heritage Sand Tan metallic

  // 1. BODY GROUP
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  // Lower chassis & skid plate
  const chassisGeo = new THREE.BoxGeometry(1.8, 0.25, 4.4);
  const chassis = new THREE.Mesh(chassisGeo, mats.darkTrim);
  chassis.position.set(0, 0.35, 0);
  bodyGroup.add(chassis);

  // Main cabin & roof
  const cabinGeo = new THREE.BoxGeometry(1.86, 0.95, 3.2);
  const cabin = new THREE.Mesh(cabinGeo, mats.paint);
  cabin.position.set(0, 1.25, -0.4);
  bodyGroup.add(cabin);

  // Roof rack rails (signature off-road Prado feature)
  const railGeo = new THREE.BoxGeometry(0.06, 0.08, 2.6);
  const railL = new THREE.Mesh(railGeo, mats.darkTrim);
  railL.position.set(-0.85, 1.77, -0.4);
  const railR = new THREE.Mesh(railGeo, mats.darkTrim);
  railR.position.set(0.85, 1.77, -0.4);
  bodyGroup.add(railL, railR);

  // Windshield & Rear glass
  const windshieldGeo = new THREE.BoxGeometry(1.76, 0.65, 0.08);
  windshieldGeo.rotateX(Math.PI / 6);
  const windshield = new THREE.Mesh(windshieldGeo, mats.glass);
  windshield.position.set(0, 1.25, 1.15);
  bodyGroup.add(windshield);

  const rearGlassGeo = new THREE.BoxGeometry(1.7, 0.55, 0.06);
  const rearGlass = new THREE.Mesh(rearGlassGeo, mats.glass);
  rearGlass.position.set(0, 1.35, -1.95);
  bodyGroup.add(rearGlass);

  // Front Fascia: J250 Boxy Grille with horizontal heritage bars
  const grilleGeo = new THREE.BoxGeometry(1.6, 0.45, 0.25);
  const grille = new THREE.Mesh(grilleGeo, mats.darkTrim);
  grille.position.set(0, 0.72, 2.3);
  bodyGroup.add(grille);

  // Headlights: rectangular LED clusters
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.1), mats.headlight);
  headL.position.set(-0.68, 0.82, 2.4);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.1), mats.headlight);
  headR.position.set(0.68, 0.82, 2.4);
  bodyGroup.add(headL, headR);

  // Front rugged bumper
  const fumperGeo = new THREE.BoxGeometry(1.92, 0.38, 0.35);
  const fumper = new THREE.Mesh(fumperGeo, mats.darkTrim);
  fumper.position.set(0, 0.42, 2.35);
  bodyGroup.add(fumper);

  // Rear bumper & vertical taillights
  const rBumperGeo = new THREE.BoxGeometry(1.92, 0.35, 0.3);
  const rBumper = new THREE.Mesh(rBumperGeo, mats.darkTrim);
  rBumper.position.set(0, 0.42, -2.15);
  bodyGroup.add(rBumper);

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.08), mats.taillight);
  tailL.position.set(-0.85, 1.05, -2.02);
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.08), mats.taillight);
  tailR.position.set(0.85, 1.05, -2.02);
  bodyGroup.add(tailL, tailR);

  // Angular Wheel Arch Flares
  const archGeo = new THREE.BoxGeometry(0.12, 0.25, 0.95);
  const archFL = new THREE.Mesh(archGeo, mats.darkTrim);
  archFL.position.set(-0.95, 0.65, 1.45);
  const archFR = new THREE.Mesh(archGeo, mats.darkTrim);
  archFR.position.set(0.95, 0.65, 1.45);
  const archRL = new THREE.Mesh(archGeo, mats.darkTrim);
  archRL.position.set(-0.95, 0.65, -1.4);
  const archRR = new THREE.Mesh(archGeo, mats.darkTrim);
  archRR.position.set(0.95, 0.65, -1.4);
  bodyGroup.add(archFL, archFR, archRL, archRR);

  root.add(bodyGroup);

  // 2. HOOD (Bonnet with signature dual power creases)
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';
  const hoodBaseGeo = new THREE.BoxGeometry(1.68, 0.12, 1.25);
  const hoodBase = new THREE.Mesh(hoodBaseGeo, mats.paint);
  hoodBase.position.set(0, 0.96, 1.65);
  hoodGroup.add(hoodBase);

  // Power bulges on hood
  const bulgeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.1), mats.paint);
  bulgeL.position.set(-0.45, 1.04, 1.65);
  const bulgeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.1), mats.paint);
  bulgeR.position.set(0.45, 1.04, 1.65);
  hoodGroup.add(bulgeL, bulgeR);
  root.add(hoodGroup);

  // 3. DOORS (Separate meshes with handles and windows)
  // Front Left Door
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const panelFL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.92), mats.paint);
  panelFL.position.set(-0.94, 0.85, 0.5);
  const winFL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.88), mats.glass);
  winFL.position.set(-0.94, 1.35, 0.5);
  const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.15), mats.darkTrim);
  mirrorL.position.set(-1.08, 1.15, 0.88);
  doorFL.add(panelFL, winFL, mirrorL);
  root.add(doorFL);

  // Front Right Door
  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const panelFR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.92), mats.paint);
  panelFR.position.set(0.94, 0.85, 0.5);
  const winFR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.88), mats.glass);
  winFR.position.set(0.94, 1.35, 0.5);
  const mirrorR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.15), mats.darkTrim);
  mirrorR.position.set(1.08, 1.15, 0.88);
  doorFR.add(panelFR, winFR, mirrorR);
  root.add(doorFR);

  // Rear Left Door
  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const panelRL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.9), mats.paint);
  panelRL.position.set(-0.94, 0.85, -0.45);
  const winRL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.86), mats.glass);
  winRL.position.set(-0.94, 1.35, -0.45);
  doorRL.add(panelRL, winRL);
  root.add(doorRL);

  // Rear Right Door
  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const panelRR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.9), mats.paint);
  panelRR.position.set(0.94, 0.85, -0.45);
  const winRR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.86), mats.glass);
  winRR.position.set(0.94, 1.35, -0.45);
  doorRR.add(panelRR, winRR);
  root.add(doorRR);

  // 4. WHEELS (Rugged A/T tires + multi-spoke rims)
  const wRadius = 0.44;
  const wWidth = 0.3;
  const wheelFL = createWheel(mats, wRadius, wWidth, true);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.98, 0.44, 1.45);
  wheelFL.rotation.y = Math.PI; // face outward
  root.add(wheelFL);

  const wheelFR = createWheel(mats, wRadius, wWidth, true);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.98, 0.44, 1.45);
  root.add(wheelFR);

  const wheelRL = createWheel(mats, wRadius, wWidth, true);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.98, 0.44, -1.4);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createWheel(mats, wRadius, wWidth, true);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.98, 0.44, -1.4);
  root.add(wheelRR);

  return root;
}

// ── Model 2: Modern Luxury Sedan ──
function buildSedanModel() {
  const root = new THREE.Group();
  root.name = 'Modern_Sedan';
  // Sleek Deep Navy Metallic
  const mats = createMaterials(0x0f2b48);

  // 1. BODY GROUP
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  // Low sleek chassis
  const chassisGeo = new THREE.BoxGeometry(1.78, 0.2, 4.7);
  const chassis = new THREE.Mesh(chassisGeo, mats.darkTrim);
  chassis.position.set(0, 0.25, 0);
  bodyGroup.add(chassis);

  // Main body lower waistline
  const bodyLower = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.42, 4.6), mats.paint);
  bodyLower.position.set(0, 0.5, 0);
  bodyGroup.add(bodyLower);

  // Swept greenhouse & roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 2.4), mats.paint);
  roof.position.set(0, 0.98, -0.2);
  bodyGroup.add(roof);

  // Sloping fastback windshield & rear window
  const windGeo = new THREE.BoxGeometry(1.48, 0.65, 0.05);
  windGeo.rotateX(Math.PI / 4);
  const wind = new THREE.Mesh(windGeo, mats.glass);
  wind.position.set(0, 0.85, 1.15);
  bodyGroup.add(wind);

  const rearWindGeo = new THREE.BoxGeometry(1.45, 0.75, 0.05);
  rearWindGeo.rotateX(-Math.PI / 4.5);
  const rearWind = new THREE.Mesh(rearWindGeo, mats.glass);
  rearWind.position.set(0, 0.85, -1.5);
  bodyGroup.add(rearWind);

  // Modern horizontal light bars
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.08), mats.headlight);
  headL.position.set(-0.65, 0.58, 2.32);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.08), mats.headlight);
  headR.position.set(0.65, 0.58, 2.32);
  bodyGroup.add(headL, headR);

  // Continuous LED taillight bar
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.06, 0.08), mats.taillight);
  tailBar.position.set(0, 0.65, -2.32);
  bodyGroup.add(tailBar);

  root.add(bodyGroup);

  // 2. HOOD (Long, low, sculpted)
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';
  const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.08, 1.45), mats.paint);
  hoodMesh.position.set(0, 0.68, 1.6);
  hoodMesh.rotation.x = 0.05;
  hoodGroup.add(hoodMesh);
  root.add(hoodGroup);

  // 3. DOORS
  // Front Left Door
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const panelFL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 1.05), mats.paint);
  panelFL.position.set(-0.92, 0.58, 0.45);
  const winFL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.98), mats.glass);
  winFL.position.set(-0.84, 0.94, 0.45);
  const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.12), mats.darkTrim);
  mirL.position.set(-1.02, 0.82, 0.92);
  doorFL.add(panelFL, winFL, mirL);
  root.add(doorFL);

  // Front Right Door
  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const panelFR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 1.05), mats.paint);
  panelFR.position.set(0.92, 0.58, 0.45);
  const winFR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.98), mats.glass);
  winFR.position.set(0.84, 0.94, 0.45);
  const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.12), mats.darkTrim);
  mirR.position.set(1.02, 0.82, 0.92);
  doorFR.add(panelFR, winFR, mirR);
  root.add(doorFR);

  // Rear Left Door
  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const panelRL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 1.0), mats.paint);
  panelRL.position.set(-0.92, 0.58, -0.6);
  const winRL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.94), mats.glass);
  winRL.position.set(-0.84, 0.94, -0.6);
  doorRL.add(panelRL, winRL);
  root.add(doorRL);

  // Rear Right Door
  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const panelRR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 1.0), mats.paint);
  panelRR.position.set(0.92, 0.58, -0.6);
  const winRR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.94), mats.glass);
  winRR.position.set(0.84, 0.94, -0.6);
  doorRR.add(panelRR, winRR);
  root.add(doorRR);

  // 4. WHEELS (Sport low profile)
  const wRadius = 0.35;
  const wWidth = 0.24;
  const wheelFL = createWheel(mats, wRadius, wWidth, false);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.94, 0.35, 1.5);
  wheelFL.rotation.y = Math.PI;
  root.add(wheelFL);

  const wheelFR = createWheel(mats, wRadius, wWidth, false);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.94, 0.35, 1.5);
  root.add(wheelFR);

  const wheelRL = createWheel(mats, wRadius, wWidth, false);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.94, 0.35, -1.45);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createWheel(mats, wRadius, wWidth, false);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.94, 0.35, -1.45);
  root.add(wheelRR);

  return root;
}

// ── Model 3: Modern Hot Hatchback ──
function buildHatchbackModel() {
  const root = new THREE.Group();
  root.name = 'Modern_Hatchback';
  // Electric Lava Red / Crimson
  const mats = createMaterials(0xba131a);

  // 1. BODY GROUP
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.2, 4.0), mats.darkTrim);
  chassis.position.set(0, 0.26, 0);
  bodyGroup.add(chassis);

  const bodyLower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 3.9), mats.paint);
  bodyLower.position.set(0, 0.55, 0);
  bodyGroup.add(bodyLower);

  // Cabin with upright hatchback roofline
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.52, 2.2), mats.paint);
  roof.position.set(0, 1.05, -0.3);
  bodyGroup.add(roof);

  // Roof spoiler
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 0.35), mats.darkTrim);
  spoiler.position.set(0, 1.34, -1.45);
  bodyGroup.add(spoiler);

  // Windshield & Steep Rear Hatch
  const windGeo = new THREE.BoxGeometry(1.48, 0.6, 0.05);
  windGeo.rotateX(Math.PI / 3.8);
  const wind = new THREE.Mesh(windGeo, mats.glass);
  wind.position.set(0, 0.9, 0.95);
  bodyGroup.add(wind);

  const rearHatchGeo = new THREE.BoxGeometry(1.46, 0.6, 0.05);
  rearHatchGeo.rotateX(-Math.PI / 4.5);
  const rearHatch = new THREE.Mesh(rearHatchGeo, mats.glass);
  rearHatch.position.set(0, 0.95, -1.45);
  bodyGroup.add(rearHatch);

  // Aggressive front fascia & intake
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.08), mats.headlight);
  headL.position.set(-0.64, 0.65, 1.95);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.08), mats.headlight);
  headR.position.set(0.64, 0.65, 1.95);
  bodyGroup.add(headL, headR);

  // Compact taillights
  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), mats.taillight);
  tailL.position.set(-0.68, 0.72, -1.95);
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), mats.taillight);
  tailR.position.set(0.68, 0.72, -1.95);
  bodyGroup.add(tailL, tailR);

  root.add(bodyGroup);

  // 2. HOOD (Compact, sloping)
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';
  const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.08, 1.1), mats.paint);
  hoodMesh.position.set(0, 0.72, 1.4);
  hoodMesh.rotation.x = 0.08;
  hoodGroup.add(hoodMesh);
  root.add(hoodGroup);

  // 3. DOORS
  // Front Left Door
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const panelFL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.95), mats.paint);
  panelFL.position.set(-0.91, 0.62, 0.35);
  const winFL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.9), mats.glass);
  winFL.position.set(-0.82, 1.04, 0.35);
  const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.12), mats.darkTrim);
  mirL.position.set(-1.0, 0.9, 0.75);
  doorFL.add(panelFL, winFL, mirL);
  root.add(doorFL);

  // Front Right Door
  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const panelFR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.95), mats.paint);
  panelFR.position.set(0.91, 0.62, 0.35);
  const winFR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.9), mats.glass);
  winFR.position.set(0.82, 1.04, 0.35);
  const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.12), mats.darkTrim);
  mirR.position.set(1.0, 0.9, 0.75);
  doorFR.add(panelFR, winFR, mirR);
  root.add(doorFR);

  // Rear Left Door
  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const panelRL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.85), mats.paint);
  panelRL.position.set(-0.91, 0.62, -0.58);
  const winRL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.8), mats.glass);
  winRL.position.set(-0.82, 1.04, -0.58);
  doorRL.add(panelRL, winRL);
  root.add(doorRL);

  // Rear Right Door
  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const panelRR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.85), mats.paint);
  panelRR.position.set(0.91, 0.62, -0.58);
  const winRR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.8), mats.glass);
  winRR.position.set(0.82, 1.04, -0.58);
  doorRR.add(panelRR, winRR);
  root.add(doorRR);

  // 4. WHEELS
  const wRadius = 0.34;
  const wWidth = 0.24;
  const wheelFL = createWheel(mats, wRadius, wWidth, false);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.92, 0.34, 1.25);
  wheelFL.rotation.y = Math.PI;
  root.add(wheelFL);

  const wheelFR = createWheel(mats, wRadius, wWidth, false);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.92, 0.34, 1.25);
  root.add(wheelFR);

  const wheelRL = createWheel(mats, wRadius, wWidth, false);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.92, 0.34, -1.25);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createWheel(mats, wRadius, wWidth, false);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.92, 0.34, -1.25);
  root.add(wheelRR);

  return root;
}

// ── Export Runner ──
async function exportGLB(sceneObj, filename) {
  const exporter = new GLTFExporter();
  const filePath = path.join(outputDir, filename);

  return new Promise((resolve, reject) => {
    exporter.parse(
      sceneObj,
      (gltf) => {
        fs.writeFileSync(filePath, Buffer.from(gltf));
        const stats = fs.statSync(filePath);
        console.log(`Generated ${filename} (${stats.size} bytes)`);
        resolve();
      },
      (error) => {
        console.error(`Error exporting ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

async function main() {
  console.log('Generating 3D vehicle models with exploded-view parts hierarchy...');

  const prado = buildPradoModel();
  await exportGLB(prado, 'prado.glb');

  const sedan = buildSedanModel();
  await exportGLB(sedan, 'sedan.glb');

  const hatchback = buildHatchbackModel();
  await exportGLB(hatchback, 'hatchback.glb');

  console.log('All 3D models exported successfully to public/assets/!');
}

main().catch(console.error);
