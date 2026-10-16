"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CarModelProps {
  modelPath: string;
  scrollProgressRef: React.RefObject<number>;
  manualExplodeFactor?: number;
}

interface PartRecord {
  object: THREE.Object3D;
  initialPos: THREE.Vector3;
  initialRot: THREE.Euler;
  explodeOffset: THREE.Vector3;
  explodeRotOffset: THREE.Euler;
}

export default function CarModel({
  modelPath,
  scrollProgressRef,
  manualExplodeFactor,
}: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);
  const currentExplosion = useRef(0);

  // Load the GLTF model
  const gltf = useGLTF(modelPath);

  // Clone and index the vehicle parts
  const { clonedScene, parts } = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Auto-center and normalize scale
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Scale car to fit heroically in the viewport (~5.2 world units)
    const scaleFactor = 5.2 / maxDim;
    clone.scale.setScalar(scaleFactor);

    // Re-center on the showroom floor
    const boxAfter = new THREE.Box3().setFromObject(clone);
    const centerAfter = boxAfter.getCenter(new THREE.Vector3());
    clone.position.x = -centerAfter.x;
    clone.position.z = -centerAfter.z;
    clone.position.y = -boxAfter.min.y; // Sit directly on floor y = 0

    // Enhanced PBR properties on clone materials
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    // Part displacement configuration for exploded-view disassembly
    const partDefinitions: Record<
      string,
      { offset: [number, number, number]; rotOffset?: [number, number, number] }
    > = {
      Hood: { offset: [0, 0.85, 0.65], rotOffset: [0.38, 0, 0] },
      Door_F_L: { offset: [-1.0, 0.12, 0.1], rotOffset: [0, -0.32, 0] },
      Door_F_R: { offset: [1.0, 0.12, 0.1], rotOffset: [0, 0.32, 0] },
      Door_R_L: { offset: [-0.95, 0.12, -0.2], rotOffset: [0, -0.26, 0] },
      Door_R_R: { offset: [0.95, 0.12, -0.2], rotOffset: [0, 0.26, 0] },
      Wheel_FL: { offset: [-0.9, 0, 0.35], rotOffset: [0, -0.12, 0] },
      Wheel_FR: { offset: [0.9, 0, 0.35], rotOffset: [0, 0.12, 0] },
      Wheel_RL: { offset: [-0.9, 0, -0.35], rotOffset: [0, -0.08, 0] },
      Wheel_RR: { offset: [0.9, 0, -0.35], rotOffset: [0, 0.08, 0] },
      Body: { offset: [0, 0.48, 0], rotOffset: [0, 0, 0] },
    };

    const indexedParts: PartRecord[] = [];

    clone.traverse((child) => {
      const def = partDefinitions[child.name];
      if (def) {
        indexedParts.push({
          object: child,
          initialPos: child.position.clone(),
          initialRot: child.rotation.clone(),
          explodeOffset: new THREE.Vector3(...def.offset),
          explodeRotOffset: new THREE.Euler(...(def.rotOffset || [0, 0, 0])),
        });
      }
    });

    return { clonedScene: clone, parts: indexedParts };
  }, [gltf.scene]);

  // Reset positions on model swap
  useEffect(() => {
    parts.forEach((p) => {
      p.object.position.copy(p.initialPos);
      p.object.rotation.copy(p.initialRot);
    });
    currentExplosion.current = 0;
  }, [parts]);

  // Frame update loop: Scroll-driven Disassembly & Reassembly
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // 1. Read scroll progress (0.0 to 1.0)
    const rawProgress = scrollProgressRef.current ?? 0;
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      rawProgress,
      Math.min(1, delta * 5)
    );
    const p = smoothProgress.current;

    // 2. Disassembly (0% -> 68%) and Reassembly (68% -> 100%)
    let targetExplosion = 0;
    if (manualExplodeFactor !== undefined) {
      targetExplosion = manualExplodeFactor;
    } else {
      if (p <= 0.68) {
        // Disassembling outward: progress from 0 to 1
        const t = Math.min(1, p / 0.65);
        targetExplosion = t * t * (3 - 2 * t); // smoothstep
      } else {
        // Reassembling back together: progress decreases from 1 to 0
        const reassembleT = Math.min(1, (p - 0.68) / 0.3);
        const t = 1 - reassembleT;
        targetExplosion = t * t * (3 - 2 * t); // smoothstep back to flush
      }
    }

    // Dampen explosion value
    currentExplosion.current = THREE.MathUtils.lerp(
      currentExplosion.current,
      targetExplosion,
      Math.min(1, delta * 6)
    );
    const explosion = currentExplosion.current;

    // 3. Apply position & rotation transforms to all isolated components
    parts.forEach((part) => {
      part.object.position.x = THREE.MathUtils.lerp(
        part.initialPos.x,
        part.initialPos.x + part.explodeOffset.x,
        explosion
      );
      part.object.position.y = THREE.MathUtils.lerp(
        part.initialPos.y,
        part.initialPos.y + part.explodeOffset.y,
        explosion
      );
      part.object.position.z = THREE.MathUtils.lerp(
        part.initialPos.z,
        part.initialPos.z + part.explodeOffset.z,
        explosion
      );

      part.object.rotation.x = THREE.MathUtils.lerp(
        part.initialRot.x,
        part.initialRot.x + part.explodeRotOffset.x,
        explosion
      );
      part.object.rotation.y = THREE.MathUtils.lerp(
        part.initialRot.y,
        part.initialRot.y + part.explodeRotOffset.y,
        explosion
      );
      part.object.rotation.z = THREE.MathUtils.lerp(
        part.initialRot.z,
        part.initialRot.z + part.explodeRotOffset.z,
        explosion
      );
    });

    // 4. Subtle showroom stance angle (-35 degrees beauty angle) with subtle responsive turn
    const baseAngle = -Math.PI * 0.22; // -40 degrees (beauty 3/4 angle showing front + side)
    const scrollYaw = p * 0.25; // gently turns side toward viewer as parts explode
    const targetAngle = baseAngle - scrollYaw;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetAngle,
      Math.min(1, delta * 4)
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/assets/prado.glb");
useGLTF.preload("/assets/sedan.glb");
useGLTF.preload("/assets/hatchback.glb");
