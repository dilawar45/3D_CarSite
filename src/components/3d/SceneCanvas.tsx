"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import CarModel from "./CarModel";
import { CARS_DATA } from "@/config/cars";

interface SceneCanvasProps {
  selectedCarId: "prado" | "sedan" | "hatchback";
  scrollProgressRef: React.RefObject<number>;
  manualExplodeFactor?: number;
}

// ── Automotive Commercial Studio Lighting ──
function StudioLighting() {
  return (
    <>
      {/* Soft Ambient Baseline */}
      <ambientLight intensity={0.8} color="#f0f4f8" />

      {/* Main Overhead Studio Softbox */}
      <directionalLight
        position={[0, 12, 0]}
        intensity={2.2}
        color="#ffffff"
      />

      {/* Primary Key Light (45-degree automotive beauty light) */}
      <directionalLight
        position={[6, 7, 7]}
        intensity={3.2}
        color="#fffbf0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Cool Horizon Fill (creates crisp metallic edge highlights) */}
      <directionalLight
        position={[-8, 4, 3]}
        intensity={1.8}
        color="#a5c9eb"
      />

      {/* Sharp Rear Halo / Rim Light */}
      <directionalLight
        position={[0, 5, -8]}
        intensity={2.8}
        color="#ffe8b3"
      />

      {/* Low Grille & Wheel Hub Accents */}
      <pointLight position={[0, 0.8, 4.2]} intensity={1.8} color="#ffffff" distance={6} />
      <pointLight position={[-2.8, 0.5, 1.5]} intensity={1.2} color="#ffffff" distance={4} />
      <pointLight position={[2.8, 0.5, 1.5]} intensity={1.2} color="#ffffff" distance={4} />
    </>
  );
}

// ── Seamless Endless Showroom Floor ──
function ShowroomFloor() {
  return (
    <group position={[0, 0, 0]}>
      {/* High-Resolution Soft Contact Shadow Under Vehicle */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.88}
        scale={14}
        blur={2.5}
        far={3.8}
        resolution={1024}
        color="#020306"
      />

      {/* Endless Studio Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#06080d"
          roughness={0.7}
          metalness={0.2}
          envMapIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function SceneCanvas({
  selectedCarId,
  scrollProgressRef,
  manualExplodeFactor,
}: SceneCanvasProps) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isClient) return null;

  const currentCar = CARS_DATA[selectedCarId];

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{
          position: isMobile ? [4.2, 1.6, 6.2] : [3.8, 1.35, 5.0],
          fov: isMobile ? 38 : 31,
        }}
        gl={{
          antialias: true,
          stencil: false,
          depth: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <Environment preset="city" environmentIntensity={0.65} />
          
          <ShowroomFloor />

          <CarModel
            key={currentCar.modelPath}
            modelPath={currentCar.modelPath}
            scrollProgressRef={scrollProgressRef}
            manualExplodeFactor={manualExplodeFactor}
          />

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={true}
            target={[0, 0.75, 0]} // Center on vehicle centroid
            minDistance={3.8}
            maxDistance={12.0}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
