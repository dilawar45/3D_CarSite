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

// ── High-Fidelity Automotive Materials ──
function createAutomotiveMaterials(primaryColorHex, isTwoTone = true) {
  return {
    paintPrimary: new THREE.MeshPhysicalMaterial({
      color: primaryColorHex,
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      envMapIntensity: 1.6,
    }),
    paintBlackRoof: new THREE.MeshPhysicalMaterial({
      color: 0x141618,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    }),
    matteBlackCladding: new THREE.MeshStandardMaterial({
      color: 0x1c1e22,
      roughness: 0.82,
      metalness: 0.15,
    }),
    silverSkidPlate: new THREE.MeshStandardMaterial({
      color: 0xa8b0b8,
      metalness: 0.85,
      roughness: 0.3,
    }),
    darkTintGlass: new THREE.MeshPhysicalMaterial({
      color: 0x0c1015,
      metalness: 0.1,
      roughness: 0.04,
      transmission: 0.85,
      opacity: 0.92,
      transparent: true,
      ior: 1.52,
      envMapIntensity: 1.8,
    }),
    windshieldGlass: new THREE.MeshPhysicalMaterial({
      color: 0x151b22,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      ior: 1.5,
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.88,
      metalness: 0.08,
    }),
    rimGunmetal: new THREE.MeshPhysicalMaterial({
      color: 0x2a2d33,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.5,
    }),
    rimMachinedAlloy: new THREE.MeshPhysicalMaterial({
      color: 0xd8dde4,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 0.7,
      envMapIntensity: 1.8,
    }),
    brakeRotor: new THREE.MeshStandardMaterial({
      color: 0x8a9098,
      metalness: 0.9,
      roughness: 0.25,
    }),
    brakeCaliperRed: new THREE.MeshPhysicalMaterial({
      color: 0xb51b24,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.8,
    }),
    headlightLED: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe8f4ff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    }),
    amberMarkerLED: new THREE.MeshStandardMaterial({
      color: 0xff9900,
      emissive: 0xff8800,
      emissiveIntensity: 3.0,
      roughness: 0.1,
    }),
    taillightLED: new THREE.MeshStandardMaterial({
      color: 0xff1525,
      emissive: 0xee0011,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    }),
    grilleMesh: new THREE.MeshStandardMaterial({
      color: 0x111316,
      roughness: 0.9,
      metalness: 0.3,
    }),
    chromeBadge: new THREE.MeshPhysicalMaterial({
      color: 0xf5f7fa,
      metalness: 0.98,
      roughness: 0.08,
      reflectivity: 1.0,
      envMapIntensity: 2.0,
    }),
  };
}

// ── Realistic Multi-Spoke Wheel Generator ──
function createRealisticWheel(mats, radius = 0.44, width = 0.32, isRuggedAT = true) {
  const wheel = new THREE.Group();

  // Tire Main Donut using smooth Torus geometry for realistic curved rounded shoulder
  const tireRadius = radius * 0.75;
  const tireTube = radius * 0.25;
  const tireGeo = new THREE.TorusGeometry(tireRadius, tireTube, 20, 36);
  tireGeo.rotateY(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, mats.tireRubber);
  wheel.add(tire);

  // Tire Center Tread Fill
  const treadFillGeo = new THREE.CylinderGeometry(radius, radius, width * 0.85, 36, 1, false);
  treadFillGeo.rotateZ(Math.PI / 2);
  const treadFill = new THREE.Mesh(treadFillGeo, mats.tireRubber);
  wheel.add(treadFill);

  // Deep All-Terrain Tread Blocks
  if (isRuggedAT) {
    const blocksCount = 24;
    for (let i = 0; i < blocksCount; i++) {
      const angle = (i / blocksCount) * Math.PI * 2;
      const tBlockGeo = new THREE.BoxGeometry(width * 0.88, 0.025, 0.045);
      const tBlock = new THREE.Mesh(tBlockGeo, mats.tireRubber);
      tBlock.position.set(0, Math.sin(angle) * (radius + 0.008), Math.cos(angle) * (radius + 0.008));
      tBlock.rotation.x = -angle;
      wheel.add(tBlock);
    }
  }

  // Rim Outer Lip / Barrel
  const rimOuterR = radius * 0.62;
  const rimLipGeo = new THREE.CylinderGeometry(rimOuterR, rimOuterR * 0.94, width * 0.95, 32);
  rimLipGeo.rotateZ(Math.PI / 2);
  const rimLip = new THREE.Mesh(rimLipGeo, mats.rimGunmetal);
  wheel.add(rimLip);

  // Inner Deep Rim Wall
  const innerWallGeo = new THREE.CylinderGeometry(rimOuterR * 0.94, rimOuterR * 0.82, 0.08, 32);
  innerWallGeo.rotateZ(Math.PI / 2);
  const innerWall = new THREE.Mesh(innerWallGeo, mats.rimMachinedAlloy);
  innerWall.position.x = width * 0.28;
  wheel.add(innerWall);

  // 6-Twin-Spoke Precision Alloy Design
  const spokePairs = 6;
  for (let i = 0; i < spokePairs; i++) {
    const baseAngle = (i / spokePairs) * Math.PI * 2;
    for (const offset of [-0.07, 0.07]) {
      const angle = baseAngle + offset;
      const spokeGeo = new THREE.BoxGeometry(width * 0.25, rimOuterR * 0.78, 0.035);
      const spoke = new THREE.Mesh(spokeGeo, mats.rimMachinedAlloy);
      spoke.position.set(
        width * 0.36,
        Math.sin(angle) * (rimOuterR * 0.44),
        Math.cos(angle) * (rimOuterR * 0.44)
      );
      spoke.rotation.x = -angle;
      wheel.add(spoke);
    }
  }

  // Center Hub & Toyota Logo Disc
  const centerHubGeo = new THREE.CylinderGeometry(rimOuterR * 0.28, rimOuterR * 0.28, width * 0.32, 24);
  centerHubGeo.rotateZ(Math.PI / 2);
  const centerHub = new THREE.Mesh(centerHubGeo, mats.rimGunmetal);
  centerHub.position.x = width * 0.35;
  wheel.add(centerHub);

  const centerCapGeo = new THREE.CylinderGeometry(rimOuterR * 0.18, rimOuterR * 0.18, 0.02, 24);
  centerCapGeo.rotateZ(Math.PI / 2);
  const centerCap = new THREE.Mesh(centerCapGeo, mats.chromeBadge);
  centerCap.position.x = width * 0.46;
  wheel.add(centerCap);

  // Brake Rotor Disc & Caliper
  const rotorGeo = new THREE.CylinderGeometry(rimOuterR * 0.78, rimOuterR * 0.78, 0.025, 32);
  rotorGeo.rotateZ(Math.PI / 2);
  const rotor = new THREE.Mesh(rotorGeo, mats.brakeRotor);
  rotor.position.x = -width * 0.08;
  wheel.add(rotor);

  const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.2);
  const caliper = new THREE.Mesh(caliperGeo, mats.brakeCaliperRed);
  caliper.position.set(-width * 0.08, rimOuterR * 0.45, 0);
  wheel.add(caliper);

  return wheel;
}

// ── Model 1: Authentic Toyota Land Cruiser Prado J250 (2024+) ──
function buildAuthenticPradoJ250() {
  const root = new THREE.Group();
  root.name = 'Prado_J250';

  // Authentic 2024 Trail Dust / Heritage Sand Tan
  const mats = createAutomotiveMaterials(0xBA9D72, true);

  // ══════════════════════════════════════════════════════════════
  // 1. MAIN BODY ASSEMBLY
  // ══════════════════════════════════════════════════════════════
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  // Heavy-duty Boxed Ladder Frame Chassis (visible from underneath)
  const chassisFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.22, 4.3),
    mats.matteBlackCladding
  );
  chassisFrame.position.set(0, 0.35, 0);
  bodyGroup.add(chassisFrame);

  // Main Cabin Lower Body Tub
  const lowerBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.55, 4.4),
    mats.paintPrimary
  );
  lowerBody.position.set(0, 0.68, 0.05);
  bodyGroup.add(lowerBody);

  // Upper Greenhouse Cabin (Contrasting Black Roof Pillars & Surround)
  const cabinShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.78, 0.78, 3.1),
    mats.paintBlackRoof
  );
  cabinShell.position.set(0, 1.28, -0.45);
  bodyGroup.add(cabinShell);

  // Roof Panel (Heritage Contrast Black)
  const roofPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.1, 3.15),
    mats.paintBlackRoof
  );
  roofPanel.position.set(0, 1.7, -0.45);
  bodyGroup.add(roofPanel);

  // Roof Rails with Stanchions & Crossbars
  const railGeo = new THREE.BoxGeometry(0.06, 0.08, 2.7);
  const railL = new THREE.Mesh(railGeo, mats.matteBlackCladding);
  railL.position.set(-0.82, 1.78, -0.45);
  const railR = new THREE.Mesh(railGeo, mats.matteBlackCladding);
  railR.position.set(0.82, 1.78, -0.45);
  bodyGroup.add(railL, railR);

  // Upright Windshield with Black A-Pillars
  const windshieldGeo = new THREE.BoxGeometry(1.68, 0.72, 0.04);
  windshieldGeo.rotateX(Math.PI / 5.2);
  const windshield = new THREE.Mesh(windshieldGeo, mats.windshieldGlass);
  windshield.position.set(0, 1.32, 1.12);
  bodyGroup.add(windshield);

  // Upright Rear Tailgate Glass
  const rearGlassGeo = new THREE.BoxGeometry(1.64, 0.62, 0.04);
  rearGlassGeo.rotateX(-0.06);
  const rearGlass = new THREE.Mesh(rearGlassGeo, mats.darkTintGlass);
  rearGlass.position.set(0, 1.35, -2.02);
  bodyGroup.add(rearGlass);

  // Rear Quarter Windows (Drop Beltline Accent)
  const qtrGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.85), mats.darkTintGlass);
  qtrGlassL.position.set(-0.89, 1.35, -1.45);
  const qtrGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.85), mats.darkTintGlass);
  qtrGlassR.position.set(0.89, 1.35, -1.45);
  bodyGroup.add(qtrGlassL, qtrGlassR);

  // ── Authentic J250 Front Fascia ──
  // Heritage Rectangular Black Grille Frame
  const grilleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.62, 0.44, 0.22),
    mats.matteBlackCladding
  );
  grilleFrame.position.set(0, 0.78, 2.24);
  bodyGroup.add(grilleFrame);

  // Inner Honeycomb / Slotted Grille Mesh
  const grilleInner = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.32, 0.06),
    mats.grilleMesh
  );
  grilleInner.position.set(0, 0.78, 2.34);
  bodyGroup.add(grilleInner);

  // Iconic "TOYOTA" Block Lettering Bar
  const toyotaBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.12, 0.08),
    mats.chromeBadge
  );
  toyotaBar.position.set(0, 0.8, 2.38);
  bodyGroup.add(toyotaBar);

  // Triple-Beam Rectangular LED Headlight Units
  // Left Headlight
  const headFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.12), mats.matteBlackCladding);
  headFrameL.position.set(-0.66, 0.82, 2.3);
  const headLedL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.04), mats.headlightLED);
  headLedL.position.set(-0.62, 0.82, 2.36);
  // Signature Amber Side Marker on outer edge!
  const amberL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.04), mats.amberMarkerLED);
  amberL.position.set(-0.8, 0.82, 2.35);
  bodyGroup.add(headFrameL, headLedL, amberL);

  // Right Headlight
  const headFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.12), mats.matteBlackCladding);
  headFrameR.position.set(0.66, 0.82, 2.3);
  const headLedR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.04), mats.headlightLED);
  headLedR.position.set(0.62, 0.82, 2.36);
  const amberR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.04), mats.amberMarkerLED);
  amberR.position.set(0.8, 0.82, 2.35);
  bodyGroup.add(headFrameR, headLedR, amberR);

  // Front Rugged Modular 3-Piece Bumper
  const fBumperCenter = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.38, 0.35),
    mats.matteBlackCladding
  );
  fBumperCenter.position.set(0, 0.42, 2.38);
  bodyGroup.add(fBumperCenter);

  // Silver Rugged Under-Skid Plate
  const skidPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.18, 0.25),
    mats.silverSkidPlate
  );
  skidPlate.position.set(0, 0.26, 2.36);
  skidPlate.rotation.x = 0.3;
  bodyGroup.add(skidPlate);

  // Circular Integrated Fog Lights
  const fogL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), mats.headlightLED);
  fogL.rotateX(Math.PI / 2);
  fogL.position.set(-0.52, 0.46, 2.56);
  const fogR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), mats.headlightLED);
  fogR.rotateX(Math.PI / 2);
  fogR.position.set(0.52, 0.46, 2.56);
  bodyGroup.add(fogL, fogR);

  // ── Flared Trapezoidal Wheel Arches (J250 Signature) ──
  const archFL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 1.05), mats.matteBlackCladding);
  archFL.position.set(-0.96, 0.64, 1.45);
  const archFR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 1.05), mats.matteBlackCladding);
  archFR.position.set(0.96, 0.64, 1.45);
  const archRL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 1.05), mats.matteBlackCladding);
  archRL.position.set(-0.96, 0.64, -1.35);
  const archRR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 1.05), mats.matteBlackCladding);
  archRR.position.set(0.96, 0.64, -1.35);
  bodyGroup.add(archFL, archFR, archRL, archRR);

  // Heavy-duty Side Running Steps / Rock Sliders
  const stepL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 1.95), mats.matteBlackCladding);
  stepL.position.set(-0.98, 0.32, 0.05);
  const stepR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 1.95), mats.matteBlackCladding);
  stepR.position.set(0.98, 0.32, 0.05);
  bodyGroup.add(stepL, stepR);

  // Rear Upright Tailgate & Vertical LED Lamps
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.35, 0.32), mats.matteBlackCladding);
  rearBumper.position.set(0, 0.45, -2.18);
  bodyGroup.add(rearBumper);

  const tailLampL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.06), mats.taillightLED);
  tailLampL.position.set(-0.86, 1.05, -2.16);
  const tailLampR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.06), mats.taillightLED);
  tailLampR.position.set(0.86, 1.05, -2.16);
  bodyGroup.add(tailLampL, tailLampR);

  root.add(bodyGroup);

  // ══════════════════════════════════════════════════════════════
  // 2. SCULPTED J250 BONNET / HOOD
  // ══════════════════════════════════════════════════════════════
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';

  // Base Hood Sheetmetal
  const hoodBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 0.12, 1.35),
    mats.paintPrimary
  );
  hoodBase.position.set(0, 0.98, 1.58);
  hoodBase.rotation.x = 0.04;
  hoodGroup.add(hoodBase);

  // Signature J250 Dual Longitudinal Power Bulges
  const bulgeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 1.25), mats.paintPrimary);
  bulgeL.position.set(-0.46, 1.06, 1.58);
  bulgeL.rotation.x = 0.04;
  const bulgeR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 1.25), mats.paintPrimary);
  bulgeR.position.set(0.46, 1.06, 1.58);
  bulgeR.rotation.x = 0.04;

  // Center Recessed Channel
  const centerDepression = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 1.15), mats.paintPrimary);
  centerDepression.position.set(0, 1.01, 1.56);
  centerDepression.rotation.x = 0.04;
  hoodGroup.add(bulgeL, bulgeR, centerDepression);

  root.add(hoodGroup);

  // ══════════════════════════════════════════════════════════════
  // 3. SEPARATED DOORS (With handles, acoustic glass & mirrors)
  // ══════════════════════════════════════════════════════════════
  // Front Left Door
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const flPanel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.96), mats.paintPrimary);
  flPanel.position.set(-0.94, 0.86, 0.52);
  const flGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.92), mats.darkTintGlass);
  flGlass.position.set(-0.94, 1.38, 0.52);
  const flHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), mats.matteBlackCladding);
  flHandle.position.set(-0.99, 0.98, 0.22);
  // Rectangular Rugged Mirror
  const flMirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.18), mats.matteBlackCladding);
  flMirror.position.set(-1.08, 1.22, 0.92);
  const flMirrorIndicator = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.12), mats.amberMarkerLED);
  flMirrorIndicator.position.set(-1.18, 1.22, 0.92);
  doorFL.add(flPanel, flGlass, flHandle, flMirror, flMirrorIndicator);
  root.add(doorFL);

  // Front Right Door
  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const frPanel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.96), mats.paintPrimary);
  frPanel.position.set(0.94, 0.86, 0.52);
  const frGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.92), mats.darkTintGlass);
  frGlass.position.set(0.94, 1.38, 0.52);
  const frHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), mats.matteBlackCladding);
  frHandle.position.set(0.99, 0.98, 0.22);
  const frMirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.18), mats.matteBlackCladding);
  frMirror.position.set(1.08, 1.22, 0.92);
  const frMirrorIndicator = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.12), mats.amberMarkerLED);
  frMirrorIndicator.position.set(1.18, 1.22, 0.92);
  doorFR.add(frPanel, frGlass, frHandle, frMirror, frMirrorIndicator);
  root.add(doorFR);

  // Rear Left Door
  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const rlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.92), mats.paintPrimary);
  rlPanel.position.set(-0.94, 0.86, -0.44);
  const rlGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.88), mats.darkTintGlass);
  rlGlass.position.set(-0.94, 1.38, -0.44);
  const rlHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), mats.matteBlackCladding);
  rlHandle.position.set(-0.99, 0.98, -0.74);
  doorRL.add(rlPanel, rlGlass, rlHandle);
  root.add(doorRL);

  // Rear Right Door
  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const rrPanel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.92), mats.paintPrimary);
  rrPanel.position.set(0.94, 0.86, -0.44);
  const rrGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.88), mats.darkTintGlass);
  rrGlass.position.set(0.94, 1.38, -0.44);
  const rrHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), mats.matteBlackCladding);
  rrHandle.position.set(0.99, 0.98, -0.74);
  doorRR.add(rrPanel, rrGlass, rrHandle);
  root.add(doorRR);

  // ══════════════════════════════════════════════════════════════
  // 4. AUTHENTIC ALL-TERRAIN WHEELS
  // ══════════════════════════════════════════════════════════════
  const wRadius = 0.44;
  const wWidth = 0.32;

  const wheelFL = createRealisticWheel(mats, wRadius, wWidth, true);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.98, 0.44, 1.45);
  wheelFL.rotation.y = Math.PI;
  root.add(wheelFL);

  const wheelFR = createRealisticWheel(mats, wRadius, wWidth, true);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.98, 0.44, 1.45);
  root.add(wheelFR);

  const wheelRL = createRealisticWheel(mats, wRadius, wWidth, true);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.98, 0.44, -1.35);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createRealisticWheel(mats, wRadius, wWidth, true);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.98, 0.44, -1.35);
  root.add(wheelRR);

  return root;
}

// ── Model 2: Sculpted Modern Luxury Sedan ──
function buildSculptedSedan() {
  const root = new THREE.Group();
  root.name = 'Modern_Sedan';

  // Deep Navy Metallic
  const mats = createAutomotiveMaterials(0x10253f, false);

  // 1. Body
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.18, 4.6), mats.matteBlackCladding);
  chassis.position.set(0, 0.26, 0);
  bodyGroup.add(chassis);

  const bodyLower = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.45, 4.6), mats.paintPrimary);
  bodyLower.position.set(0, 0.52, 0);
  bodyGroup.add(bodyLower);

  const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.48, 2.5), mats.paintBlackRoof);
  greenhouse.position.set(0, 0.98, -0.2);
  bodyGroup.add(greenhouse);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.72, 0.04), mats.windshieldGlass);
  windshield.rotateX(Math.PI / 3.8);
  windshield.position.set(0, 0.88, 1.15);
  bodyGroup.add(windshield);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.85, 0.04), mats.darkTintGlass);
  rearGlass.rotateX(-Math.PI / 4.2);
  rearGlass.position.set(0, 0.88, -1.55);
  bodyGroup.add(rearGlass);

  // Slim Horizontal LED Matrix Headlights
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.08), mats.headlightLED);
  headL.position.set(-0.64, 0.62, 2.32);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.08), mats.headlightLED);
  headR.position.set(0.64, 0.62, 2.32);
  bodyGroup.add(headL, headR);

  // Full-Width LED Tail Light Bar
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.06), mats.taillightLED);
  tailBar.position.set(0, 0.68, -2.32);
  bodyGroup.add(tailBar);

  root.add(bodyGroup);

  // 2. Sculpted Hood
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';
  const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.08, 1.48), mats.paintPrimary);
  hoodMesh.position.set(0, 0.7, 1.6);
  hoodMesh.rotation.x = 0.06;
  hoodGroup.add(hoodMesh);
  root.add(hoodGroup);

  // 3. Doors
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const panelFL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 1.08), mats.paintPrimary);
  panelFL.position.set(-0.93, 0.6, 0.46);
  const winFL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 1.02), mats.darkTintGlass);
  winFL.position.set(-0.84, 0.98, 0.46);
  doorFL.add(panelFL, winFL);
  root.add(doorFL);

  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const panelFR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 1.08), mats.paintPrimary);
  panelFR.position.set(0.93, 0.6, 0.46);
  const winFR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 1.02), mats.darkTintGlass);
  winFR.position.set(0.84, 0.98, 0.46);
  doorFR.add(panelFR, winFR);
  root.add(doorFR);

  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const panelRL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 1.02), mats.paintPrimary);
  panelRL.position.set(-0.93, 0.6, -0.62);
  const winRL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.96), mats.darkTintGlass);
  winRL.position.set(-0.84, 0.98, -0.62);
  doorRL.add(panelRL, winRL);
  root.add(doorRL);

  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const panelRR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 1.02), mats.paintPrimary);
  panelRR.position.set(0.93, 0.6, -0.62);
  const winRR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.96), mats.darkTintGlass);
  winRR.position.set(0.84, 0.98, -0.62);
  doorRR.add(panelRR, winRR);
  root.add(doorRR);

  // 4. Wheels (Low profile performance alloys)
  const wRadius = 0.36;
  const wWidth = 0.26;
  const wheelFL = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.94, 0.36, 1.5);
  wheelFL.rotation.y = Math.PI;
  root.add(wheelFL);

  const wheelFR = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.94, 0.36, 1.5);
  root.add(wheelFR);

  const wheelRL = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.94, 0.36, -1.45);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.94, 0.36, -1.45);
  root.add(wheelRR);

  return root;
}

// ── Model 3: Sculpted Modern Hot Hatchback ──
function buildSculptedHatchback() {
  const root = new THREE.Group();
  root.name = 'Modern_Hatchback';

  // Crimson Metallic
  const mats = createAutomotiveMaterials(0xb3141e, true);

  // 1. Body
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.18, 4.0), mats.matteBlackCladding);
  chassis.position.set(0, 0.26, 0);
  bodyGroup.add(chassis);

  const bodyLower = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.52, 3.95), mats.paintPrimary);
  bodyLower.position.set(0, 0.56, 0);
  bodyGroup.add(bodyLower);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.52, 2.3), mats.paintBlackRoof);
  roof.position.set(0, 1.08, -0.32);
  bodyGroup.add(roof);

  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.06, 0.38), mats.matteBlackCladding);
  spoiler.position.set(0, 1.36, -1.5);
  bodyGroup.add(spoiler);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.68, 0.04), mats.windshieldGlass);
  windshield.rotateX(Math.PI / 3.6);
  windshield.position.set(0, 0.94, 0.95);
  bodyGroup.add(windshield);

  const rearHatch = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.68, 0.04), mats.darkTintGlass);
  rearHatch.rotateX(-Math.PI / 4.4);
  rearHatch.position.set(0, 0.98, -1.5);
  bodyGroup.add(rearHatch);

  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.08), mats.headlightLED);
  headL.position.set(-0.64, 0.66, 1.98);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.08), mats.headlightLED);
  headR.position.set(0.64, 0.66, 1.98);
  bodyGroup.add(headL, headR);

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), mats.taillightLED);
  tailL.position.set(-0.68, 0.74, -1.98);
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), mats.taillightLED);
  tailR.position.set(0.68, 0.74, -1.98);
  bodyGroup.add(tailL, tailR);

  root.add(bodyGroup);

  // 2. Sculpted Hood
  const hoodGroup = new THREE.Group();
  hoodGroup.name = 'Hood';
  const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.15), mats.paintPrimary);
  hoodMesh.position.set(0, 0.74, 1.42);
  hoodMesh.rotation.x = 0.08;
  hoodGroup.add(hoodMesh);
  root.add(hoodGroup);

  // 3. Doors
  const doorFL = new THREE.Group();
  doorFL.name = 'Door_F_L';
  const panelFL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 0.98), mats.paintPrimary);
  panelFL.position.set(-0.92, 0.64, 0.35);
  const winFL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.92), mats.darkTintGlass);
  winFL.position.set(-0.82, 1.06, 0.35);
  doorFL.add(panelFL, winFL);
  root.add(doorFL);

  const doorFR = new THREE.Group();
  doorFR.name = 'Door_F_R';
  const panelFR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 0.98), mats.paintPrimary);
  panelFR.position.set(0.92, 0.64, 0.35);
  const winFR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.92), mats.darkTintGlass);
  winFR.position.set(0.82, 1.06, 0.35);
  doorFR.add(panelFR, winFR);
  root.add(doorFR);

  const doorRL = new THREE.Group();
  doorRL.name = 'Door_R_L';
  const panelRL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 0.88), mats.paintPrimary);
  panelRL.position.set(-0.92, 0.64, -0.6);
  const winRL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.82), mats.darkTintGlass);
  winRL.position.set(-0.82, 1.06, -0.6);
  doorRL.add(panelRL, winRL);
  root.add(doorRL);

  const doorRR = new THREE.Group();
  doorRR.name = 'Door_R_R';
  const panelRR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 0.88), mats.paintPrimary);
  panelRR.position.set(0.92, 0.64, -0.6);
  const winRR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.82), mats.darkTintGlass);
  winRR.position.set(0.82, 1.06, -0.6);
  doorRR.add(panelRR, winRR);
  root.add(doorRR);

  // 4. Wheels
  const wRadius = 0.35;
  const wWidth = 0.25;
  const wheelFL = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelFL.name = 'Wheel_FL';
  wheelFL.position.set(-0.92, 0.35, 1.25);
  wheelFL.rotation.y = Math.PI;
  root.add(wheelFL);

  const wheelFR = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelFR.name = 'Wheel_FR';
  wheelFR.position.set(0.92, 0.35, 1.25);
  root.add(wheelFR);

  const wheelRL = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelRL.name = 'Wheel_RL';
  wheelRL.position.set(-0.92, 0.35, -1.25);
  wheelRL.rotation.y = Math.PI;
  root.add(wheelRL);

  const wheelRR = createRealisticWheel(mats, wRadius, wWidth, false);
  wheelRR.name = 'Wheel_RR';
  wheelRR.position.set(0.92, 0.35, -1.25);
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
        console.log(`Generated high-fidelity ${filename} (${stats.size} bytes)`);
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
  console.log('Generating high-fidelity realistic automotive 3D models...');

  const prado = buildAuthenticPradoJ250();
  await exportGLB(prado, 'prado.glb');

  const sedan = buildSculptedSedan();
  await exportGLB(sedan, 'sedan.glb');

  const hatchback = buildSculptedHatchback();
  await exportGLB(hatchback, 'hatchback.glb');

  console.log('All high-fidelity 3D models exported successfully to public/assets/!');
}

main().catch(console.error);
